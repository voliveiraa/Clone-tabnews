import { DefaultLayout, Heading } from '@/TabNewsUI';

export default function Sobre() {
  return (
    <DefaultLayout metadata={{ title: 'Sobre', description: 'Sobre o MediaLake.' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 0' }}>
        <Heading as="h1" style={{ marginBottom: 16 }}>
          Sobre o MediaLake
        </Heading>
        <p>
          O MediaLake reúne os fundamentos de broadcast em publicações curtas: do sinal de vídeo ao HDR, do SDI ao vídeo
          sobre IP. O conteúdo é escrito de forma contínua.
        </p>
        <p>
          Este site é baseado no código aberto do{' '}
          <a href="https://github.com/filipedeschamps/tabnews.com.br">TabNews</a> (licença MIT).
        </p>
      </div>
    </DefaultLayout>
  );
}
