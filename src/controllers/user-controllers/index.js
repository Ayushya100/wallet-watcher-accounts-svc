'use strict';

import { validateRegisterUserPayload } from './validatePayload.controller.js';
import {
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
} from './createUser.controller.js';

export default {
    validateRegisterUserPayload,
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
};
