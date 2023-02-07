import express from "express";
import * as productController from "./../controller/product-controller.js";

const router = express.Router();

router.route("/product").post(productController.post);

export default router;
