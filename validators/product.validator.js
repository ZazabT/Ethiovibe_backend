const { body } = require('express-validator');


// Product create validation
exports.createProductValidator = [
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


// Product update validation
exports.updateProductValidator = [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
  
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
  
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a number >= 0'),
  
    body('discountPercentage')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Discount percentage must be between 0 and 100'),
  
    body('countInStock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Count in stock must be an integer >= 0'),
  
    body('stockStatus')
      .optional()
      .isIn(['IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK'])
      .withMessage('Invalid stock status'),
  
    body('sku')
      .optional()
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('SKU must be between 5 and 50 characters'),
  
    body('sizes')
      .optional()
      .isArray()
      .withMessage('Sizes must be an array')
      .custom((sizes) => {
        for (const size of sizes) {
          if (!['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(size)) {
            throw new Error('Invalid size value');
          }
        }
        return true;
      }),
  
    body('colors')
      .optional()
      .isArray()
      .withMessage('Colors must be an array')
      .custom((colors) => {
        for (const color of colors) {
          if (typeof color !== 'string' || !color.trim()) {
            throw new Error('Each color must be a non-empty string');
          }
        }
        return true;
      }),
  
    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array')
      .custom((images) => {
        for (const image of images) {
          if (typeof image.url !== 'string') {
            throw new Error('Each image must have a valid "url"');
          }
          if ('isPrimary' in image && typeof image.isPrimary !== 'boolean') {
            throw new Error('"isPrimary" must be a boolean');
          }
          if ('altText' in image && typeof image.altText !== 'string') {
            throw new Error('"altText" must be a string');
          }
        }
        return true;
      }),
  
    body('gender')
      .optional()
      .isIn(['male', 'female', 'unisex'])
      .withMessage('Gender must be one of: male, female, unisex'),
  
    body('isFeatured').optional().isBoolean(),
    body('isDeleted').optional().isBoolean(),
    body('isPublished').optional().isBoolean(),
  
    body('ratings').optional().isFloat({ min: 0, max: 5 }),
    body('numReviews').optional().isInt({ min: 0 }),
  
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array of strings')
      .custom((tags) => {
        for (const tag of tags) {
          if (typeof tag !== 'string') {
            throw new Error('Each tag must be a string');
          }
        }
        return true;
      }),
  
    body('metaTitle')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Meta title must be under 100 characters'),
  
    body('metaDescription')
      .optional()
      .isLength({ max: 160 })
      .withMessage('Meta description must be under 160 characters'),
  
    body('metaKeywords')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Meta keywords must be under 200 characters'),
  
    body('dimensions.length')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Length must be >= 0'),
  
    body('dimensions.width')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Width must be >= 0'),
  
    body('dimensions.height')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Height must be >= 0'),
  
    body('weight')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Weight must be >= 0'),
  
    body('material')
      .optional()
      .isIn(['cotton', 'polyester', 'wool', 'denim', 'leather', 'silk', 'other'])
      .withMessage('Invalid material type'),
];

// exports.validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };