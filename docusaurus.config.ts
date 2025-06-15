import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'FamilyVault',
    tagline: 'Aplikacja mobilna E2EE dla rodziny',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://familyvault.pl',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/pz2024/zesp01/docs',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'FamilyVaultApp', // Usually your GitHub org/user name.
    projectName: 'FamilyVault', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        navbar: {
            title: 'FamilyVault',
            logo: {
                alt: 'FamilyVaultLogo',
                src: 'img/app-icon.png',
            },
            items: [
                {
                    href: 'https://github.com/orgs/FamilyVaultApp',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Odnośniki',
                    items: [
                        {
                            label: 'Strona projektu',
                            href: 'https://familyvault.pl/',
                        },
                        {
                            label: 'Github',
                            href: 'https://github.com/orgs/FamilyVaultApp',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} FamilyVault.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
