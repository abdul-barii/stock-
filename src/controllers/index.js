const mysql = require('mysql2/promise');
const { connectToDatabase } = require('../config/database');

class IndexController {
    constructor() {
        this.db = null;
        this.initDB().catch(err => {
            console.error("❌ Failed to initialize DB:", err);
        });
    }

    async initDB() {
        this.db = await connectToDatabase();
        console.log("✅ Database initialized successfully");
    }



    // ✅ ---------- COMPANIES ----------
    async getCompanies(req, res) {
        try {
            const [rows] = await this.db.query('SELECT * FROM Companies');
            res.json(rows);
        } catch (error) {
            console.error("Error fetching companies:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async createCompanies(req, res) {
        try {
            const { ticker_symbol, company_name, sector, stock_price, market_cap } = req.body;

            if (!ticker_symbol || !company_name || !sector || !stock_price || !market_cap) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const [result] = await this.db.query(
                `INSERT INTO Companies (ticker_symbol, company_name, sector, stock_price, market_cap)
                 VALUES (?, ?, ?, ?, ?)`,
                [ticker_symbol, company_name, sector, stock_price, market_cap]
            );

            res.status(201).json({ ticker_symbol, company_name, sector, stock_price, market_cap });
        } catch (error) {
            console.error("Error creating company:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // ✅ NEW: Update Company
    async updateCompany(req, res) {
        try {
            const { id } = req.params;
            const { ticker_symbol, company_name, sector, stock_price, market_cap } = req.body;

            await this.db.query(
                `UPDATE Companies 
                 SET ticker_symbol=?, company_name=?, sector=?, stock_price=?, market_cap=? 
                 WHERE company_id=?`,
                [ticker_symbol, company_name, sector, stock_price, market_cap, id]
            );

            res.json({ message: "✅ Company updated successfully" });
        } catch (error) {
            console.error("Error updating company:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // ✅ NEW: Delete Company
    async deleteCompany(req, res) {
        try {
            const { id } = req.params;
            await this.db.query(`DELETE FROM Companies WHERE company_id=?`, [id]);
            res.json({ message: "✅ Company deleted successfully" });
        } catch (error) {
            console.error("Error deleting company:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // ✅ ---------- USERS ----------
        // ✅ NEW: Login (register if not exists)
    async loginUser(req, res) {
        try {
            const { name, email } = req.body;

            if (!name || !email) {
                return res.status(400).json({ error: "Name and email are required" });
            }

            // ✅ 1. Check if user exists by email
            const [existingUser] = await this.db.query(
                `SELECT * FROM Users WHERE email = ?`, [email]
            );

            if (existingUser.length > 0) {
                // ✅ Old user – just return the user data
                return res.json({ 
                    message: "Welcome back!", 
                    user: existingUser[0] 
                });
            }

            // ✅ 2. If not exists, create new user
            const [result] = await this.db.query(
                `INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)`,
                [name, email, ""] // keeping password empty for now (since you skipped auth)
            );

            const [newUser] = await this.db.query(
                `SELECT * FROM Users WHERE user_id = ?`, [result.insertId]
            );

            return res.status(201).json({ 
                message: "New user created!", 
                user: newUser[0] 
            });

        } catch (error) {
            console.error("Error logging in/creating user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async getUsers(req, res) {
        try {
            const [rows] = await this.db.query('SELECT * FROM Users');
            res.json(rows);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

  async createUsers(req, res) {
    try {
        const { name, email, password_hash } = req.body;

        if (!name || !email || !password_hash) {
            return res.status(400).json({ error: "Name, email and password_hash are required" });
        }

        // Insert new user
        const [result] = await this.db.query(
            `INSERT INTO Users (name, email, password_hash)
             VALUES (?, ?, ?)`,
            [name, email, password_hash]
        );

        // Fetch the inserted user with user_id
        const [newUser] = await this.db.query(
            `SELECT * FROM Users WHERE user_id = ?`, [result.insertId]
        );

        // Return complete user data (including user_id)
        res.status(201).json(newUser[0]);

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal Server Error");
    }
}

    // ✅ NEW: Update User
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password_hash } = req.body;

            await this.db.query(
                `UPDATE Users SET name=?, email=?, password_hash=? WHERE user_id=?`,
                [name, email, password_hash, id]
            );

            res.json({ message: "✅ User updated successfully" });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // ✅ NEW: Delete User
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await this.db.query(`DELETE FROM Users WHERE user_id=?`, [id]);
            res.json({ message: "✅ User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // ✅ ---------- TRANSACTIONS ----------
    
    // ✅ getTransactions by user_id (updated for portfolio)
    async getTransactions(req, res) {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                return res.status(400).json({ error: "user_id is required in the URL" });
            }

            const [rows] = await this.db.query(
                'SELECT * FROM transactions WHERE user_id = ?',
                [user_id]
            );

            res.json(rows);
        } catch (error) {
            console.error("Error fetching transactions for user:", error);
            res.status(500).send("Internal Server Error");
        }
    }



    async createTransactions(req, res) {
        try {
            const { user_id, username, company_name, ticker_symbol, transaction_type, quantity, price_per_share } = req.body;

            if (!user_id || !username || !company_name || !ticker_symbol || !transaction_type || !quantity || !price_per_share) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const [result] = await this.db.query(
                `INSERT INTO transactions 
                 (user_id, username, company_name, ticker_symbol, transaction_type, quantity, price_per_share)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user_id, username, company_name, ticker_symbol, transaction_type, quantity, price_per_share]
            );

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

    // ✅ NEW: Update Transaction
    async updateTransaction(req, res) {
        try {
            const { id } = req.params;
            const { user_id, username, company_name, ticker_symbol, transaction_type, quantity, price_per_share } = req.body;

            await this.db.query(
                `UPDATE transactions 
                 SET user_id=?, username=?, company_name=?, ticker_symbol=?, transaction_type=?, quantity=?, price_per_share=? 
                 WHERE transaction_id=?`,
                [user_id, username, company_name, ticker_symbol, transaction_type, quantity, price_per_share, id]
            );

            res.json({ message: "✅ Transaction updated successfully" });
        } catch (error) {
            console.error("Error updating transaction:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // ✅ NEW: Delete Transaction
    async deleteTransaction(req, res) {
        try {
            const { id } = req.params;
            await this.db.query(`DELETE FROM transactions WHERE transaction_id=?`, [id]);
            res.json({ message: "✅ Transaction deleted successfully" });
        } catch (error) {
            console.error("Error deleting transaction:", error);
            res.status(500).send("Internal Server Error");
        }
    }
        // ✅ ---------- WATCHLIST ----------
    async getWatchlist(req, res) {
        try {
            const { user_id } = req.params;

            const [rows] = await this.db.query(
                'SELECT * FROM Watchlist WHERE user_id = ?',
                [user_id]
            );

            res.json(rows);
        } catch (error) {
            console.error("Error fetching watchlist:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async addToWatchlist(req, res) {
        try {
            const { user_id, ticker_symbol, company_name } = req.body;

            if (!user_id || !ticker_symbol || !company_name) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Prevent duplicate
            const [existing] = await this.db.query(
                `SELECT * FROM Watchlist WHERE user_id = ? AND ticker_symbol = ?`,
                [user_id, ticker_symbol]
            );

            if (existing.length > 0) {
                return res.status(409).json({ message: "Already in watchlist" });
            }

            await this.db.query(
                `INSERT INTO Watchlist (user_id, ticker_symbol, company_name)
                 VALUES (?, ?, ?)`,
                [user_id, ticker_symbol, company_name]
            );

            res.status(201).json({ message: "✅ Added to watchlist" });
        } catch (error) {
            console.error("Error adding to watchlist:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async removeFromWatchlist(req, res) {
        try {
            const { user_id, ticker_symbol } = req.body;

            if (!user_id || !ticker_symbol) {
                return res.status(400).json({ error: "user_id and ticker_symbol are required" });
            }

            await this.db.query(
                `DELETE FROM Watchlist WHERE user_id = ? AND ticker_symbol = ?`,
                [user_id, ticker_symbol]
            );

            res.json({ message: "✅ Removed from watchlist" });
        } catch (error) {
            console.error("Error removing from watchlist:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = { IndexController };
