module.exports = {
  plugins: [
    require('tailwindcss'),
    require('postcss-import'),
    require('postcss-preset-env')({
      stage: 1,
    }),
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-flexbugs-fixes'),
  	require('cssnano')
  ],
};
