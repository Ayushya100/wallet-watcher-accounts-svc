'use strict';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { registerUser, errorHandler } from 'lib-common-service';

// User Routes
import { USERS_API } from './constants.js';
import routes from '../src/routes/index.js';

const app = express();

// Setting up Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN, // reflecting the request origin
    credentials: true
}));

app.use(express.json({
    limit: '64kb' // Maximum request body size.
}));

app.use(express.urlencoded({
    limit: '32kb',
    extended: false
}));

app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes max
    max: 50 // Limit each IP to 50 requests per windowMs
}));

app.use(express.static('public'));

app.use(cookieParser());

const tokenKey = process.env.ACCESS_TOKEN_KEY;

// Dashboard Setting Routes
app.post(`${USERS_API}/create-setting`, registerUser, routes.settingRoutes.createSetting);
app.get(`${USERS_API}/get-setting-info`, registerUser, routes.settingRoutes.getSettingInfo);
app.get(`${USERS_API}/get-setting-info/:id`, registerUser, routes.settingRoutes.getSettingInfo);

// User Account Routes
app.post(`${USERS_API}/create-user`, registerUser, routes.userRoutes.createUser);
app.put(`${USERS_API}/:userId/verify-user`, registerUser, routes.userRoutes.verifyUser);
app.post(`${USERS_API}/user-login`, registerUser, routes.userRoutes.loginUser);

// Error Handler middleware
app.use(errorHandler);

export default app;
