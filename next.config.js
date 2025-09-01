/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  // Otimizações para Netlify
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  
  // Configurações de webpack para Netlify
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
    }
    return config;
  },
  
  async redirects() {
    return [
      // Corrige acessos ao caminho antigo com C cedilha/português incorreto
      {
        source: '/colaborador/grafologico',
        destination: '/colaborador/grafologia',
        permanent: false,
      },
      {
        source: '/colaborador/grafologico/:path*',
        destination: '/colaborador/grafologia/:path*',
        permanent: false,
      },
    ];
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
