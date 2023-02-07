import { getAuthorizedUser } from "./user-controller.js";
import * as productService from "../service/product-service.js";

const setErrorResponse = (error, response) => {
  response.status(500);
  response.json(error);
};

const setSuccessResponse = (obj, response) => {
  response.status(201);
  response.json(obj);
};

export const post = async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.description ||
      !request.body.sku ||
      !request.body.manufacturer ||
      !request.body.quantity
    ) {
      const message =
        request.body.quantity < 0
          ? "Quantity cannot be less than 0"
          : "A required field is missing";
      response.status(400);
      response.json({
        message,
      });
    } else {
      const result = await getAuthorizedUser(request, response);
      if (result.message) {
        response.status(401).json({
          message: result.message,
        });
      } else {
        const payload = {
          ...request.body,
          owner_user_id: result.id,
        };
        const product = await productService.createProduct(payload);
        setSuccessResponse(product, response);
      }
    }
  } catch (error) {
    if (error.message.includes("SequelizeUniqueConstraintError")) {
      response.status(400);
      response.json({
        message: "A product with the same sku already exists!",
      });
    } else if (error.message.includes("SequelizeValidationError")) {
      response.status(400).send({
        message: error.message,
      });
    } else {
      console.log(error);
      setErrorResponse(error, response);
    }
  }
};

export const get = async (request, response) => {
  const productId = request.params.id;

  try {
    const product = await productService.getProduct(productId);

    if (!product) {
      response.status(404).send({
        message: "Product not found!",
      });
      return;
    }
    setSuccessResponse(product, response);
  } catch (error) {
    setErrorResponse(error, response);
  }
};
