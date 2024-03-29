'use strict';

import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';

// Add DB Models
import { UserModel, UserFinanceModel, executeQuery } from 'lib-common-service';

const isUserByUserNameOrEmailAvailable = async(userName, emailId) => {
    const isUserExist = UserModel.findOne({
        $or: [{ userName }, { emailId }]
    });
    return await executeQuery(isUserExist);
}

const isUserByIdAvailable = async(userId) => {
    const isUserExist = UserModel.findById({
        _id: userId
    }).select(
        '-password -isDeleted -createdBy -modifiedBy'
    );
    return await executeQuery(isUserExist);
}

const getSelectedUsersId = async(userIds) => {
    const selectedUsersId = UserModel.find({
        _id: {
            $in: userIds
        },
        isDeleted: false
    }).select('_id');
    return await executeQuery(selectedUsersId);
}

const getAllUsersId = async() => {
    const allUsersId = UserModel.find({
        isDeleted: false
    }).select('_id');
    return await executeQuery(allUsersId);
}

const getCompleteUserInfoById = async(userId) => {
    const userInfo = UserModel.findById({
        _id: userId
    });
    return await executeQuery(userInfo);
}

const generateVerificationCode = async(userId) => {
    const userQuery = UserModel.findById({ _id: userId });
    const user = await executeQuery(userQuery);

    const verificationCode = uuidv4() + user._id;
    const updatedUserInfo = UserModel.findByIdAndUpdate(
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
    return await executeQuery(updatedUserInfo);
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
    const updatedUserInfo = UserModel.findByIdAndUpdate(
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

    return await executeQuery(updatedUserInfo);
}

const verifyPassword = async(user, password) => {
    const isPasswordValid = await user.isPasswordCorrect(password);
    return isPasswordValid;
}

const reactivateUser = async(userId) => {
    const updatedUser = UserModel.findByIdAndUpdate(
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

    return await executeQuery(updatedUser);
}

const generateAccessAndRefreshTokens = async(userId) => {
    const userQuery = UserModel.findById({ _id: userId });
    const user = await executeQuery(userQuery);

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

    const updatedUserInfoQuery = UserModel.findByIdAndUpdate(
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
    const updatedUserInfo = await executeQuery(updatedUserInfoQuery);

    return {
        accessToken,
        refreshToken,
        userId: updatedUserInfo._id,
        userName: updatedUserInfo.userName
    };
}

const logoutUser = async(userId) => {
    const logoutUserQuery = UserModel.findByIdAndUpdate(
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
    await executeQuery(logoutUserQuery);
    return true;
}

const updateUserInfo = async(userId, payload) => {
    const currentUserInfo = await isUserByIdAvailable(userId);

    const updatedUserInfo = UserModel.findByIdAndUpdate(
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
    return await executeQuery(updatedUserInfo);
}

const isPasswordValid = async(user, password) => {
    if (!(await user.isPasswordCorrect(password))) {
        return false;
    }
    return true;
}

const updateUserPassword = async(userId, payload) => {
    const currentUserInfoQuery = UserModel.findOne({
        _id: userId
    });
    const currentUserInfo = await executeQuery(currentUserInfoQuery);

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
    const updatedUserInfo = UserModel.findByIdAndUpdate(
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
    return await executeQuery(updatedUserInfo);
}

const updateProfileImage = async(userId, cloudinaryImageURL) => {
    const updatedUserInfo = UserModel.findByIdAndUpdate(
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
        '-password -isVerified -isDeleted -verificationCode -verificationCodeExpiry -refreshToken -createdBy -modifiedBy'
    );
    return await executeQuery(updatedUserInfo);
}

const deleteProfileImage = async(userId) => {
    const updatedUserInfo = UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $set: {
                profileImageURL: '',
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        '-password -isVerified -isDeleted -verificationCode -verificationCodeExpiry -refreshToken -createdBy -modifiedBy'
    );
    return await executeQuery(updatedUserInfo);
}

const generatePasswordCode = async(userId) => {
    const userQuery = UserModel.findById({ _id: userId });
    const user = await executeQuery(userQuery);

    const forgotPasswordToken = uuidv4() + user._id;
    const updatedUserInfo = UserModel.findByIdAndUpdate(
        { _id: user._id },
        {
            $set: {
                forgotPasswordToken: forgotPasswordToken,
                forgotPasswordTokenExpiry: Date.now() + (30 * 60 * 1000),
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
    return await executeQuery(updatedUserInfo);
}

const resetUserPassword = async(userId, password) => {
    const currentUserInfoQuery = UserModel.findOne({
        _id: userId
    });
    const currentUserInfo = await executeQuery(currentUserInfoQuery);

    currentUserInfo.password = password;
    currentUserInfo.forgotPasswordToken = '';
    currentUserInfo.modifiedOn = Date.now();
    currentUserInfo.modifiedBy = userId;
    await currentUserInfo.save({
        validateBeforeSave: false
    });

    const updatedUserInfo = await isUserByIdAvailable(userId);
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
    updateProfileImage,
    deleteProfileImage,
    generatePasswordCode,
    resetUserPassword
};
