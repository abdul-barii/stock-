const {createConnection} = require ('mysql2/promise');

const connectToDatabase =async () =>{
    const connection = await createConnection({
        host :"localhost",
        user: 'root',
        password: 'kuro',
        database : 'stocks',
    });

    return connection;
};
module.exports = {connectToDatabase};