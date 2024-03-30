'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: assign-setting';

const log = logger(header);
const registerLog = createNewLog(header);

const getUsersListToAssignSettings = async(usersId, settingId) => {
    log.info('Execution for validating the users list to assign settings');
    log.info('Call db query to check for the users who are already assigned');
    let usersAlreadyAssigned = await dbConnect.getUsersWithAssignedSetting(usersId, settingId);
    usersAlreadyAssigned = usersAlreadyAssigned.map(({userId}) => String(userId));

    if (usersAlreadyAssigned.length === 0) {
        log.info('All provided usersIds are valid to assign the setting');
        return usersId;
    }

    log.info('Filter usersId to assign setting');
    const usersWithoutAssignment = usersId.filter(userId => !usersAlreadyAssigned.includes(userId));
    return usersWithoutAssignment;
}

const validateUsersToAssign = async(usersId) => {
    log.info('Execution for validating users before assigning started');
    let usersToCheck;

    if ((usersId.length > 0) && !(usersId[0] == '')) {
        log.info('Call db query to check for provided users');
        usersToCheck = await dbConnect.getSelectedUsersId(usersId);
    } else {
        log.info('Call db query to get the list of all users in database');
        usersToCheck = await dbConnect.getAllUsersId();
    }

    usersToCheck = usersToCheck.map(({_id}) => String(_id));

    if (usersToCheck.length === 0) {
        log.info('No user found with given ids');
        return {
            data: usersToCheck,
            isValid: false
        };
    }

    log.info('Users are validated successfully');
    return {
        data: usersToCheck,
        isValid: true
    };
}

const assignSettingToUser = async(payload) => {
    registerLog.createDebugLog('Assign setting to user');

    try {
        log.info('Execution for assigning setting to user controller started');
        const usersId = payload.usersId;
        const settingId = payload.settingId;
        payload.value = ((payload.type === 'Boolean') && (payload.value.toLowerCase() === 'false')) ? false : true;

        log.info('Call function to validate users before assigning');
        let usersToCheck = await validateUsersToAssign(usersId);

        if (!usersToCheck.isValid) {
            log.error('No valid user id was found - execution completed');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'NO USER AVAILABLE TO ASSIGN',
                isValid: false
            };
        }

        usersToCheck = usersToCheck.data;
        log.info('Call function to get the list of valid users to assign');
        let usersToAssignSettings = await getUsersListToAssignSettings(usersToCheck, settingId);

        if (usersToAssignSettings.length === 0) {
            log.info('No valid user available to assign setting');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No User Available to Assign Setting',
                data: [],
                isValid: true
            };
        }

        usersToAssignSettings = usersToAssignSettings.map(userId => ({
            userId: userId,
            settingId: settingId,
            type: payload.type || 'Boolean',
            value: payload.value
        }));

        log.info('Call db query to create new user setting assignments');
        const createUserDashboard = await dbConnect.createUserDashboardSettings(usersToAssignSettings);
        
        if (createUserDashboard.length === 0) {
            log.error('Failed to assign setting to users');
            return {
                resType: 'UNPROCESSABLE_CONTENT',
                resMsg: 'Failed to assign setting to users',
                isValid: false
            };
        }

        log.info('Execution completed setting assigned successfully to all valid users');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Settings assigned to Users Successfully',
            data: createUserDashboard,
            isValid: true
        };
    } catch (err) {
        log.error('Error while assigning setting to users');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    assignSettingToUser
};
