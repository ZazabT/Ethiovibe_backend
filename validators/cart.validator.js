const { check } = require('express-validator');

exports.addToCartValidation = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format'),
    check('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    check('size')
        .notEmpty()
        .withMessage('Size is required')
        .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'])
        .withMessage('Invalid size selected'),
    check('color')
        .notEmpty()
        .withMessage('Color is required'),
    check('guestId')
        .optional()
        .isString()
        .withMessage('Invalid guest ID format'),
    check('userId')
        .optional()
        .isMongoId()
        .withMessage('Invalid user ID format')
];

exports.updateCartValidation = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format'),
    check('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    check('size')
        .notEmpty()
        .withMessage('Size is required'),
    check('color')
        .notEmpty()
        .withMessage('Color is required')
];

exports.deleteCartValidation = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format'),
    check('size')
        .notEmpty()
        .withMessage('Size is required'),
    check('color')
        .notEmpty()
        .withMessage('Color is required')
];