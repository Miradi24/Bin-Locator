import express from 'express';
import morgan from 'morgan';
import config from './config/config';
import { markerRouter } from './routes/marker.route';
import mongoose from 'mongoose';
import mongoDbStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import { User } from './models/user.model';
import { Strategy as LocalStrategy } from 'passport-local';
import { authRouter } from './routes/auth.route';

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

    // Auth configuration
    // Use the LocalStrategy for user authentication with email and password
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, User.authenticate()));
    // @ts-ignore - When a user is authenticated, serialise the user to the session
    passport.serializeUser(User.serializeUser());
    // When a user logs out, deserialise the user from the session
    passport.deserializeUser(User.deserializeUser());
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    // Register the marker router for handling marker related API requests
    app.use('/api/markers', markerRouter);
    app.use('/api/auth', authRouter);

    // Start the server
    app.listen(config.port, () => {
        console.log(`Server is running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
    });
}

startServer();