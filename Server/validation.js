import Joi from 'joi';
export function validateUser(user){

    const template = {
        Name: Joi.string().min(3).required(),
        Password: Joi.min(8).pattern(new RegExp('(?=.*[a-z])')).pattern(new RegExp('(?=.*[A-Z])')).required() 
    }

    return Joi.validate(user, template);
}


export function validateSubscribedUser(subscribedUser) {
    const template = {
        UserName: Joi.string().min(3).required(),
        Phone: Joi.string()
            .pattern(new RegExp('^\\+?[1-9]\\d{1,14}$')) // Valid international phone number format
            .required(),
        Address: Joi.string().min(5).required(),
        Email: Joi.string().email().required(),
        subscriptionLength: Joi.number().integer().min(1).required()
    };

    return Joi.validate(subscribedUser, template);
}

export function validateBook(book) {
    const template = {
        BookID: Joi.number().integer().required(),
        Title: Joi.string().min(3).required(),
        Author: Joi.string().min(3).required(),
        Summary: Joi.string().min(10).optional().allow(''),
        ImagePath: Joi.string().uri().optional()
    };

    return Joi.validate(book, template);
}

export function validateQuote(quote) {
    const template = {
        quote: Joi.string().min(10).required()
    };

    return Joi.validate(quote, template);
}


export function validateImage(image) {
    const template = {
        ImagePath: Joi.string().uri().required()
    };

    return Joi.validate(image, template);
}