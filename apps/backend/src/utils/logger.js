export default {
  log: (message) => console.log(`[LOG] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  info: (message) => console.info(`[INFO] ${message}`)
};
