/*
const { Router } = require('express');
const { IndexController } = require('../controllers'); // Fixed import

const router = Router();
const indexController = new IndexController();  // Only create the instance once

function setRoutes(app) {
    app.use('/api/transactions', router); // Changed route path to '/api/transactions'
    router.get('/', indexController.getTransactions.bind(indexController));
    router.post('/', indexController.createTransactions.bind(indexController));

    app.use('/api/companies', router); // Changed route path to '/api/transactions'
    router.get('/', indexController.getCompanies.bind(indexController));
    router.post('/', indexController.createCompanies.bind(indexController));

    app.use('/api/users', router); // Changed route path to '/api/transactions'
    router.get('/', indexController.getUsers.bind(indexController));
    router.post('/', indexController.createUsers.bind(indexController));


}

module.exports = { setRoutes }; */


const { Router } = require('express');
const { IndexController } = require('../controllers');

const indexController = new IndexController();  // Create once

function setRoutes(app) {
    // Router for Companies
    const companiesRouter = Router();
    companiesRouter.get('/', indexController.getCompanies.bind(indexController));
    companiesRouter.post('/', indexController.createCompanies.bind(indexController));
    app.use('/api/companies', companiesRouter);

    // Router for Transactions
    const transactionsRouter = Router();
    transactionsRouter.get('/', indexController.getTransactions.bind(indexController));
    transactionsRouter.post('/', indexController.createTransactions.bind(indexController));
    app.use('/api/transactions', transactionsRouter);

    // Router for Users
    const usersRouter = Router();
    usersRouter.get('/', indexController.getUsers.bind(indexController));
    usersRouter.post('/', indexController.createUsers.bind(indexController));
    app.use('/api/users', usersRouter);
}

module.exports = { setRoutes };


