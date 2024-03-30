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

export {
    isAccountByAccNumberAvailable,
    createAccount
};
