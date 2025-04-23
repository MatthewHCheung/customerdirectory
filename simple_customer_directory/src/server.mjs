import mysql from 'mysql2';


// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Meawesome123$m',
  database: 'reid_petroleum',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create the 'users' table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      company_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      profile_picture_url VARCHAR(255),
      contract_start_date DATE NOT NULL,
      contract_end_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Failed to create table:', err);
    } else {
      console.log('Table "users" created or already exists.');
    }
  });
});