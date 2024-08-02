// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Resolve safevalues module path using CommonJS syntax
    const safevaluesPath = require.resolve('safevalues');

    // Add custom Webpack configuration here
    config.resolve.alias['safevalues'] = safevaluesPath;

    // Fix for the 'Cannot get final name for export' error
    config.module.rules.push({
      test: /node_modules\/safevalues\/dist\/mjs\/index.js/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-modules-commonjs'],
        },
      },
    });

    return config;
  },
};
