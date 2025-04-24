import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
      contract_expire_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Failed to create table:', err);
    } else {
      console.log('Table "customers" created or already exists.');
    }
  });
});


app.get('/', (req, res) => {
    res.send('Hello from server');
});


// GET all customers
app.get('/customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) {
        return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});
  
// POST a new customer
app.post('/customers', (req, res) => {
    const { name, email, company_name, phone, profile_picture_url, contract_start_date, contract_expire_date } = req.body;

    // Validate the data
    if (!name || !email || !company_name || !phone || !contract_start_date || !contract_expire_date) {
        return res.status(400).send('All fields are required.');
    }

    const query = `
        INSERT INTO customers (name, email, company_name, phone, profile_picture_url, contract_start_date, contract_expire_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [name, email, company_name, phone, profile_picture_url, contract_start_date, contract_expire_date],
        (err, results) => {
        if (err) {
            console.error('Failed to add customer:', err);
            return res.status(500).send('Failed to add customer');
        }
        res.status(201).json({
            id: results.insertId,
            name,
            email,
            company_name,
            phone,
            profile_picture_url,
            contract_start_date,
            contract_expire_date,
        });
        }
    );
});

app.delete('/customers/:id', (req, res) => {
    const customerId = req.params.id;
    db.query('DELETE FROM customers WHERE id = ?', [customerId], (err, result) => {
        if (err) {
        console.error('Failed to delete customer:', err);
        return res.status(500).send('Error deleting customer');
        }
        res.status(200).send('Customer deleted');
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
