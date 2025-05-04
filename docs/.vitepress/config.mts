import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Puppet Docs',
  description: 'Matching top Traders with Investors',
  vite: {
    publicDir: 'public',
  },
  themeConfig: {
    logo: 'assets/puppet.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar: [
      {
        collapsed: false,
        text: 'Introduction',
        items: [
          {
            text: 'What is Puppet?',
            link: '/pages/introduction',
          },
          {
            text: 'Tokenomics',
            link: '/pages/tokenomics',
          },
        ],
      },
      {
        collapsed: false,
        text: 'Sources',
        link: '/pages/__generated/contracts',
        items: [
          {
            text: 'Position',
            items: [
              {
                text: 'MirrorPosition',
                link: '/pages/__generated/position/MirrorPosition',
              },
              {
                text: 'MatchingRule',
                link: '/pages/__generated/position/MatchingRule',
              },
            ],
          },
          {
            text: 'Tokenomics',
            items: [
              {
                text: 'PuppetToken.sol',
                link: '/pages/__generated/tokenomics/PuppetToken',
              },
              {
                text: 'RewardDistributor.sol',
                link: '/pages/__generated/tokenomics/RewardDistributor',
              },
              {
                text: 'VotingEscrow.sol',
                link: '/pages/__generated/tokenomics/VotingEscrow',
              },
            ],
          },
          {
            text: 'License',
            link: '/pages/__generated/license',
          },
        ],
      },
    ],
    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"/></svg>',
        },
        link: 'https://t.me/+ooS1qp3Ar7xlYWNk',
      },
      { icon: 'github', link: 'https://github.com/GMX-Blueberry-Club/puppet-contracts' },
    ],
  },
})
