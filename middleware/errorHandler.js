import logger from '../utils/logger';

const errorHandler = (err, req, res) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: statusCode,
    error: {
      message: err.message || 'Internal Server Error',
    }
  });
};

export default errorHandler;
