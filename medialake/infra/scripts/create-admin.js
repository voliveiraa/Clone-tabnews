/* eslint-disable no-console */
// Cria (ou atualiza) a conta de administrador e as funções do firewall.
// Variáveis: DATABASE_URL, ADMIN_EMAIL, ADMIN_USERNAME (padrão "admin"), ADMIN_PASSWORD.
// Para trocar a senha do admin, mude ADMIN_PASSWORD e rode de novo (um novo deploy já roda).
const fs = require('node:fs');
const { join, resolve } = require('node:path');
const bcryptjs = require('bcryptjs');
const { Client } = require('pg');

const ADMIN_FEATURES = [
  'create:session',
  'read:session',
  'create:content',
  'create:content:text_root',
  'create:content:text_child',
  'update:content',
  'update:user',
  'update:user:others',
  'update:content:others',
  'ban:user',
  'read:migration',
  'create:migration',
  'create:recovery_token:username',
  'read:votes:others',
  'read:user:list',
  'read:firewall',
  'review:firewall',
];

async function main() {
  const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();

  if (!DATABASE_URL) throw new Error('DATABASE_URL não definida.');

  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(DATABASE_URL);
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  await client.connect();

  // Funções do firewall (idempotentes: CREATE OR REPLACE)
  const dir = join(resolve('.'), 'infra', 'stored-procedures');
  for (const file of fs.readdirSync(dir)) {
    await client.query(fs.readFileSync(join(dir, file), 'utf8'));
  }
  console.log('> Funções do firewall criadas.');

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log('> ADMIN_EMAIL/ADMIN_PASSWORD não definidos: admin não foi criado nem alterado.');
  } else {
    if (ADMIN_PASSWORD.length < 8) throw new Error('ADMIN_PASSWORD precisa ter pelo menos 8 caracteres.');
    const hash = await bcryptjs.hash(ADMIN_PASSWORD, 12);
    const existing = await client.query('SELECT id FROM users WHERE lower(username) = $1', [username]);
    if (existing.rowCount > 0) {
      await client.query(
        'UPDATE users SET email = $2, password = $3, features = $4, updated_at = now() WHERE id = $1',
        [existing.rows[0].id, ADMIN_EMAIL.toLowerCase(), hash, ADMIN_FEATURES],
      );
    } else {
      await client.query('INSERT INTO users (username, email, password, features) VALUES ($1, $2, $3, $4)', [
        username,
        ADMIN_EMAIL.toLowerCase(),
        hash,
        ADMIN_FEATURES,
      ]);
    }
    console.log(`> Admin "${username}" pronto (${ADMIN_EMAIL.toLowerCase()}).`);
  }

  await client.end();
}

main().catch((error) => {
  console.error('> Erro:', error.message);
  process.exit(1);
});
