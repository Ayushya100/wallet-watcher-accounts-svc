'use strict';

const USERS_API = '/api/v1.0/users';
const FRONTEND_URL = 'http://192.168.0.104:4200';
const EMAIL_SVC_URL = 'http://localhost:4000';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true
};

export {
    USERS_API,
    FRONTEND_URL,
    COOKIE_OPTIONS,
    EMAIL_SVC_URL
};
