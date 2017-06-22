const cimico = require('../index');

const logger = cimico('app', {
  baseDir: __dirname,
  // prettyJSON: false,
  // prettyError: false,
});

logger.log('Wake up in the mornign', 'and it raise');
logger.error('This is supposed to be an error', new Error('Yes this an error'));
logger.success('This is success with object', {
  var: 'data',
  arr: [1, 2, 3, 4],
  nested: {
    pro: {
      strings: ['one', 'two'],
    },
    logger,
  },
});
logger.debug({
  var: 'data',
  arr: [1, 2, 3, 4],
  nested: {
    pro: {
      strings: ['one', 'two'],
    },
    logger,
  },
});

logger.format(
  'This is bold=%b and this is underline=%u and this is both %bu',
  'bold',
  'underline',
  'everything',
);

logger.format('This is %b(bold) and this is %u(under)', 'bold', 'underline');
