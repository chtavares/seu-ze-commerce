module.exports = {
  spec: 'src/**/*/*.spec.ts',
  require: ['ts-node/register'],
  asyncOnly: true,
  timeout: '20000',
  // retries: 2,
  exit: true,
  bail: true,
};
