const { User } = require('../../../models');

/**
 * Get a list of users (pagination and filtering)
 * @param {object} query - Query object
 * @param {number} skip - Number of documents to skip
 * @param {number} limit - Limit number or max number documents to return
 * @param {object} sort - Sorting object
 * @returns {Promise}
 */
async function getUsers(query, skip, limit, sort) {
  // ambil users dari database dgn filter, pagination dan sorting
  return User.find(query).skip(skip).limit(limit).sort(sort);
}

/**
 * Get total count of users based on search keyword
 * @param {string} query - Query object
 * @return {number} - Total count of users
 */
async function getUsersCount(query) {
  // menghitung jumlah users yg sesuai dgn query
  return User.countDocuments(query); // User.countDocuments itu metode dlm mongoose utk menghitung jumlah docs
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUsersCount,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
