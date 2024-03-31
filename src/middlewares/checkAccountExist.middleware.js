'use strict';

import dbConnect from '../db/index.js';

const checkAccountExist = async(req, res, next) => {
    try {
        const userId = req.params.userId;
        const accountToken = req.params.accountToken;

        const isAccountAvailable = await dbConnect.getAccountByToken(userId, accountToken);
        req.accountDetails = isAccountAvailable;

        if (!isAccountAvailable) {
            next({
                resType: 'NOT_FOUND',
                resMsg: 'No Account Found',
                isValid: false
            });
        }
        next();
    } catch (err) {
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        });
    }
}

export default checkAccountExist;
