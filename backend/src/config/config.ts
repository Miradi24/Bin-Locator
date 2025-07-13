import dotenv from 'dotenv';

// Load environment variables from a .env file into current process
dotenv.config();

interface IConfig {
    port: number;
    nodeEnv: string;
}

const config: IConfig = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
