'use strict';

import dbConnect from '../db/index.js';

const checkCardExist = async(req, res, next) => {
    try {
        const userId = req.params.userId;
        const cardToken = req.params.cardToken;

        const isCardAvailable = await dbConnect.getCardInfoByToken(userId, cardToken);
        req.cardDetails = isCardAvailable;

        if (!isCardAvailable) {
            next({
                resType: 'NOT_FOUND',
                resMsg: 'No Card Found',
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

export default checkCardExist;
