module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: [
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],
  importOrder: [
    '^react$',
    '^next/(.*)$',
    '^@/lib/(.*)$',
    '^@/components/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
