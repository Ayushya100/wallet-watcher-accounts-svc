'use strict';

const validators = {
    userName: /^[a-zA-Z0-9]{4,24}$/, // UserName should be only alpha-numeric without any special characters.
    password: /^[a-zA-Z0-9@]{8,16}$/, // Password should be between 8 and 16 characters long. It can be alpha-numeric and only @ is allowed.
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Email pattern.
    cardNumber:  /^\d{16}$/, // Card number should consist of 16 digits.
    accountNumber: /^\d{4,20}$/, // Account number should be between 4 and 20 characters.
    contactNumber: /^\d{10}$/, // Mobile number should consist of 10 digits.
};

export default validators;