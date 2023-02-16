const path = require('path')
var WebpackObfuscator = require('webpack-obfuscator');
module.exports = {
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	template: {
		head: {
			links: [
				{
				rel: 'stylesheet',
				href:
					'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.css',
				integrity: 'sha512-1hsteeq9xTM5CX6NsXiJu3Y/g+tj+IIwtZMtTisemEv3hx+S9ngaW4nryrNcPM4xGzINcKbwUJtojslX2KG+DQ==',
				crossorigin: 'anonymous'
				}
			]
		}
	},
	// components: 'src/components/**/[A-Z]*.vue',
	// defaultExample: true,
	sections: [
	  {
	    name: 'Components',
	    components: 'src/components/[A-Z]*.vue'
	  },
	  {
	    name: 'Transitions',
	    components: 'src/components/Transitions/[A-Z]*.vue'
	  },
	],
	webpackConfig: {
	  // custom config goes here
	  
	},
	exampleMode: 'expand',
	tocMode: 'expand',
	usageMode: 'expand',
	simpleEditor: false
}
