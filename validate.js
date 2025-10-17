// middleware/validate.js
// Validation middleware for product creation and update

const { ValidationError } = require('../errors/errors');

function isBooleanLike(val) {
  return typeof val === 'boolean' || val === 'true' || val === 'false' || val === 0 || val === 1;
}

exports.validateProduct = (mode = 'create') => (req, res, next) => {
  const payload = req.body || {};
  const errors = [];

  if (mode === 'create') {
    if (!payload.name || typeof payload.name !== 'string') errors.push('name is required and must be a string');
    if (!payload.description || typeof payload.description !== 'string') errors.push('description is required and must be a string');
    if (payload.price === undefined || typeof payload.price !== 'number') errors.push('price is required and must be a number');
    if (!payload.category || typeof payload.category !== 'string') errors.push('category is required and must be a string');
    if (payload.inStock === undefined) errors.push('inStock is required and must be boolean');
    else if (!isBooleanLike(payload.inStock)) errors.push('inStock must be boolean');
  } else if (mode === 'update') {
    // For update allow partials but validate types if provided
    if (payload.name !== undefined && typeof payload.name !== 'string') errors.push('name must be a string');
    if (payload.description !== undefined && typeof payload.description !== 'string') errors.push('description must be a string');
    if (payload.price !== undefined && typeof payload.price !== 'number') errors.push('price must be a number');
    if (payload.category !== undefined && typeof payload.category !== 'string') errors.push('category must be a string');
    if (payload.inStock !== undefined && !isBooleanLike(payload.inStock)) errors.push('inStock must be boolean');
  }

  if (errors.length) {
    return next(new ValidationError(errors.join('; ')));
  }
  // Normalize boolean-like inStock for convenience
  if (payload.inStock !== undefined) {
    if (payload.inStock === 'true' || payload.inStock === true || payload.inStock === 1) req.body.inStock = true;
    else req.body.inStock = false;
  }

  next();
};
