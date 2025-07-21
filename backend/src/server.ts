import express from 'express';
import morgan from 'morgan';
import config from './config/config';
import { markerRouter } from './routes/marker.route';
import mongoose from 'mongoose';

async function startServer() {
    try {
        await mongoose.connect(config.databaseUrl);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        // Stop the whole application if the database connection fails
        process.exit(1);
    }

    const app = express();

    // Server configuration

    // The server will only parse JSON requests.
    app.use(express.json());
    // The server will also parse URL-encoded requests.
    app.use(express.urlencoded({ extended: true }));
    // Log prettier output to the console.
    app.use(morgan('dev'));

    // Routes
    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    // Register the marker router for handling marker related API requests
    app.use('/api/markers', markerRouter);

    // Start the server
    app.listen(config.port, () => {
        console.log(`Server is running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
    });
}

startServer();