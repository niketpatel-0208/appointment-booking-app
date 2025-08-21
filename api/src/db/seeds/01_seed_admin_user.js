const bcrypt = require('bcryptjs');

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries from users table
  await knex('users').del();

  // Hash the password
  const passwordHash = await bcrypt.hash('Passw0rd!', 10);

  // Inserts seed entries
  await knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: passwordHash,
      role: 'admin'
    },
  ]);
};
