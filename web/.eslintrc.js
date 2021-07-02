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
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-member-accessibility': 'error',
		'@typescript-eslint/member-ordering': [
			'error',
			{
				default: [
					// Index signature
					'signature',

					// Fields
					'public-static-field',
					'protected-static-field',
					'private-static-field',

					'public-decorated-field',
					'protected-decorated-field',
					'private-decorated-field',

					'public-instance-field',
					'protected-instance-field',
					'private-instance-field',

					'public-abstract-field',
					'protected-abstract-field',
					'private-abstract-field',

					'public-field',
					'protected-field',
					'private-field',

					'static-field',
					'instance-field',
					'abstract-field',

					'decorated-field',

					'field',

					// Constructors
					'public-constructor',
					'protected-constructor',
					'private-constructor',

					'constructor',

					// Methods
					'public-static-method',
					'protected-static-method',
					'private-static-method',

					'public-decorated-method',
					'protected-decorated-method',
					'private-decorated-method',

					'public-instance-method',
					'protected-instance-method',
					'private-instance-method',

					'public-abstract-method',
					'protected-abstract-method',
					'private-abstract-method',

					'public-method',
					'protected-method',
					'private-method',

					'static-method',
					'instance-method',
					'abstract-method',

					'decorated-method',

					'method'
				]
			}
		],

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
