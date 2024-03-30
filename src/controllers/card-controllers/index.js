'use strict';

import { validateRegisterCardPayload } from './validatePayload.controller.js';
import {
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload
} from './registerCard.controller.js';
import { getAllCardsInfo, getCardInfoByToken } from './getCardInfo.controller.js';

export default {
    validateRegisterCardPayload,
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload,
    getAllCardsInfo,
    getCardInfoByToken
};
