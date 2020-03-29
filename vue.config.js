process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  lintOnSave: false,
  baseUrl: process.env.VUE_APP_BASE_URL || '/',
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import '@/common/scss/settings/_settings.variables.scss';
          @import '@/common/scss/tools/_tools.bem.scss';
        `,
      },
    },
  },
};
