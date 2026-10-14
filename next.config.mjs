/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fotos de até 4 MB passam pela ação de envio (o padrão é 1 MB).
  experimental: { serverActions: { bodySizeLimit: "4.5mb" } },
};
export default nextConfig;
