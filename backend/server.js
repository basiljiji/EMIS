import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './utils/errorMiddleware.js';
import teacherRoute from './routes/teacherRoutes.js';
import adminAuthRoute from './routes/adminAuthRoutes.js';
import classDetailshRoute from './routes/classDetailsRoutes.js';

dotenv.config();

connectDB();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API IS RUNNING..!');
});

app.use('/teacher', teacherRoute);
app.use('/admin', adminAuthRoute);
app.use('/admin/class', classDetailshRoute);


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));