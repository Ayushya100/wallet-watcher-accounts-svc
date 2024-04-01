'use strict';

import { logger } from 'lib-common-service';
import axios from 'axios';

const header = 'util: request-external-svc';

const log = logger(header);

let externalSvcConfig = {};

const initializeSvc = (svc, port) => {
    log.info('External service config started');
    const host = process.env.NODE_ENV == 'dev' ? `http://localhost:${port}/${svc}` : '';
    externalSvcConfig.host = host;
    externalSvcConfig.version = 'v1.0';
    log.info('External service config completed');
}

const sendRequest = async(svcUrl, method, payload, accessToken = null, jsonData = null) => {
    log.info('Execution of external service request started');

    try {
        let baseUrl = `${externalSvcConfig.host}/api/${externalSvcConfig.version}/${svcUrl}`;
        let options = {
            method: method,
            url: baseUrl,
            baseUrl: baseUrl,
            data: payload,
            timeout: 20000,
            headers: { accept: 'application/json, text/plain, */*', 'content-type': 'application/json' },
            responseType: 'json'
        };

        if (accessToken) {
            options.headers = { ...options.headers, Authorization: 'Bearer ' + accessToken };
        }
        
        let response;
        await axios(options).then(res => {
            response = {
                statusCode: res.data.statusCode,
                message: res.data.message,
                isValid: res.data.success
            };
        }).catch(err => {
            response = err;
        });
        log.info('Execution of external service request is successfully finished');
        return response;
    } catch (err) {
        log.error('Internal Error occurred while calling the external service');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

const sendMail = async(payload) => {
    initializeSvc('email-svc', '4000');
    const url = 'emails/send-mail';
    return await sendRequest(url, 'POST', payload); 
}

export {
    sendMail
};
