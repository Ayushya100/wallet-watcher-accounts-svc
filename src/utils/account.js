'use strict';

import { logger } from 'lib-common-service';

const header = 'util: formatting-account-details';

const log = logger(header);

import crypto from 'crypto';

const maskAccountNumber = (accountNumber) => {
    log.info(`Account masking requested for ${accountNumber}`);
    const visibleValue = accountNumber.slice(-4);
    let maskedDigits = '';

    if (accountNumber.length > 4) {
        maskedDigits = 'x'.repeat(accountNumber.length - 4);
    }
    maskedDigits += visibleValue;

    log.info('Account masking completed');
    return maskedDigits;
}

const generateAccountToken = (accountNumber, byteSize = 32) => {
    log.info('Token generation started');
    const method = process.env.ACCOUNT_TOKEN_METHOD;
    const hashedData = crypto.createHash(method).update(accountNumber).digest('hex');
    const randomBytes = crypto.randomBytes(byteSize).toString('hex');
    const token = hashedData + randomBytes;

    log.info('Token generation completed');
    return token;
}

const encryptAccountData = (data) => {
    log.info('Data encryption started');
    const method = process.env.ACCOUNT_ENCRYPTION_METHOD;
    const encryptionKey = process.env.ACCOUNT_ENCRYPTION_KEY;
    const iv = process.env.ACCOUNT_ENCRYPTION_INITIALIZATION;

    const cipher = crypto.createCipheriv(method, Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    encryptedData = iv + ':' + encryptedData;

    log.info('Data encryption completed');
    return encryptedData;
}

const decryptAccountData = (encryptedData) => {
    log.info('Data decryption started');
    const method = process.env.ACCOUNT_ENCRYPTION_METHOD;
    const encryptionKey = process.env.ACCOUNT_ENCRYPTION_KEY;

    const [iv, encryptedText] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv(method, Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    log.info('Data decryption completed');
    return decryptedData;
}

export {
    maskAccountNumber,
    generateAccountToken,
    encryptAccountData,
    decryptAccountData
};
