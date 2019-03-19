let path = require('path')

module.exports = {
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			// 为生产环境修改配置...
		} else {
			// 为开发环境修改配置...
			return {
				devServer: {
					host: 'localhost.sf-express.com',
					port: 8087,
					// assetsSubDirectory: 'static',
					// contentBase: path.join(__dirname, './static'),				
					// staticOptions: {
					// 	redirect: false
					// }
				},	
			}
		}
	}
};
