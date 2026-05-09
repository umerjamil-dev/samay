const mysql = require('mysql2/promise');

async function updateDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simba_luxury_db'
  });

  try {
    console.log('Adding id_number column to bookings table...');
    await connection.execute('ALTER TABLE bookings ADD COLUMN id_number VARCHAR(50) AFTER phone;');
    console.log('Successfully updated database.');
  } catch (err) {
    if (err.code === 'ER_DUP_COLUMN_NAME') {
      console.log('Column id_number already exists.');
    } else {
      console.error('Error updating database:', err);
    }
  } finally {
    await connection.end();
  }
}

updateDb();
