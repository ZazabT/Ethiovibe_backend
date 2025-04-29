const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      countInStock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      stockStatus: {
        type: String,
        enum: ['IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK'],
        default: 'IN_STOCK',
      },
      sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      sizes: {
        type: [String],
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      },
      colors: {
        type: [String],
        required: true,
      },
      images: [
        {
          url: { type: String, required: true },
          isPrimary: { type: Boolean, default: false },
          altText: { type: String },
        },
      ],
      gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'unisex'],
      },
      isFeatured: {
        type: Boolean,
        default: false,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
      isPublished: {
        type: Boolean,
        default: false,
      },
      ratings: {
        type: Number,
        default: 0,
      },
      numReviews: {
        type: Number,
        default: 0,
      },
      tags: {
        type: [String],
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      metaTitle: {
        type: String,
        trim: true,
      },
      metaDescription: {
        type: String,
        trim: true,
      },
      metaKeywords: {
        type: String,
        trim: true,
      },
      dimensions: {
        length: { type: Number, min: 0 },
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 },
      },
      weight: {
        type: Number,
        min: 0,
      },
      material: {
        type: String,
        enum: ['cotton', 'polyester', 'wool', 'denim', 'leather', 'silk', 'other'],
        default: 'other',
      },
    },
    {
      timestamps: true,
    }
  );
  
  // Add text index for search
  productSchema.index({ name: 'text', description: 'text' });
  
module.exports = mongoose.model('Product', productSchema);