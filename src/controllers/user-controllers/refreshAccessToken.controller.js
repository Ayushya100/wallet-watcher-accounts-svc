'use strict';

import jwt from 'jsonwebtoken';
import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: refresh-token-controller';

const log = logger(header);
const registerLog = createNewLog(header);

// Check the validity of token
const isTokenAvailableAndActive = (refreshToken) => {
    registerLog.createDebugLog('Start checking the validity of token');

    try {
        log.info('Execution for checking the validity of token has started');
        if (!refreshToken) {
            log.error('Token not found');
            return next({
                resType: 'BAD_REQUEST',
                resMsg: 'TOKEN NOT FOUND',
                isValid: false
            });
        }

        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        
        log.info('Token verification completed');
        return {
            resType: 'SUCCESS',
            resMsg: 'TOKEN VERIFIED',
            data: decodedRefreshToken,
            isValid: true
        };
    } catch(err) {
        log.error('Unauthorized access token got expired or not found');
        return {
            resType: 'UNAUTHORIZED',
            resMsg: 'UNAUTHORIZED ACCESS - TOKEN EXPIRED / NOT FOUND',
            stack: err.stack,
            isValid: false
        };
    }
}

const refreshTokens = async(userId) => {
    registerLog.createDebugLog('Generate new tokens for user');
    
    try {
        log.info('Execution for generating new access and refresh token has been initiated');
        const refreshedTokens = await dbConnect.generateAccessAndRefreshTokens(userId);

        log.info('Execution for generating new tokens completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'TOKENS HAS BEEN REFRESHED SUCCESSFULLY',
            data: refreshedTokens,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to generate access and refresh tokens');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isTokenAvailableAndActive,
    refreshTokens
};
