// controllers/productsController.js
// Controller logic for products. Uses in-memory array as data store.

const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require('../errors/errors');

// In-memory datastore (replace with DB for production)
const products = [
  // sample data
  {
    id: uuidv4(),
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 24.99,
    category: 'electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Notebook',
    description: '200 page ruled notebook',
    price: 3.5,
    category: 'stationery',
    inStock: true
  }
];

// Helper: find index by id
function findIndexById(id) {
  return products.findIndex(p => p.id === id);
}

exports.listProducts = async (req, res) => {
  // Filtering by category, pagination, optional min/max price
  const { category, page = 1, limit = 10, minPrice, maxPrice } = req.query;
  let result = products.slice();

  if (category) {
    result = result.filter(p => String(p.category).toLowerCase() === String(category).toLowerCase());
  }

  if (minPrice !== undefined) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) result = result.filter(p => p.price >= min);
  }
  if (maxPrice !== undefined) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) result = result.filter(p => p.price <= max);
  }

  // Pagination
  const pg = Math.max(1, parseInt(page, 10) || 1);
  const lim = Math.max(1, parseInt(limit, 10) || 10);
  const start = (pg - 1) * lim;
  const paged = result.slice(start, start + lim);

  res.json({
    total: result.length,
    page: pg,
    limit: lim,
    data: paged
  });
};

exports.getProductById = async (req, res) => {
  const id = req.params.id;
  const product = products.find(p => p.id === id);
  if (!product) throw new NotFoundError(`Product with id ${id} not found`);
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: !!inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const idx = findIndexById(id);
  if (idx === -1) throw new NotFoundError(`Product with id ${id} not found`);
  const { name, description, price, category, inStock } = req.body;
  // Only update provided fields
  if (name !== undefined) products[idx].name = name;
  if (description !== undefined) products[idx].description = description;
  if (price !== undefined) products[idx].price = price;
  if (category !== undefined) products[idx].category = category;
  if (inStock !== undefined) products[idx].inStock = !!inStock;
  res.json(products[idx]);
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  const idx = findIndexById(id);
  if (idx === -1) throw new NotFoundError(`Product with id ${id} not found`);
  const removed = products.splice(idx, 1)[0];
  res.json({ deleted: true, product: removed });
};

exports.searchProducts = async (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) {
    return res.json({ total: 0, data: [] });
  }
  const matches = products.filter(p => String(p.name).toLowerCase().includes(q));
  res.json({ total: matches.length, data: matches });
};

exports.productsStats = async (req, res) => {
  // Count by category
  const stats = products.reduce((acc, p) => {
    const c = p.category || 'uncategorized';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  res.json({ stats, totalProducts: products.length });
};
