'use strict';

import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';

// Add DB Models
import { CardInfoModel, executeQuery } from 'lib-common-service';

const isCardByCardNumberAvailable = async(cardNumber) => {
    const cardInfo = CardInfoModel.findOne({
        cardNumber: cardNumber
    });
    return await executeQuery(cardInfo);
}

const createNewCard = async(userId, payload) => {
    const newCard = await CardInfoModel.create({
        userId: userId,
        token: payload.token,
        cardNumber: payload.cardNumber,
        cardType: payload.cardType,
        bankInfo: payload.bankInfo,
        expirationDate: payload.expirationDate,
        holderName: payload.holderName,
        cardColor: payload.cardColor,
        balance: payload.balance || 0
    });
    return newCard;
}

export {
    isCardByCardNumberAvailable,
    createNewCard
};
