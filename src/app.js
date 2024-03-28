'use strict';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { registerUser, errorHandler, verifyToken } from 'lib-common-service';

import { USERS_API } from './constants.js';
import { upload } from './middlewares/index.js';

// User Routes
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
app.put(`${USERS_API}/update-settings/:id`, registerUser, routes.settingRoutes.updateSetting);
app.post(`${USERS_API}/assign-settings/:id`, registerUser, routes.settingRoutes.assignSettingsToUser);
app.put(`${USERS_API}/deassign-settings/:id`, registerUser, routes.settingRoutes.deassignSetting);

// User Account Routes
app.post(`${USERS_API}/create-user`, registerUser, routes.userRoutes.createUser);
app.put(`${USERS_API}/:userId/verify-user`, registerUser, routes.userRoutes.verifyUser);
app.post(`${USERS_API}/user-login`, registerUser, routes.userRoutes.loginUser);
app.get(`${USERS_API}/get-user-info/:userId`, registerUser, verifyToken(tokenKey), routes.userRoutes.getUserInfo);
app.post(`${USERS_API}/refresh-token`, registerUser, routes.userRoutes.refreshAccessToken);
app.post(`${USERS_API}/logout-user`, registerUser, verifyToken(tokenKey), routes.userRoutes.logoutUser);
app.put(`${USERS_API}/update-profile/:userId`, registerUser, verifyToken(tokenKey), routes.userRoutes.updateUserDetails);
app.put(`${USERS_API}/update-user-password/:userId`, registerUser, verifyToken(tokenKey), routes.userRoutes.updateUserPassword);
app.put(`${USERS_API}/deactivate-user/:userId`, registerUser, verifyToken(tokenKey), routes.userRoutes.deactivateUser);
app.put(`${USERS_API}/update-profile-image/:userId`, registerUser, verifyToken(tokenKey), upload.single('profileImage'), routes.userRoutes.updateProfileImage);
app.delete(`${USERS_API}/delete-profile-image/:userId`, registerUser, verifyToken(tokenKey), routes.userRoutes.deleteProfileImage);
app.post(`${USERS_API}/request-reset`, registerUser, routes.userRoutes.requestPasswordReset);
app.put(`${USERS_API}/reset-password/:userId`, registerUser, routes.userRoutes.resetPassword);

// Error Handler middleware
app.use(errorHandler);

export default app;
