import express from 'express';
import morgan from 'morgan';
import config from './config/config';
import { markerRouter } from './routes/marker.route';

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

app.use('/api/markers', markerRouter);

// Start the server
app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
});