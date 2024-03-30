'use strict';

import registerCard from './registerCard.route.js';
import getCardInfo from './getCardInfo.route.js';
import updateCardInfo from './updateCardInfo.route.js';
import deactivateCard from './deactivateCard.route.js';
import reactivateCard from './reactivateCard.route.js';
import deleteCard from './deleteCard.route.js';

export default {
    registerCard,
    getCardInfo,
    updateCardInfo,
    deactivateCard,
    reactivateCard,
    deleteCard
};
