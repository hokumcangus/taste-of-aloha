const db = require('../config/database');

/**
 * Get all snacks from database
 * @returns {Promise<Array>} Array of snacks
 */
exports.getAll = async () => {
  const result = await db.query('SELECT * FROM snacks ORDER BY id');
  return result.rows;
};

/**
 * Get snack by ID
 * @param {number} id - Snack ID
 * @returns {Promise<Object|null>} Snack object or null if not found
 */
exports.getById = async (id) => {
  const result = await db.query('SELECT * FROM snacks WHERE id = $1', [id]);
  return result.rows[0] || null;
};

/**
 * Create a new snack
 * @param {Object} snack - Snack data
 * @returns {Promise<Object>} Created snack
 */
exports.create = async (snack) => {
  const { name, description, price, image_url, category, available = true } = snack;
  const result = await db.query(
    `INSERT INTO snacks (name, description, price, image_url, category, available) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [name, description, price, image_url, category, available]
  );
  return result.rows[0];
};

/**
 * Update snack by ID
 * @param {number} id - Snack ID
 * @param {Object} updatedSnack - Updated snack data
 * @returns {Promise<Object|null>} Updated snack or null if not found
 */
exports.updateById = async (id, updatedSnack) => {
  const { name, description, price, image_url, category, available } = updatedSnack;
  const result = await db.query(
    `UPDATE snacks 
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         price = COALESCE($3, price),
         image_url = COALESCE($4, image_url),
         category = COALESCE($5, category),
         available = COALESCE($6, available)
     WHERE id = $7
     RETURNING *`,
    [name, description, price, image_url, category, available, id]
  );
  return result.rows[0] || null;
};

/**
 * Delete snack by ID
 * @param {number} id - Snack ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
exports.deleteById = async (id) => {
  const result = await db.query('DELETE FROM snacks WHERE id = $1 RETURNING *', [id]);
  return result.rows.length > 0;
};
