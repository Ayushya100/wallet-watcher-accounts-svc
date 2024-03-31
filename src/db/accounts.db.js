'use strict';

// Add DB Models
import { InvestmentAccInfoModel, executeQuery } from 'lib-common-service';

const isAccountByAccNumberAvailable = async(accountNumber) => {
    const accountInfo = InvestmentAccInfoModel.findOne({
        accountNumber: accountNumber
    });
    return await executeQuery(accountInfo);
}

const createAccount = async(userId, payload) => {
    const newAccount = await InvestmentAccInfoModel.create({
        userId: userId,
        token: payload.token,
        accountName: payload.accountName,
        accountNumber: payload.accountNumber,
        accountDate: payload.accountDate,
        holderName: payload.holderName,
        amount: payload.amount || 0
    });
    return newAccount;
}

const getAllAccountInfo = async(userId) => {
    const accountInfo = InvestmentAccInfoModel.find(
        {
            userId: userId,
            isDeleted: false
        }
    ).select(
        'token accountName accountNumber accountDate holderName isActive'
    );
    return await executeQuery(accountInfo);
}

const getAccountByToken = async(userId, accountToken) => {
    const accountInfo = InvestmentAccInfoModel.findOne(
        {
            token: accountToken,
            userId: userId,
            isDeleted: false
        }
    ).select(
        'accountName accountNumber accountDate holderName isActive balance'
    );
    return await executeQuery(accountInfo);
}

const updateExistingAccount = async(userId, accountToken, payload) => {
    const existingAccountInfo = await getAccountByToken(userId, accountToken);
    const updatedAccountInfo = InvestmentAccInfoModel.findOneAndUpdate(
        {
            token: accountToken,
            userId: userId,
            isDeleted: false
        },
        {
            $set: {
                accountDate: payload.accountDate || existingAccountInfo.accountDate,
                holderName: payload.holderName || existingAccountInfo.holderName,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        'accountName accountNumber accountDate holderName isActive'
    );
    return await executeQuery(updatedAccountInfo);
}

const deactivateAccount = async(userId, accountToken) => {
    const updatedAccountInfo = InvestmentAccInfoModel.findOneAndUpdate(
        {
            token: accountToken,
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
        'accountName accountNumber accountDate holderName isActive'
    );
    return await executeQuery(updatedAccountInfo);
}

const reactivateAccount = async(userId, accountToken) => {
    const updatedAccountInfo = InvestmentAccInfoModel.findOneAndUpdate(
        {
            token: accountToken,
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
        'accountName accountNumber accountDate holderName isActive'
    );
    return await executeQuery(updatedAccountInfo);
}

export {
    isAccountByAccNumberAvailable,
    createAccount,
    getAllAccountInfo,
    getAccountByToken,
    updateExistingAccount,
    deactivateAccount,
    reactivateAccount
};
