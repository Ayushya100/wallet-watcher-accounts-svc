'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: delete-user-image';
const msg = 'Delete User image Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const deleteProfileImage = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;

        log.info('Call controller function to check if user exists');
        const isUserAvailable = await userManagementController.checkUserById(userId);

        if (isUserAvailable.isValid) {
            log.info('Call controller function to delete profile image of the user');
            const isImageDeleted = await userManagementController.deleteProfileImage(isUserAvailable, userId);

            if (isImageDeleted.isValid) {
                registerLog.createInfoLog('User image deleted successfully', null, isImageDeleted);
                res.status(responseCodes[isImageDeleted.resType]).json(
                    buildApiResponse(isImageDeleted)
                );
            } else {
                log.error('Error while deleting the file');
                return next(isImageDeleted);
            }
        } else {
            log.error('Error while checking for existing record');
            return next(isUserAvailable);
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

export default deleteProfileImage;
