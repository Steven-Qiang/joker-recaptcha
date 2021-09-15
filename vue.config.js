
module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? '/joke_recaptcha/' : '',
    configureWebpack: config => {
        config.externals = {
            'vue': 'Vue'
        };
    },
}