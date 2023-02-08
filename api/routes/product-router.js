import express from "express";
import * as productController from "./../controller/product-controller.js";

const router = express.Router();

router.route("/product").post(productController.post);

router.route("/product/:id")
            .get(productController.get)
            .put(productController.update)
            .delete(productController.deleteUser);

export default router;
