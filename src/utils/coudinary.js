'use strict';

import { logger, createNewLog } from 'lib-common-service';

const header = 'util: operation-cloudinary';

const log = logger(header);
const registerLog = createNewLog(header);

import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath) => {
    registerLog.createDebugLog('Start operation to upload image on cloudinary');

    try {
        log.info('Execution for uploading the image on cloudinary started');
        if (!localFilePath) {
            log.error('File not found to upload on cloudinary');
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'FILE NOT FOUND',
                isValid: false
            };
        }

        log.info('Uploading file on cloudinary started');
        const fileCloudinaryURL = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image'
        });
        log.info('File uploading on cloudinary completed');
        fs.unlinkSync(localFilePath);

        log.info('Execution for uploading file on cloudinary completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'FILE UPLOADED SUCCESSFULLY',
            data: fileCloudinaryURL,
            isValid: true
        };
    } catch (err) {
        log.error('Error while uploading file on cloudinary');
        fs.unlinkSync(localFilePath); // delete the local file
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'SOME ERROR OCCURRED WHILE SAVING IMAGE ON CLOUDINARY',
            isValid: false
        };
    }
}

const getPublicIdFromURL = (URL) => {
    log.info(`Extract public id from URL : ${URL}`);
    const URLParts = URL.split('/');
    const publicIdWithExtension = URLParts.pop();
    const publicId = publicIdWithExtension.split('.')[0]; // Remove the file extension
    return publicId;
}

const destroyOnCloudinary = async(cloudinaryFilePath) => {
    registerLog.createDebugLog('Start operation to delete image from cloudinary');

    try {
        log.info('Execution for removing the image from cloudinary started');

        if (cloudinaryFilePath) {
            const publicId = getPublicIdFromURL(cloudinaryFilePath);

            log.info('Calling Cloudinary API - Destroy Image');
            await cloudinary.uploader.destroy(publicId);
            log.info('Image deleted successfully from cloudinary');
            
            return {
                resType: 'SUCCESS',
                resMsg: 'CLOUDINARY IMAGE DESTROYED',
                isValid: true
            };
        }

        log.error('Error in getting Public ID from Cloudinary Image URL');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'CLOUDINARY URL NOT FOUND',
            isValid: false
        };
    } catch (err) {
        log.error('Error while removing file from cloudinary');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'SOME ERROR OCCURRED WHILE REMOVING IMAGE ON CLOUDINARY',
            isValid: false
        };
    }
}

export {
    uploadOnCloudinary,
    destroyOnCloudinary
};
