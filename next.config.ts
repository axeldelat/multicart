import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Página Fortinet retirada del sitio; redirige la URL antigua (ya indexada) al inicio.
      { source: "/fortinet-para-pymes", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
