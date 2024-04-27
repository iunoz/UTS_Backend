const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users (pagination and filtering)
 * @param {number} pageNumber - Page Number
 * @param {number} pageSize - Page Size
 * @param {string} sort - Sorting
 * @param {string} search - Searching
 * @returns {Array}
 */
async function getUsers(pageNumber, pageSize, sort, search) {
  // menghitung nilai skip utk pagination
  const skip = (pageNumber - 1) * pageSize;
  let query = {};
  // membuat query jika adanya parameter
  if (search) {
    const [field, value] = search.split(':');
    query[field] = { $regex: value, $options: 'i' }; //'i' berfungsi utk membuat suatu pencarian tidak sensitif (case sensitive)
  }
  // membust sortQuery utk mengurutkan data jika diberikan parameternya
  let sortQuery = {};
  if (sort) {
    const [field, order] = sort.split(':');
    sortQuery[field] = order === 'desc' ? -1 : 1;
  }

  // mengambil users dari repo dgn filter, pagination, dan sorting yg benar
  const users = await usersRepository.getUsers(
    query,
    skip,
    pageSize,
    sortQuery
  );
  return users;
}

/**
 * Get total count of users based on search keyword
 * @param {string} search - Search
 * @return {number} - Total count of users
 */
async function getUsersCount(search) {
  let query = {};

  //membuat query jika adanya parameter
  if (search) {
    query = {
      $or: [
        {
          name: { $regex: search, $options: 'i' },
        },
        {
          email: { $regex: search, $options: 'i' },
        },
      ],
    };
  }

  //menghitung total jumlah users yg sesuai dgn query
  const total = await usersRepository.getUsersCount(query);
  return total;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUsersCount,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
