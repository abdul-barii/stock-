const { Router } = require('express');
const { IndexController } = require('../controllers');

const indexController = new IndexController();

function setRoutes(app) {
    console.log("✅ setRoutes() called - routes are loading");

    // ✅ LOGIN route (NEW)
    app.post('/api/login', indexController.loginUser.bind(indexController));

    // ✅ Companies routes
    const companiesRouter = Router();
    companiesRouter.get('/', indexController.getCompanies.bind(indexController));
    companiesRouter.post('/', indexController.createCompanies.bind(indexController));
    companiesRouter.put('/:id', indexController.updateCompany.bind(indexController));
    companiesRouter.delete('/:id', indexController.deleteCompany.bind(indexController));
    app.use('/api/companies', companiesRouter);

   const transactionsRouter = Router();

    // ✅ Route: Get all transactions for a user
    transactionsRouter.get('/:user_id', indexController.getTransactions.bind(indexController));

    // ✅ Route: Create a new transaction
    transactionsRouter.post('/', indexController.createTransactions.bind(indexController));

    // ✅ Route: Update a transaction by ID
    transactionsRouter.put('/:id', indexController.updateTransaction.bind(indexController));

    // ✅ Route: Delete a transaction by ID
    transactionsRouter.delete('/:id', indexController.deleteTransaction.bind(indexController));

    app.use('/api/transactions', transactionsRouter);


    // ✅ Users routes
    const usersRouter = Router();
    usersRouter.get('/', indexController.getUsers.bind(indexController));
    usersRouter.post('/', indexController.createUsers.bind(indexController));
    usersRouter.put('/:id', indexController.updateUser.bind(indexController));
    usersRouter.delete('/:id', indexController.deleteUser.bind(indexController));
    app.use('/api/users', usersRouter);

    // ✅ Watchlist routes (NEW)
    const watchlistRouter = Router();
    watchlistRouter.get('/:user_id', indexController.getWatchlist.bind(indexController));
    watchlistRouter.post('/', indexController.addToWatchlist.bind(indexController));
    watchlistRouter.delete('/', indexController.removeFromWatchlist.bind(indexController));
    app.use('/api/watchlist', watchlistRouter);
}

module.exports = { setRoutes };
