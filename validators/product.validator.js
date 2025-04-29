const { body } = require('express-validator');

exports.productValidator = [
    // Name
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    // Description
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),

    // Price
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a number greater than or equal to 0'),

    // Discount Percentage
    body('discountPercentage')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Discount percentage must be a number between 0 and 100'),

    // Count in Stock
    body('countInStock')
        .notEmpty()
        .withMessage('Count in stock is required')
        .isInt({ min: 0 })
        .withMessage('Count in stock must be an integer greater than or equal to 0'),

    // Stock Status
    body('stockStatus')
        .notEmpty()
        .withMessage('Stock status is required')
        .isIn(['IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK'])
        .withMessage(
            'Stock status must be one of: IN_STOCK, OUT_OF_STOCK, LOW_STOCK'
        ),

    // SKU
    body('sku')
        .trim()
        .notEmpty()
        .withMessage('SKU is required')
        .isLength({ min: 5, max: 50 })
        .withMessage('SKU must be between 5 and 50 characters'),

    // Sizes
    body('sizes')
        .notEmpty()
        .withMessage('At least one size is required')
        .isArray()
        .withMessage('Sizes must be an array')
        .custom((sizes) => {
            if (!sizes || sizes.length === 0) {
                throw new Error('At least one size is required');
            }
            for (const size of sizes) {
                if (!['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(size)) {
                    throw new Error('Each size must be one of: XS, S, M, L, XL, XXL, XXXL');
                }
            }
            return true;
        }),

    // Colors
    body('colors')
        .notEmpty()
        .withMessage('At least one color is required')
        .isArray()
        .withMessage('Colors must be an array')
        .custom((colors) => {
            if (!colors || colors.length === 0) {
                throw new Error('At least one color is required');
            }
            for (const color of colors) {
                if (typeof color !== 'string' || color.trim() === '') {
                    throw new Error('Each color must be a non-empty string');
                }
            }
            return true;
        }),

    // Images
    body('images')
        .notEmpty()
        .withMessage('At least one image is required')
        .isArray()
        .withMessage('Images must be an array')
        .custom((images) => {
            if (!images || images.length === 0) {
                throw new Error('At least one image is required');
            }
            for (const image of images) {
                if (!image.url || typeof image.url !== 'string') {
                    throw new Error('Each image must have a valid URL');
                }
                if (image.isPrimary && typeof image.isPrimary !== 'boolean') {
                    throw new Error('isPrimary must be a boolean');
                }
                if (image.altText && typeof image.altText !== 'string') {
                    throw new Error('altText must be a string');
                }
            }
            return true;
        }),

    // Gender
    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['male', 'female', 'unisex'])
        .withMessage('Gender must be one of: male, female, unisex'),

    // isFeatured
    body('isFeatured')
        .optional()
        .isBoolean()
        .withMessage('isFeatured must be a boolean'),

    // isDeleted
    body('isDeleted')
        .optional()
        .isBoolean()
        .withMessage('isDeleted must be a boolean'),

    // isPublished
    body('isPublished')
        .optional()
        .isBoolean()
        .withMessage('isPublished must be a boolean'),

    // Ratings
    body('ratings')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Ratings must be a number between 0 and 5'),

    // Num Reviews
    body('numReviews')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Number of reviews must be an integer greater than or equal to 0'),

    // Tags
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
        .custom((tags) => {
            if (!tags) return true;
            for (const tag of tags) {
                if (typeof tag !== 'string') {
                    throw new Error('Each tag must be a string');
                }
            }
            return true;
        }),

    // User
    body('user')
        .notEmpty()
        .withMessage('User is required')
        .isMongoId()
        .withMessage('User must be a valid MongoDB ObjectId'),

    // Meta Fields
    body('metaTitle')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Meta title must be less than 100 characters'),
    body('metaDescription')
        .optional()
        .trim()
        .isLength({ max: 160 })
        .withMessage('Meta description must be less than 160 characters'),
    body('metaKeywords')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Meta keywords must be less than 200 characters'),

    // Dimensions
    body('dimensions.length')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Length must be a number greater than or equal to 0'),
    body('dimensions.width')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Width must be a number greater than or equal to 0'),
    body('dimensions.height')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Height must be a number greater than or equal to 0'),

    // Weight
    body('weight')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Weight must be a number greater than or equal to 0'),

    // Material
    body('material')
        .optional()
        .isIn(['cotton', 'polyester', 'wool', 'denim', 'leather', 'silk', 'other'])
        .withMessage('Material must be one of: cotton, polyester, wool, denim, leather, silk, other'),
];

// exports.validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };