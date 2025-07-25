/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mrbuild.co.za', // Replace with your actual domain
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  exclude: ['/admin/**', '/404'],
};
