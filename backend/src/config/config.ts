import dotenv from 'dotenv';

// Load environment variables from a .env file into current process
dotenv.config();

interface IConfig {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    cookieSecret: string;
}

const config: IConfig = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.6',
    cookieSecret: process.env.COOKIE_SECRET || 'cookie secret'
};

export default config;
