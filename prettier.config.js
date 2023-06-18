const organizeImports = require('prettier-plugin-organize-imports');

module.exports = {
	plugins: [organizeImports],
	organizeImportsSkipDestructiveCodeActions: true,
	printWidth: 140,
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: true,
};
