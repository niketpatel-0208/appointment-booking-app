    // api/knexfile.js
    require('dotenv').config({ path: './.env' });

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
      },

      production: {
        client: 'pg', // Use the postgres client
        connection: process.env.DATABASE_URL, // This will come from Render's environment variables
        migrations: {
          directory: './src/db/migrations'
        },
        seeds: {
          directory: './src/db/seeds'
        },
        ssl: { rejectUnauthorized: false } // Required for Neon DB connection
      }
    };
    