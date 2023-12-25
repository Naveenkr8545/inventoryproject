// app.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// MySQL connection setup
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root1234',
    database: 'productdb'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Middleware for parsing JSON
app.use(bodyParser.json());

// Endpoint to get all products
app.get('/products', (req, res) => {
    connection.query('SELECT * FROM products', (error, results) => {
        if (error) {
            console.error('Error fetching products from MySQL:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

// Endpoint to add a new product
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
    connection.query(query, [name, price], (error, results) => {
        if (error) {
            console.error('Error adding product to MySQL:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Product added to database:', { id: results.insertId, name, price });
            res.json({ message: 'Product added successfully', productId: results.insertId });
        }
    });
});

// Endpoint to delete a product
app.delete('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const query = 'DELETE FROM products WHERE id = ?';
    connection.query(query, [productId], (error, results) => {
        if (error) {
            console.error('Error deleting product from MySQL:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
