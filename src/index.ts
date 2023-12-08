import express from 'express';
import {createServer} from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import router from "./router";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = createServer(app);


server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});

const MONGO_URL = 'mongodb+srv://lindalegos:lZisHBgwk7e17CeV@cluster0.wn9bbxf.mongodb.net/?retryWrites=true&w=majority';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL,)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

app.use('/', router());