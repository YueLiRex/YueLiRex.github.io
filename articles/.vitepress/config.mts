import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Yue's Tech Notes",
  description: "I am sharing my learning, thoughts, ideas, here",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Articles', link: '/articles' },
      { text: 'Who am I', link: '/who-am-i' },
    ],

    sidebar: [
      {
        text: 'Rust',
        items: [
          { text: 'Everything about Rust ownership', link: '/rust/rust-ownership-explained' },
        ]
      },
      {
        text: 'Scala',
        items: [
          { text: 'Introduce to Cats-effect', link: '/scala/' },
        ]
      },
      {
        text: 'Data Engineering',
        items: [
          { text: 'Introduce to Apache Iceberg', link: '/rust' },
          { text: 'Apache Hudi 101', link: '/scala' },
        ]
      },
      {
        text: 'Devops',
        items: [
          { text: 'An Usecase of K8S webhook', link: '/rust' },
        ]
      },
      {
        text: 'Interesting Projects',
        items: [
          { text: 'Golang rest framework - Hertz', link: '/rust' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yuelirex' }
    ]
  }
})
