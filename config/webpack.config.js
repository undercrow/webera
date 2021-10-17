"use strict";

const DefinePlugin = require("webpack").DefinePlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const NODE_ENV = process.env.NODE_ENV || "development";
const isDev = NODE_ENV === "development" || NODE_ENV === undefined;
const isProd = NODE_ENV === "production";
function onDev(val) {
	return isDev ? val : undefined;
}
function onProd(val) {
	return isProd ? val : undefined;
}

const ROOT_PATH = path.join(__dirname, "..");
const CONFIG_PATH = path.join(ROOT_PATH, "config");
const SRC_PATH = path.join(ROOT_PATH, "src");
const ENTRY_PATH = path.join(SRC_PATH, "index.tsx");
const PUBLIC_PATH = path.join(ROOT_PATH, "public");
const BUILD_PATH = path.join(ROOT_PATH, "build");

const BASENAME = isProd ? "/webera" : "";

module.exports = {
	mode: isProd ? "production": "development",
	entry: ENTRY_PATH,
	output: {
		path: BUILD_PATH,
		filename: "js/[name].[contenthash:8].js",
		chunkFilename: "js/[name].[contenthash:8].chunk.js",
		publicPath: BASENAME,
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				oneOf: [
					{
						test: [/\.jsx?$/, /\.tsx?$/],
						include: SRC_PATH,
						use: [
							{
								loader: "babel-loader",
								options: {
									configFile: path.join(CONFIG_PATH, "babel.config.js"),
									cacheDirectory: true,
									cacheCompression: isProd,
								},
							},
							"ts-loader",
						],
					},
					{
						test: /\.css$/,
						use: [MiniCssExtractPlugin.loader, "css-loader"],
						sideEffects: true,
					},
					{
						loader: "file-loader",
						exclude: [
							/\.(js|mjs|jsx|ts|tsx)$/,
							/\.html$/,
							/\.json$/,
						],
						options: {
							name: "media/[name].[hash:8].[ext]",
						},
					},
				],
			}
		],
	},
	resolve: {
		extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
		alias: {
			react: "preact/compat",
			"react-dom": "preact/compat",
			"react/jsx-runtime": "preact/jsx-runtime"
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(PUBLIC_PATH, "index.html"),
			minify: onProd({
				collapseBooleanAttributes: true,
				collapseInlineTagWhitespace: true,
				collapseWhitespace: true,
				keepClosingSlash: true,
				minifyCSS: true,
				minifyJS: true,
				minifyURLs: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
			}),
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].[contenthash:8].css",
			chunkFilename: "css/[name].[contenthash:8].chunk.css",
		}),
		new DefinePlugin({
			BASENAME: JSON.stringify(BASENAME),
		}),
	],
	devtool: onDev("eval-source-map"),
	devServer: {
		historyApiFallback: true
	},
};
