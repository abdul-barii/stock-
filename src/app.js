const express = require('express');
const {connectToDatabase} = require('./config/database');
//const cors = require('cors');
const {setRoutes} = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
/*connectToDatabase()
    .then(() => {
        console.log("Database connected successfully");
        setRoutes(app);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Database connection failed:", err);

    });*/