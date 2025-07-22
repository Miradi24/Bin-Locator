import express from 'express';
import morgan from 'morgan';
import config from './config/config';
import { markerRouter } from './routes/marker.route';
import mongoose from 'mongoose';
import mongoDbStore from 'connect-mongo';
import session from 'express-session';

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

    // Create a MongoDB store for session management
    const sessionStore = mongoDbStore.create({
        mongoUrl: config.databaseUrl,
        touchAfter: 24 * 3600,
        autoRemove: "native",
    });

    // Configure session options
    const sessionOptions: session.SessionOptions = {
        secret: config.cookieSecret,
        store: sessionStore,
        name: 's_id',
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            // Cookies will expire after 8 hours
            maxAge: 1000 * 3600 * 8,
            httpOnly: config.nodeEnv === 'production',
            secure: config.nodeEnv === 'production',
        }
    };

    // Server configuration

    // The server will only parse JSON requests.
    app.use(express.json());
    // The server will also parse URL-encoded requests.
    app.use(express.urlencoded({ extended: true }));
    // Log prettier output to the console.
    app.use(morgan('dev'));
    // Tell the server to use the session middleware.
    app.use(session(sessionOptions));

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