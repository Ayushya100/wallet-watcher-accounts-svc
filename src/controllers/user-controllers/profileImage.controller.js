'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { uploadOnCloudinary, destroyOnCloudinary } from '../../utils/index.js';

const header = 'controller: update-user-image';

const log = logger(header);
const registerLog = createNewLog(header);

const deleteImageFromCloudinary = async(userImageURL) => {
    log.info('Call Cloudinary function to remove image from cloudinary');
    const isImageDeleted = await destroyOnCloudinary(userImageURL);
    return isImageDeleted.isValid;
}

const updateProfileImage = async(user, userId, imagePath) => {
    registerLog.createDebugLog('Start operation to upload user image on cloudinary');

    try {
        log.info('Execution for uploading an image over cloudinary started');
        const userCurrentImageURL = user.data.profileImageURL;

        log.info('Call cloudinary function to upload an image');
        let cloudinaryImageURL = await uploadOnCloudinary(imagePath);
        cloudinaryImageURL = cloudinaryImageURL.data.url;

        log.info('Call db query to set the new profile image url in database');
        const updatedUserInfo = await dbConnect.updateProfileImage(userId, cloudinaryImageURL);
        
        if (userCurrentImageURL) {
            await deleteImageFromCloudinary(userCurrentImageURL);
            log.info('Function to remove image from cloudinary completed');
        }

        log.info('Execution for uploading an image over cloudinary completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'USER IMAGE UPDATED SUCCESSFULLY',
            data: updatedUserInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db or cloudinary to upload user image.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

const deleteProfileImage = async(user, userId) => {
    registerLog.createDebugLog('Start operation to delete user image on cloudinary');

    try {
        log.info('Execution for deleting an image over cloudinary started');
        const userCurrentImageURL = user.data.profileImageURL;

        if ((userCurrentImageURL) && (await deleteImageFromCloudinary(userCurrentImageURL))) {
            log.info('Call db query to remove profile image url from database');
            const updatedUserInfo = await dbConnect.deleteProfileImage(userId);

            log.info('Execution for deleting an image from cloudinary completed');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'USER IMAGE DELETED SUCCESSFULLY',
                data: updatedUserInfo,
                isValid: true
            };
        }

        log.error('Failed to delete an image from the cloudinary server');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'Unable to delete image or image does not exists',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db or cloudinary to delete user image.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateProfileImage,
    deleteProfileImage
};
