
module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? '/joke-recaptcha/' : '',
    configureWebpack: config => {
        config.externals = {
            'vue': 'Vue'
        };
    },
}