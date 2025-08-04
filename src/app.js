const express = require('express');
const path = require('path');   // ✅ for serving static files
const { connectToDatabase } = require('./config/database');
const { setRoutes } = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Serve all static files from "public" folder
app.use(express.static(path.join(__dirname, '../public')));

// ✅ TEST ROUTE to confirm server is running
app.get('/test', (req, res) => {
    res.json({ message: '✅ Server is running fine!' });
});

setRoutes(app);

// ✅ DEFAULT route → open login.html first
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
