const Cimico = require('../src/cimico');

const logger = new Cimico({}, 'app', __dirname);

logger.log('Wake up in the mornign', 'and it raise');
logger.error('This is supposed to be an error', new Error('Yes this an error'));
