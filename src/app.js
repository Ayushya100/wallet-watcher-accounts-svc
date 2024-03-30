'use strict';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { registerUser, errorHandler, verifyToken } from 'lib-common-service';

import { USERS_API } from './constants.js';
import { upload, checkCardExist } from './middlewares/index.js';

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
    max: 100 // Limit each IP to 50 requests per windowMs
}));

app.use(express.static('public'));

app.use(cookieParser());

app.use(registerUser);

const tokenKey = process.env.ACCESS_TOKEN_KEY;

// Dashboard Setting Routes
app.post(`${USERS_API}/create-setting`, routes.settingRoutes.createSetting);
app.get(`${USERS_API}/get-setting-info`, routes.settingRoutes.getSettingInfo);
app.get(`${USERS_API}/get-setting-info/:id`, routes.settingRoutes.getSettingInfo);
app.put(`${USERS_API}/update-settings/:id`, routes.settingRoutes.updateSetting);
app.post(`${USERS_API}/assign-settings/:id`, routes.settingRoutes.assignSettingsToUser);
app.put(`${USERS_API}/deassign-settings/:id`, routes.settingRoutes.deassignSetting);

// User Account Routes
app.post(`${USERS_API}/create-user`, routes.userRoutes.createUser);
app.put(`${USERS_API}/:userId/verify-user`, routes.userRoutes.verifyUser);
app.post(`${USERS_API}/user-login`, routes.userRoutes.loginUser);
app.get(`${USERS_API}/get-user-info/:userId`, verifyToken(tokenKey), routes.userRoutes.getUserInfo);
app.post(`${USERS_API}/refresh-token`, routes.userRoutes.refreshAccessToken);
app.post(`${USERS_API}/logout-user`, verifyToken(tokenKey), routes.userRoutes.logoutUser);
app.put(`${USERS_API}/update-profile/:userId`, verifyToken(tokenKey), routes.userRoutes.updateUserDetails);
app.put(`${USERS_API}/update-user-password/:userId`, verifyToken(tokenKey), routes.userRoutes.updateUserPassword);
app.put(`${USERS_API}/deactivate-user/:userId`, verifyToken(tokenKey), routes.userRoutes.deactivateUser);
app.put(`${USERS_API}/update-profile-image/:userId`, verifyToken(tokenKey), upload.single('profileImage'), routes.userRoutes.updateProfileImage);
app.delete(`${USERS_API}/delete-profile-image/:userId`, verifyToken(tokenKey), routes.userRoutes.deleteProfileImage);
app.post(`${USERS_API}/request-reset`, routes.userRoutes.requestPasswordReset);
app.put(`${USERS_API}/reset-password/:userId`, routes.userRoutes.resetPassword);

// User Dashboard Setting Routes
app.get(`${USERS_API}/:userId/get-dashboard-settings`, verifyToken(tokenKey), routes.userDashboard.getUserDashboardSetting);
app.get(`${USERS_API}/:userId/get-dashboard-settings/:userSettingId`, verifyToken(tokenKey), routes.userDashboard.getUserDashboardSetting);
app.put(`${USERS_API}/:userId/update-dashboard-setting/:userSettingId`, verifyToken(tokenKey), routes.userDashboard.updateUserDashboardSetting);

// User Card Routes
app.post(`${USERS_API}/:userId/register-card`, verifyToken(tokenKey), routes.cardRoutes.registerCard);
app.get(`${USERS_API}/:userId/get-card-info`, verifyToken(tokenKey), routes.cardRoutes.getCardInfo);
app.get(`${USERS_API}/:userId/get-card-info/:cardToken`, verifyToken(tokenKey), routes.cardRoutes.getCardInfo);
app.put(`${USERS_API}/:userId/update-card-info/:cardToken`, verifyToken(tokenKey), checkCardExist, routes.cardRoutes.updateCardInfo);
app.put(`${USERS_API}/:userId/deactivate-card/:cardToken`, verifyToken(tokenKey), checkCardExist, routes.cardRoutes.deactivateCard);

// Error Handler middleware
app.use(errorHandler);

export default app;
