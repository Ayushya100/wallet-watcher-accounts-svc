'use strict';

import { validateRegisterCardPayload } from './validatePayload.controller.js';
import {
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload
} from './registerCard.controller.js';

export default {
    validateRegisterCardPayload,
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload
};
