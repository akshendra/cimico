const cimico = require('../index');

const logger = cimico('app', {
  baseDir: __dirname,
  pretty: 'none',
  timestamp: false,
  filename: false,
  colors: true,
});

logger.fn().log('Wake up in the mornign', 'and it raise');
logger.fn().info('A little information', 'and it raise');
logger.ts().error(
  'This is supposed to be an error',
  new Error('Yes this an error')
);
logger.ts().fn().success('This is success with object', process.argv);

logger.p().debug(process.argv, 'what is there is another string', process.config, 'And here we go again', null);

logger.p().warn('You have been warned', new Error('It is a warnign but still'));
logger.p().colors(false).error(new Error('No color, I want to cry'));

// logger.f.l(
//   'This is bold=%b and this is underline=%u and this is both %bu',
//   'bold',
//   'underline',
//   'everything'
// );
// logger.f.c.s(
//   '%(object) and %(array)',
//   {
//     var: 'data',
//     arr: [1, 2, 3, 4]
//   },
//   ['what', 'do', 'you', 'mean']
// );

// logger.f.p.ts.fn.e(
//   '%(object) and %(array)',
//   {
//     var: 'data',
//     arr: [1, 2, 3, 4]
//   },
//   ['what', 'do', 'you', 'mean']
// );

// defLogger.log('This is just too much');