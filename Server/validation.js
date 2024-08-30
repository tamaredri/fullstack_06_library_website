import Joi from 'joi';
export function validateUser(user){

    const template = {
        Name: Joi.string().min(3).required(),
        Password: Joi.string().min(8).pattern(new RegExp('(?=.*[a-z])')).pattern(new RegExp('(?=.*[A-Z])')).required() 
    }

    return Joi.object(template).validate(user);
}


export function validateSubscribedUser(subscribedUser) {
    const template = {
        Name: Joi.string().min(3).required(),
        Phone: Joi.string()
            .pattern(new RegExp('^\\+?[0-9]\\d{1,14}$')) // Valid international phone number format
            .required(),
        Address: Joi.string().min(5).required(),
        Email: Joi.string().email().required(),
        SubscriptionExpiration: Joi.date().required()
    };

    return Joi.object(template).validate(subscribedUser);
}

export function validateBook(book) {
    const template = {
        Title: Joi.string().min(3).required(),
        Author: Joi.string().min(3).required(),
        Summary: Joi.string().min(10).optional().allow(''),
        ImagePath: Joi.string().uri().optional()
    };

    return Joi.object(template).validate(book);
}

export function validateQuote(quote) {
    const template = {
        Quote: Joi.string().min(10).required()
    };

    return Joi.object(template).validate(quote);
}


export function validateImage(image) {
    const template = {
        ImagePath: Joi.string().uri().required()
    };

    return Joi.object(template).validate(image);
}