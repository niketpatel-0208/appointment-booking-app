// api/knexfile.js
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/db/clinic.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  }
};