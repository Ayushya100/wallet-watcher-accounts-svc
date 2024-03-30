'use strict';

import { logger } from 'lib-common-service';

const header = 'util: formatting-card-details';

const log = logger(header);

import crypto from 'crypto';

const maskCardNumber = (cardNumber) => {
    log.info(`Card masking requested for ${cardNumber}`);
    const visibleDigits = cardNumber.slice(-4);
    let maskedDigits = '*'.repeat(cardNumber.length - 4);
    maskedDigits += visibleDigits;

    log.info('Card masking completed');
    return maskedDigits;
}

const generateToken = (cardNumber, byteSize = 16) => {
    log.info('Token generation started');
    const method = process.env.CARD_TOKEN_METHOD;
    const hashedData = crypto.createHash(method).update(cardNumber).digest('hex');
    const randomBytes = crypto.randomBytes(byteSize).toString('hex');
    const token = hashedData + randomBytes;

    log.info('Token generation completed');
    return token;
}

const encryptData = (data) => {
    log.info('Data encryption started');
    const method = process.env.CARD_ENCRYPTION_METHOD;
    const encryptionKey = process.env.CARD_ENCRYPTION_KEY;
    const iv = process.env.CARD_ENCRYPTION_INITIALIZATION;

    const cipher = crypto.createCipheriv(method, Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    encryptedData = iv + ':' + encryptedData;

    log.info('Data encryption completed');
    return encryptedData;
}

const decryptData = (encryptedData) => {
    log.info('Data decryption started');
    const method = process.env.CARD_ENCRYPTION_METHOD;
    const encryptionKey = process.env.CARD_ENCRYPTION_KEY;

    const [iv, encryptedText] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv(method, Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    log.info('Data decryption completed');
    return decryptedData;
}

const getConvertedDate = (encryptedDate) => {
    const date = new Date(encryptedDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return {day, month, year};
}

const convertDateToString = (encryptedDate) => {
    const date = getConvertedDate(encryptedDate);
    const finalDate = `${date.year}-${date.month}`;

    return finalDate;
}

const convertFullDateToString = (encryptedDate) => {
    const date = getConvertedDate(encryptedDate);
    const finalDate = `${date.year}-${date.month}-${date.day}`;

    return finalDate;
}

export {
    maskCardNumber,
    generateToken,
    encryptData,
    decryptData,
    convertDateToString,
    convertFullDateToString
};
