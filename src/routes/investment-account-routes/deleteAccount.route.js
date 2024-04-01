'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: delete-account';
const msg = 'Delete Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const accountController = controller.accountController;

// API Function
const deleteAccount = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.accountToken;

        log.info('Call Account controller to Delete an Account');
        const isAccountDeleted = await accountController.deleteAccount(userId, accountToken);

        if (isAccountDeleted.isValid) {
            registerLog.createInfoLog('Account deleted successfully', null, isAccountDeleted);

            const mailPayload = accountController.sendAccountDeletionMailPayload(isAccountDeleted.data);

            log.info('Call email service for sending account deletion mail');
            const mailResponse = await sendMail(mailPayload);
            log.info('Email API execution completed');
            
            res.status(responseCodes[isAccountDeleted.resType]).json(
                buildApiResponse(isAccountDeleted)
            );
        } else {
            log.error('Error occurred while deleting the account');
            return next(isAccountDeleted);
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

export default deleteAccount;
