import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Formato de Incidentes',
    short_name: 'Incidentes',
    description: 'Formulario para registro de incidentes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9f7fd',
    theme_color: '#897cc5',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
