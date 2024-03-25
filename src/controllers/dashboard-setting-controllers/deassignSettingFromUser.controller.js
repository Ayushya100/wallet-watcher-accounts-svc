'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: assign-setting';

const log = logger(header);
const registerLog = createNewLog(header);

const getUsersListToDeassignSettings = async(settingId, usersId) => {
    log.info('Execution for validating the users list to de-assign settings started');
    let usersToDeassign;
    
    if ((usersId.length > 0) && !(usersId[0] == '')) {
        log.info('Call db query to check for the provided users with setting assigment');
        usersToDeassign = await dbConnect.getUsersWithAssignedSetting(usersId, settingId);
    } else {
        log.info('Call db query to check for all users with setting assigment');
        usersToDeassign = await dbConnect.getAllUsersWithAssignedSetting(settingId);
    }

    log.info('Users list with the setting assignment returned');
    return usersToDeassign;
}

const deassignSettingFromUser = async(settingId, usersId) => {
    registerLog.createDebugLog('Assign setting to user');

    try {
        log.info('Execution for de-assigning setting from user controller started');

        log.info('Call function to check for existing users with assigned settings');
        let usersToDeassignSettings = await getUsersListToDeassignSettings(settingId, usersId);

        if (usersToDeassignSettings.length === 0) {
            log.info('No valid user found to deassign');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'No User Available to Deassign Setting',
                isValid: false
            };
        }

        usersToDeassignSettings = usersToDeassignSettings.map(({_id}) => String(_id));

        log.info('Call db query to remove the user assignment with setting');
        const updatedUserSettingInfo = await dbConnect.deassignUserSettings(usersToDeassignSettings);

        log.info('Execution completed successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Settings de-assigned from Users Successfully',
            data: updatedUserSettingInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while de-assigning setting from users');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    deassignSettingFromUser
};
