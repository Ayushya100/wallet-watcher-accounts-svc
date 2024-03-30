'use strict';

import { validateRegisterCardPayload, validateUpdateCardPayload } from './validatePayload.controller.js';
import {
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload
} from './registerCard.controller.js';
import { getAllCardsInfo, getCardInfoByToken } from './getCardInfo.controller.js';
import { updateCardInfo, sendCardUpdationgMailPayload } from './updateCardInfo.controller.js';

export default {
    validateRegisterCardPayload,
    validateUpdateCardPayload,
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload,
    getAllCardsInfo,
    getCardInfoByToken,
    updateCardInfo,
    sendCardUpdationgMailPayload
};
