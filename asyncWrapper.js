// middleware/asyncWrapper.js
// Wrap async route handlers to forward errors to the express error handler

module.exports = function asyncWrapper(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
