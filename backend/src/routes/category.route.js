import { Router } from "express";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  AddCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller.js";

const router = Router();

router.get("/", getCategoryController);

// Management Routes
router.post("/add-category", protectRoute, adminOnly, upload.single("image"), AddCategoryController);
router.put("/update-category", protectRoute, adminOnly, upload.single("image"), updateCategoryController);
router.delete("/delete-category", protectRoute, adminOnly, deleteCategoryController);

export default router;