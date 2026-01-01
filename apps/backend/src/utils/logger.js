const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

export default {
  middleware: loggerMiddleware,
  log: (message) => console.log(`[LOG] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  info: (message) => console.info(`[INFO] ${message}`)
};
