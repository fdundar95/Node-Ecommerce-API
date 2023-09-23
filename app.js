require('dotenv').config();
const express = require('express');
const app = express();
require('express-async-errors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./db/connect');
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routers
const authRouter = require('./routes/authRoutes');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.get('/', (req, res) => {
    res.send('E-commerce API');
});
app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
    res.send('E-commerce API');
});
app.use('/api/v1/auth', authRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
