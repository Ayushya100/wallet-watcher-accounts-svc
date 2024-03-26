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

const isUserByIdAvailable = async(userId) => {
    const isUserExist = await UserModel.findById({
        _id: userId
    }).select(
        '-password -isDeleted -createdBy -modifiedBy'
    );
    return isUserExist;
}

const getSelectedUsersId = async(userIds) => {
    const selectedUsersId = await UserModel.find({
        _id: {
            $in: userIds
        },
        isDeleted: false
    }).select('_id');

    return selectedUsersId;
}

const getAllUsersId = async() => {
    const allUsersId = await UserModel.find({
        isDeleted: false
    }).select('_id');
    return allUsersId;
}

const getCompleteUserInfoById = async(userId) => {
    const userInfo = await UserModel.findById({
        _id: userId
    });
    return userInfo;
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

const validateUser = async(userId) => {
    const updatedUserInfo = await UserModel.findByIdAndUpdate(
        { _id: userId },
        {
            $set: {
                verificationCode: '',
                isVerified: true,
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

const verifyPassword = async(user, password) => {
    const isPasswordValid = await user.isPasswordCorrect(password);
    return isPasswordValid;
}

const reactivateUser = async(userId) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
        { _id: userId },
        {
            $set: {
                isDeleted: false,
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

    return updatedUser;
}

const generateAccessAndRefreshTokens = async(userId) => {
    const user = await UserModel.findById({ _id: userId });

    const accessToken = jwt.sign(
        {
            _id: user._id,
            userName: user.userName,
            isVerified: user.isVerified,
            isDeleted: user.isDeleted
        },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    const refreshToken = jwt.sign(
        {
            _id: user._id
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );

    const updatedUserInfo = await UserModel.findByIdAndUpdate(
        { _id: user._id },
        {
            $set: {
                refreshToken: refreshToken,
                loginCount: user.loginCount + 1,
                lastLogin: Date.now(),
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        '-password -createdOn -createdBy -modifiedOn -modifiedBy'
    );

    return {
        accessToken,
        refreshToken,
        userId: updatedUserInfo._id,
        userName: updatedUserInfo.userName
    };
}

const logoutUser = async(userId) => {
    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $set: {
                refreshToken: null,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    );
    return true;
}

const updateUserInfo = async(userId, payload) => {
    const currentUserInfo = await isUserByIdAvailable(userId);

    const updatedUserInfo = await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $set: {
                firstName: payload.firstName || currentUserInfo.firstName,
                lastName: payload.lastName || currentUserInfo.lastName,
                userName: payload.userName || currentUserInfo.userName,
                bio: payload.bio || currentUserInfo.bio,
                gender: payload.gender || currentUserInfo.gender,
                dob: payload.dob || currentUserInfo.dob,
                contactNumber: payload.contactNumber || currentUserInfo.contactNumber,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        '-password -refreshToken -isDeleted -createdBy -modifiedBy'
    );
    return updatedUserInfo;
}

const isPasswordValid = async(user, password) => {
    if (!(await user.isPasswordCorrect(password))) {
        return false;
    }
    return true;
}

const updateUserPassword = async(userId, payload) => {
    const currentUserInfo = await UserModel.findOne({
        _id: userId
    });

    if (await isPasswordValid(currentUserInfo, payload.oldPassword)) {
        currentUserInfo.password = payload.newPassword;
        currentUserInfo.modifiedOn = Date.now();
        currentUserInfo.modifiedBy = userId;
        await currentUserInfo.save({
            validateBeforeSave: false
        });
    
        const updatedUserInfo = await isUserByIdAvailable(userId);
        return updatedUserInfo;
    }
    return false;
}

const userDeactivate = async(userId) => {
    const updatedUserInfo = await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $set: {
                isDeleted: true,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        '-password -createdBy -modifiedBy'
    );
    return updatedUserInfo;
}

const updateProfileImage = async(userId, cloudinaryImageURL) => {
    const updatedUserInfo = await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $set: {
                profileImageURL: cloudinaryImageURL,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        '-password -isVerified -isDeleted -verificationCode -refreshToken -createdBy -modifiedBy'
    );
    return updatedUserInfo;
}


export {
    isUserByUserNameOrEmailAvailable,
    createNewUser,
    isUserByIdAvailable,
    validateUser,
    verifyPassword,
    generateVerificationCode,
    reactivateUser,
    generateAccessAndRefreshTokens,
    logoutUser,
    getSelectedUsersId,
    getAllUsersId,
    updateUserInfo,
    updateUserPassword,
    isPasswordValid,
    getCompleteUserInfoById,
    userDeactivate,
    updateProfileImage
};
