'use strict';

import createUser from './createUser.route.js';
import verifyUser from './verifyUser.route.js';
import loginUser from './loginUser.route.js';
import getUserInfo from './getUserInfo.route.js';
import refreshAccessToken from './refreshAccessToken.route.js';

export default {
    createUser,
    verifyUser,
    loginUser,
    getUserInfo,
    refreshAccessToken
};
