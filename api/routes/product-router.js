import express from "express";
import * as productController from "./../controller/product-controller.js";

const router = express.Router();

router.route("/product").post(productController.post);

router.route("/product/:id")
            .get(productController.get)
            .put(productController.updateProduct)
            .delete(productController.deleteProduct)
            .patch(productController.update);

export default router;
