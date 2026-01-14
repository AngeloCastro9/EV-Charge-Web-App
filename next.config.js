const withNextIntl = require("next-intl/plugin")(
  "./i18n/request.ts"
);

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withNextIntl(nextConfig)

