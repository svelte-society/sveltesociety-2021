const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
		  'display': ['Manrope'],
		  'body': ['Manrope']
		},
		extend: {
		  colors: {
			primary: 'rgb(var(--color-primary) / <alpha-value>)',
			secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
		  }
		}
	  },

	plugins: [forms, typography]
};

module.exports = config;
