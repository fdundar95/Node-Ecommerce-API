require('dotenv').config();
const express = require('express');
const app = express();
require('express-async-errors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./db/connect');

app.set('trust proxy', 1);

app.use(cors());
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 60 }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload({ useTempFiles: true }));

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

const { authenticateUser } = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', authenticateUser, orderRouter);

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
