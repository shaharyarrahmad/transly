// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/styles/main.scss'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Transly',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Instant, Free and Accurate Transcription' },

        { hid: 'og:image', property: 'og:image', content: '/icon.png' },
      ],


    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
      // {rel: 'apple-touch-icon' , href: '/icon.png'},
    ],
    }

  }

})