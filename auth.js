// middleware/auth.js
// API key authentication middleware
// Exposes requireApiKey middleware which checks the header 'x-api-key' against process.env.API_KEY

const { UnauthorizedError } = require('../errors/errors');

const API_KEY = process.env.API_KEY || ''; // set in .env for real use

exports.requireApiKey = (req, res, next) => {
  const key = req.header('x-api-key') || req.header('X-API-KEY');
  if (!API_KEY) {
    // If no API key configured on server, treat as open (useful for local dev)
    return next();
  }
  if (!key || key !== API_KEY) {
    return next(new UnauthorizedError('Invalid or missing API key'));
  }
  next();
};
