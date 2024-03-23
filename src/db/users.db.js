'use strict';

import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';

// Add DB Models
import { UserModel, UserFinanceModel } from 'lib-common-service';

const isUserByUserNameOrEmailAvailable = async(userName, emailId) => {
    const isUserExist = await UserModel.findOne({
        $or: [{ userName }, { emailId }]
    });

    return isUserExist;
}

const generateVerificationCode = async(userId) => {
    const user = await UserModel.findById({ _id: userId });
    const verificationCode = uuidv4() + user._id;
    const updatedUserInfo = await UserModel.findByIdAndUpdate(
        { _id: user._id },
        {
            $set: {
                verificationCode: verificationCode,
                verificationCodeExpiry: Date.now() + (6 * 60 * 60 * 1000),
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        '-password -loginCount -isDeleted -createdBy -modifiedBy'
    );
    return updatedUserInfo;
}

const createNewUser = async(payload) => {
    const newUser = await UserModel.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        userName: payload.userName,
        emailId: payload.emailId,
        password: payload.password
    });

    await UserFinanceModel.create({ userId: newUser._id });

    const updatedUser = await generateVerificationCode(newUser._id);
    return updatedUser;
}

export {
    isUserByUserNameOrEmailAvailable,
    createNewUser
};
