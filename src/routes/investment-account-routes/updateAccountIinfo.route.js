'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: update-account';
const msg = 'Update Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const accountController = controller.accountController;

// API Function
const updateAccountInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['accountDate', 'holderName']);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.accountToken;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = accountController.validateUpdateAccountPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to update account information');
            const isAccountDetailsUpdated = await accountController.updateAccountInfo(userId, accountToken, payload);
    
            if (isAccountDetailsUpdated.isValid) {
                registerLog.createInfoLog('Account updated successfully', null, isAccountDetailsUpdated);

                const mailPayload = accountController.sendAccountUpdationMailPayload(isAccountDetailsUpdated.data);

                log.info('Call email service for sending account updation mail');
                const mailResponse = await sendMail(mailPayload);
                log.info('Email API execution completed');
                
                res.status(responseCodes[isAccountDetailsUpdated.resType]).json(
                    buildApiResponse(isAccountDetailsUpdated)
                );
            } else {
                log.error('Error while updating account details');
                return next(isAccountDetailsUpdated);
            }
        } else {
            log.error('Error while validating the payload');
            return next(isValidPayload);
        }
    } catch (err) {
        log.error('Internal Error occurred while working with router functions');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

export default updateAccountInfo;
