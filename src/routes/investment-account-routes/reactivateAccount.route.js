'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: reactivate-account';
const msg = 'Reactivate Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const accountController = controller.accountController;

// API Function
const reactivateAccount = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.accountToken;
        const accountDetails = req.accountDetails;

        if (!accountDetails.isActive) {
            log.info('Call controller function to set the account as active');
            const isAccountReactivated = await accountController.reactivateAccount(userId, accountToken);
    
            if (isAccountReactivated.isValid) {
                registerLog.createInfoLog('Account reactivated successfully', null, isAccountReactivated);
                
                const mailPayload = accountController.sendAccountReactivationMailPayload(isAccountReactivated.data);

                log.info('Call email service for sending account reactivation mail');
                const mailResponse = await sendMail(mailPayload);
                log.info('Email API execution completed');

                res.status(responseCodes[isAccountReactivated.resType]).json(
                    buildApiResponse(isAccountReactivated)
                );
            } else {
                log.error('Error occurred while setting account as active');
                return next(isAccountReactivated);
            }
        } else {
            log.error('Account already active');
            return next({
                resType: 'BAD_REQUEST',
                resMsg: 'Already Active Account',
                isValid: false
            });
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

export default reactivateAccount;
