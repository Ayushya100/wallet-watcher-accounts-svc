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

const getAllCardInfo = async(userId) => {
    const cardInfo = CardInfoModel.find(
        {
            userId: userId,
            isDeleted: false
        }
    ).select(
        'token cardNumber cardType bankInfo expirationDate holderName cardColor isActive'
    );
    return await executeQuery(cardInfo);
}

const getCardInfoByToken = async(userId, cardToken) => {
    const cardInfo = CardInfoModel.findOne(
        {
            token: cardToken,
            userId: userId,
            isDeleted: false
        }
    ).select(
        'cardNumber cardType bankInfo expirationDate holderName cardColor isActive balance isDeleted'
    );
    return await executeQuery(cardInfo);
}

const updateExistingCard = async(userId, cardToken, payload) => {
    const existingCardInfo = await getCardInfoByToken(userId, cardToken);
    const updatedCardInfo = CardInfoModel.findOneAndUpdate(
        {
            token: cardToken,
            userId: userId,
            isDeleted: false
        },
        {
            $set: {
                holderName: payload.holderName || existingCardInfo.holderName,
                cardColor: payload.cardColor || existingCardInfo.cardColor,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        'cardNumber cardType bankInfo expirationDate holderName cardColor isActive'
    );
    return await executeQuery(updatedCardInfo);
}

const deactivateCard = async(userId, cardToken) => {
    const updatedCardInfo = CardInfoModel.findOneAndUpdate(
        {
            token: cardToken,
            userId: userId
        },
        {
            $set: {
                isActive: false,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        'cardNumber cardType bankInfo expirationDate holderName cardColor isActive'
    );
    return await executeQuery(updatedCardInfo);
}

const reactivateCard = async(userId, cardToken) => {
    const updatedCardInfo = CardInfoModel.findOneAndUpdate(
        {
            token: cardToken,
            userId: userId
        },
        {
            $set: {
                isActive: true,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        'cardNumber cardType bankInfo expirationDate holderName cardColor isActive'
    );
    return await executeQuery(updatedCardInfo);
}

export {
    isCardByCardNumberAvailable,
    createNewCard,
    getAllCardInfo,
    getCardInfoByToken,
    updateExistingCard,
    deactivateCard,
    reactivateCard
};
