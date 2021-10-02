"use strict";

module.exports = (api) => {
	api.cache.using(() => process.env.NODE_ENV);

	const presets = [
		["@babel/preset-env", {
			targets: [">0.2%", "not dead", "not op_mini all"],
			useBuiltIns: "entry",
			corejs: 3,
		}],
	];
	const plugins = [
		["@babel/plugin-transform-react-jsx", {
			"pragma": "h",
			"pragmaFrag": "Fragment",
		}],
		["@babel/plugin-transform-runtime", { useESModules: true }],
	];

	return {
		presets,
		plugins,
	};
};
