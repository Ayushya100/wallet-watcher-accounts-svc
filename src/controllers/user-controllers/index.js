'use strict';

import { validateRegisterUserPayload } from './validatePayload.controller.js';
import { checkUserByUserNameOrEmail, createNewUser } from './createUser.controller.js';

export default {
    validateRegisterUserPayload,
    checkUserByUserNameOrEmail,
    createNewUser
};
