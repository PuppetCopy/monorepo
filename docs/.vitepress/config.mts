import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Puppet Docs",
  description: "Matching top Traders with Investors",
  themeConfig: {
    logo: '/puppet.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        collapsed: true,
        text: 'Examples',
        items: [
            {
          text: 'PuppetToken.sol',
          link: '/contracts/tokenomics/PuppetToken',
        },
        {
          text: 'VotingEscrow.sol',
          link: '/contracts/tokenomics/VotingEscrow',
        },
        {
          text: 'RevenueLogic.sol',
          link: '/contracts/tokenomics/RevenueLogic',
        },
        {
          text: 'RewardLogic.sol',
          link: '/contracts/tokenomics/RewardLogic',
        },
          { text: 'Genesis Chat', link: 'https://t.me/+ooS1qp3Ar7xlYWNk' },
          { text: 'App', link: 'https://puppet.house/app/trade' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
