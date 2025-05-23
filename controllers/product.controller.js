const Product = require('../models/Product.model');
const { validationResult } = require('express-validator');


// Create a new product
exports.createProduct = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If validation fails, return errors
        return res.status(400).json({ error: errors.array() });
    }

    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const {
        name,
        description,
        price,
        discountPercentage,
        countInStock,
        stockStatus,
        sku,
        sizes,
        colors,
        images,
        gender,
        material,
        isFeatured,
        isDeleted,
        isPublished,
        tags,
        dimensions,
        weight
    } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            discountPercentage,
            countInStock,
            stockStatus,
            sku,
            sizes,
            colors,
            images,
            gender,
            material,
            isFeatured,
            isDeleted,
            isPublished,
            tags,
            dimensions,
            weight,
            user: req.user._id
        });

        await newProduct.save();

        return res.status(201).json({
            msg: 'Product created successfully',
            product: newProduct
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}


// Get all products
exports.getAllProducts = async (req, res) => {
    const {
        collection,
        category,
        gender,
        material,
        sizes,
        colors,
        minPrice,
        maxPrice,
        limit,
        sortBy,
        search
    } = req.query;

    const query = {};

    if (collection && collection.toLowerCase() !== 'all') {
        query.collection = collection;
    }
    if (gender && gender.toLowerCase() !== 'all') {
        query.gender = gender;
    }
    if (category && category.toLowerCase() !== 'all') {
        query.category = category;
    }
    if (material) {
        query.material = { $in: material.split(',') };
    }
    if (sizes) {
        query.sizes = { $in: sizes.split(',') };
    }
    if (colors) {
        query.colors = { $in: colors.split(',') };
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const sortOptions = {};
    switch (sortBy) {
        case 'price-asc': sortOptions.price = 1; break;
        case 'price-desc': sortOptions.price = -1; break;
        case 'name-asc': sortOptions.name = 1; break;
        case 'name-desc': sortOptions.name = -1; break;
        case 'createdAt-asc': sortOptions.createdAt = 1; break;
        case 'createdAt-desc': sortOptions.createdAt = -1; break;
        case 'popularity-asc': sortOptions.popularity = 1; break;
        case 'popularity-desc': sortOptions.popularity = -1; break;
        default: break;
    }

    try {
        const products = await Product.find({
            ...query,
            isDeleted: false,
            isPublished: true
        })
            .sort(sortOptions)
            .limit(Number(limit) || 0);

        return res.status(200).json({
            msg: 'Products fetched successfully',
            products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
};



// Get a single product by ID
exports.getProductById = async (req, res) => {

    // get the product id from params 
    const { id } = req.params;

    // try to get the product if exist
    try {
        // check if product exist
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // return the product with status 200 

        return res.status(200).json({
            msg: 'Product Fetched successfully',
            product
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }

}


// Get similar products by ID
exports.getSimilarProducts = async (req, res) => {

    // get the product id from params
    const { id } = req.params;

    // try to get the product if exist
    try {

        // check if product exist
        const product = await Product.findById(id);


        // get 4 similar products
        const similarProducts = await Product.find({
            _id: { $ne: product._id }, // Exclude the current product
            gender: product.gender,
            category: product.category,
            material: product.material,
            isDeleted: false,
            isPublished: true,
        }).limit(8);

        return res.status(200).json({
            msg: 'Similar products fetched successfully',
            similarProducts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}


// Get 4 other products like hats, vest etc
exports.getOtherProducts = async (req, res) => {

    // try to get the other products
    try {

        const otherProducts = await Product.find({
            isDeleted: false,
            isPublished: true,
            category: 'other'
        }).limit(4).sort({ createdAt: -1 });


        return res.status(200).json({
            msg: 'Other products fetched successfully',
            otherProducts
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}
// Get all deleted products
exports.getBestSellingProducts = async (req, res) => {

    // try to get the best selling product
    try {

        const bestSellingProduct = await Product.findOne({ 
            isDeleted: false, 
            isPublished: true,
            ratings: { $gt: 0 }, // Only consider products with ratings
            numReviews: { $gt: 0 } // Only consider products with reviews
        })
        .sort({ 
            ratings: -1, // Higher ratings first
            numReviews: -1, // More reviews second
            createdAt: -1 // Newer products third
        });
        
        return res.status(200).json({
            msg: 'Best selling product fetched successfully',
            bestSellingProduct
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}

// Get New Arrivals Products
exports.getNewArrivalsProducts = async (req, res) => {
    // try to get the new arrivals product
    try {
        const newArrivalsProduct = await Product.find({ isDeleted: false, isPublished: true }).sort({ createdAt: -1 }).limit(8);

        return res.status(200).json({
            msg: 'New arrivals product fetched successfully',
            newArrivalsProduct
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}
// Update a product by ID
exports.updateProduct = async (req, res) => {

    // Check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If validation fails, return errors
        return res.status(400).json({ error: errors.array() });
    }

    // get product id from params
    const { id } = req.params;

    // check if product exists
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // get data from body
    const {
        name,
        description,
        price,
        discountPercentage,
        countInStock,
        stockStatus,
        sku,
        sizes,
        colors,
        images,
        gender,
        material,
        isFeatured,
        isDeleted,
        isPublished,
        tags,
        dimensions,
        weight
    } = req.body;

    // try to update product
    try {
        const updatedProductData = {
            name,
            description,
            price,
            discountPercentage,
            countInStock,
            stockStatus,
            sku,
            sizes,
            colors,
            images,
            gender,
            material,
            isFeatured,
            isDeleted,
            isPublished,
            tags,
            dimensions,
            weight
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });

        return res.status(200).json({
            msg: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}


// Delete a product by ID
exports.deleteProduct = async (req, res) => {

    // get product id from param 
    const { id } = req.params;

    // check if the product exist
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // try to soft delete the product 
    try {
        product.isDeleted = true;
        await product.save();

        return res.status(200).json({ message: 'Product marked as deleted successfully', product });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}




