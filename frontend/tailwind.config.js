/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			container: {
				center: 'true',
				padding: '1rem'
			},
			zIndex: {
				'100': '100',
				'1030': '1030'
			},
			minWidth: {
				'350': '21.875rem',
				'500': '31.25rem'
			},
			width: {
				'350': '21.875rem',
				'500': '31.25rem'
			},
			minHeight: {
				'350': '21.875rem',
				'500': '31.25rem'
			},
			height: {
				'350': '21.875rem',
				'500': '31.25rem'
			},
			colors: {
				success: "#32A336",
				info: "#17a2b8",
				warning: "#ffc107",
				danger: "#c82333",
				midnight: '#121212',
				widget: '#262626',
				input: '#393939'
			}
		},
	},
	plugins: [],
}