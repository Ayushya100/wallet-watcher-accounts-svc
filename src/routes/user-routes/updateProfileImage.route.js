'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: update-user-image';
const msg = 'Update User image Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const updateProfileImage = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const profileImagePath = req.file?.path;

        log.info('Call payload validator');
        const isValidPayload = userManagementController.validateProfileImagePayload(profileImagePath);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user exists');
            const isUserAvailable = await userManagementController.checkUserById(userId);

            if (isUserAvailable.isValid) {
                log.info('Call controller function to update profile image');
                const isImageUploaded = await userManagementController.updateProfileImage(isUserAvailable, userId, profileImagePath);

                if (isImageUploaded.isValid) {
                    registerLog.createInfoLog('User image updated successfully', null, isImageUploaded);
                    res.status(responseCodes[isImageUploaded.resType]).json(
                        buildApiResponse(isImageUploaded)
                    );
                } else {
                    log.error('Error while uploading the file');
                    return next(isImageUploaded);
                }
            } else {
                log.error('Error while checking for existing record');
                return next(isUserAvailable);
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

export default updateProfileImage;
