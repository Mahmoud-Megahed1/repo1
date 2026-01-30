export default {
  '*': () => 'tsc --noEmit',
  '*.{js,ts,jsx,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css,scss}': ['prettier --write'],
};
