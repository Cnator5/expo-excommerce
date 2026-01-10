import CategoryModel from "../models/category.model.js";
import { Product as ProductModel } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/**
 * Create a new category
 */
export const AddCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    // Upload temporary file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
    });

    // Delete the temporary local file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const addCategory = new CategoryModel({
      name,
      image: uploadResult.secure_url, // Save the Cloudinary URL
    });

    const savedCategory = await addCategory.save();

    if (!savedCategory) {
      return res.status(500).json({
        message: "Not Created",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Add Category",
      data: savedCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    // Cleanup local file if error occurs during upload
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Get all categories
 */
export const getCategoryController = async (_req, res) => {
  try {
    const data = await CategoryModel.find().sort({ createdAt: -1 });

    return res.json({
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Update a category
 */
export const updateCategoryController = async (req, res) => {
  try {
    const { _id, name } = req.body;
    let updateData = { name };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });
      fs.unlinkSync(req.file.path); // Remove local temp file
      updateData.image = uploadResult.secure_url;
    }

    const update = await CategoryModel.updateOne(
      { _id: _id },
      { $set: updateData }
    );

    return res.json({
      message: "Updated Category",
      success: true,
      error: false,
      data: update,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Delete a category
 */
export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    const checkProduct = await ProductModel.find({
      category: { $in: [_id] },
    }).countDocuments();

    if (checkProduct > 0) {
      return res.status(400).json({
        message: "Category is already use can't delete",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await CategoryModel.deleteOne({ _id: _id });

    return res.json({
      message: "Delete category successfully",
      data: deleteCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};