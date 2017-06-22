const cimico = require('../index');

const logger = cimico('app', {
  baseDir: __dirname,
  pretty: false,
  format: false,
  timestamp: false,
  filename: false,
  color: false,
});

logger.log('Wake up in the mornign', 'and it raise');
logger.error('This is supposed to be an error', new Error('Yes this an error'));
logger.success('This is success with object', {
  var: 'data',
  arr: [1, 2, 3, 4],
});
logger.debug({
  var: 'data',
  arr: [1, 2, 3, 4],
});

logger.f.l(
  'This is bold=%b and this is underline=%u and this is both %bu',
  'bold',
  'underline',
  'everything',
);
logger.f.s(
  '%(object) and %(array)',
  {
    var: 'data',
    arr: [1, 2, 3, 4],
  },
  ['what', 'do', 'you', 'mean'],
);

logger.f.p.e(
  '%(object) and %(array)',
  {
    var: 'data',
    arr: [1, 2, 3, 4],
  },
  ['what', 'do', 'you', 'mean'],
);
