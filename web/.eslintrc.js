module.exports = {
	env: {
		browser: true,
		es2021: true,
		'jest/globals': true
	},
	extends: [
		'plugin:react/recommended',
		'standard',
		'plugin:jest/recommended',
		'plugin:@typescript-eslint/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: 'module'
	},
	plugins: ['react', '@typescript-eslint', 'jest'],
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': 'off',
		'no-useless-constructor': 'off',
		semi: ['error', 'always'],
		'react/react-in-jsx-scope': 'off',
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': ['error'],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
		'@typescript-eslint/no-explicit-any': 'off'
	},
	globals: {
		React: true,
		JSX: true
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				project: ['./tsconfig.json']
			}
		}
	]
};
