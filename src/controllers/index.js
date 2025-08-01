/*const mysql = require ('mysql2/promise');
const { connectToDatabase } = require('../config/database');

class IndexController {
    constructor() {
        this.initDB();
    }

    // Initialize the database connection
    async initDB() {
        this.db = await connectToDatabase();
        console.log("Database initialized successfully");
    }

    // Get list of all companies
    async getCompanies(req, res) {
        try {
            const [rows] = await this.db.query('SELECT * FROM Companies');
            res.json(rows); // Corrected: Use res.json() to send the data as a JSON response
        } catch (error) {
            console.error("Error fetching companies:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // Create a new company
    async createCompanies(req, res) {
        try {
            // Destructure data from request body
            const { ticker_symbol, company_name, sector, stock_price, market_cap } = req.body;
    
            // Validate required fields
            if (!ticker_symbol || !company_name || !sector || !stock_price || !market_cap) {
                return res.status(400).json({ error: "All fields are required" });
            }
    
            // Insert the company data into the 'Companies' table
            const [result] = await this.db.query(
                `INSERT INTO Companies (ticker_symbol, company_name, sector, stock_price, market_cap)
                 VALUES (?, ?, ?, ?, ?)`,
                [ticker_symbol, company_name, sector, stock_price, market_cap]
            );
    
            // Respond with the inserted company data and status 201 (Created)
            res.status(201).json({
                ticker_symbol,
                company_name,
                sector,
                stock_price,
                market_cap,
                //updated_at: new Date()  // Server-generated timestamp
            });
        } catch (error) {
            console.error("Error creating company:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    
}

module.exports = { IndexController };*/


const mysql = require ('mysql2/promise');
const { connectToDatabase } = require('../config/database');

class IndexController {
    constructor() {
        this.initDB();
    }

    // Initialize the database connection
    async initDB() {
        this.db = await connectToDatabase();
        console.log("Database initialized successfully");
    }

    // Get list of all transactions
    async getTransactions(req, res) {
        try {
            const [rows] = await this.db.query('SELECT * FROM transactions');
            res.json(rows);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // Create a new transaction
    async createTransactions(req, res) {
        try {
            const {
                user_id,
                username,
                company_name,
                ticker_symbol,
                transaction_type,
                quantity,
                price_per_share
            } = req.body;

            // Validate required fields
            if (
                !user_id ||
                !username ||
                !company_name ||
                !ticker_symbol ||
                !transaction_type ||
                !quantity ||
                !price_per_share
            ) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Insert the transaction data
            const [result] = await this.db.query(
                `INSERT INTO transactions 
                 (user_id, username, company_name, ticker_symbol, transaction_type, quantity, price_per_share)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user_id, username, company_name, ticker_symbol, transaction_type, quantity, price_per_share]
            );

            // Fetch the inserted row (optional)
            const [insertedRow] = await this.db.query(
                'SELECT * FROM transactions WHERE transaction_id = ?',
                [result.insertId]
            );

            res.status(201).json(insertedRow[0]);
        } catch (error) {
            console.error("Error creating transaction:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async getCompanies(req, res) {
        try {
            const [rows] = await this.db.query('SELECT * FROM Companies');
            res.json(rows); // Corrected: Use res.json() to send the data as a JSON response
        } catch (error) {
            console.error("Error fetching companies:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // Create a new company
    async createCompanies(req, res) {
        try {
            // Destructure data from request body
            const { ticker_symbol, company_name, sector, stock_price, market_cap } = req.body;
    
            // Validate required fields
            if (!ticker_symbol || !company_name || !sector || !stock_price || !market_cap) {
                return res.status(400).json({ error: "All fields are required" });
            }
    
            // Insert the company data into the 'Companies' table
            const [result] = await this.db.query(
                `INSERT INTO Companies (ticker_symbol, company_name, sector, stock_price, market_cap)
                 VALUES (?, ?, ?, ?, ?)`,
                [ticker_symbol, company_name, sector, stock_price, market_cap]
            );
    
            // Respond with the inserted company data and status 201 (Created)
            res.status(201).json({
                ticker_symbol,
                company_name,
                sector,
                stock_price,
                market_cap,
                //updated_at: new Date()  // Server-generated timestamp
            });
        } catch (error) {
            console.error("Error creating company:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async getUsers(req, res) {
        try {
            const [rows] = await this.db.query('SELECT * FROM Users');
            res.json(rows); // Corrected: Use res.json() to send the data as a JSON response
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // Create a new user
    async createUsers(req, res) {
        try {
            // Destructure data from request body
            const { name ,email } = req.body;
    
            // Validate required fields
            if ( !name || !email) {
                return res.status(400).json({ error: "All fields are required" });
            }
    
            // Insert the user data into the 'user' table
            const [result] = await this.db.query(
                `INSERT INTO Users (name ,email)
                 VALUES (?, ?)`,
                [name ,email]
            );
    
            // Respond with the inserted company data and status 201 (Created)
            res.status(201).json({
                name,
                email,
                //updated_at: new Date()  // Server-generated timestamp
            });
        } catch (error) {
            console.error("Error creating company:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = { IndexController };




