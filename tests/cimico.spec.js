const cimico = require('../index');

const testObj = {
  key: {
    value: 'staring',
    number: 134,
    boolean: true,
    not: null,
  },
  whatever: {
    dee: {
      relly: {
        number: 13,
        string: 'aksj',
      },
    },
  },
};

const logger = cimico({
  baseDir: __dirname,
  pretty: 'none',
  filename: false,
  colors: true,
});

logger.fn().log('Wake up in the mornign', 'and it raise');
logger.fn().info('A little information', 'and it raise');
logger.error('This is supposed to be an error', new Error('Yes this an error'));
logger.fn().success('This is success with object', process.argv);
logger.fn().success('This is success with object', testObj);
logger.p().debug(process.argv, 'what is there is another string', testObj, 'And here we go again', null);
logger.p().warn('You have been warned', new Error('It is a warnign but still'));
logger.p().colors(false).error(new Error('No color, I want to cry'));

const appLogger = cimico('app', {
  baseDir: __dirname,
});

appLogger.fn().log('Wake up in the mornign', 'and it raise');
appLogger.fn().info('A little information', 'and it raise');
appLogger.error('This is supposed to be an error', new Error('Yes this an error'));
appLogger.fn().success('This is success with array', process.argv);
appLogger.fn().info('This is info with object', testObj);
appLogger.p().debug(process.argv, 'what is there is another string', testObj, 'And here we go again', null);
appLogger.p().warn('You have been warned', new Error('It is a warnign but still'));
appLogger.p().colors(false).error(new Error('No color, I want to cry'));

logger.log(
  'This is bold=%b and this is underline=%u and this is both %bu',
  'bold',
  'underline',
  'everything'
);

logger.colors(true).log('%b and %u', testObj, ['what', 'do', 'you', 'mean']);

logger.pretty().success(
  '%u and %b',
  testObj,
  ['what', 'do', 'you', 'mean']
);
