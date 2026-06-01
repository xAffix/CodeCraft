/**
 * Global error handler middleware.
 * Catches unhandled errors and returns a consistent JSON response.
 */
function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * 404 handler for unknown routes.
 */
function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}

module.exports = { errorHandler, notFoundHandler };
