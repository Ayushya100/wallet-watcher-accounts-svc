'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: get-user-setting-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const updateUserDashboardSetting = async(userId, userSettingId, payload) => {
    registerLog.createDebugLog('Update user setting info');

    try {
        log.info('Execution for updating setting info for provided setting id controller started');
        if ((payload.type === 'Boolean') && (typeof payload.value != 'boolean')) {
            log.error('Value provided is not boolean');
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'Value parameter is not boolean',
                isValid: false
            };
        }
        
        log.info('Call db query to update the detail of setting by provided setting id record');
        const updatedDashboardSettings = await dbConnect.updateUserDashboardSetting(userId, userSettingId, payload);

        if (updatedDashboardSettings) {
            return {
                resType: 'SUCCESS',
                resMsg: 'Dashboard settings updated',
                data: updatedDashboardSettings,
                isValid: true
            };
        }
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Dashboard Setting Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to update setting record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateUserDashboardSetting
};
