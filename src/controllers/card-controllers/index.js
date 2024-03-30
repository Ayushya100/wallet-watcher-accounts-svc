'use strict';

import { validateRegisterCardPayload, validateUpdateCardPayload } from './validatePayload.controller.js';
import {
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload
} from './registerCard.controller.js';
import { getAllCardsInfo, getCardInfoByToken } from './getCardInfo.controller.js';
import { updateCardInfo, sendCardUpdationgMailPayload } from './updateCardInfo.controller.js';
import { deactivateCard, sendCardDeactivationMailPayload } from './deactivateCard.controller.js';
import {
    isCardValidToReactivate,
    reactivateCard,
    sendCardReactivationMailPayload
} from './reactivateCard.controller.js';

export default {
    validateRegisterCardPayload,
    validateUpdateCardPayload,
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload,
    getAllCardsInfo,
    getCardInfoByToken,
    updateCardInfo,
    sendCardUpdationgMailPayload,
    deactivateCard,
    sendCardDeactivationMailPayload,
    isCardValidToReactivate,
    reactivateCard,
    sendCardReactivationMailPayload
};
