// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss"],
  generate: {
    routes: ["/"],
  },
  runtimeConfig: {
    public: {
      ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY,
    },
  },

  css: ["@/assets/styles/main.scss"],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Transly",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Instant, Free and Accurate Transcription",
        },

        { hid: "og:image", property: "og:image", content: "/icon.png" },
      ],

      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
