import * as productService from "../service/product-service.js";
import * as uploadService from "../service/upload-service.js";
import { getAuthorizedUser } from "./user-controller.js";

import { s3 } from "./s3.js";
import { client } from "../../util/statsd_client.js";
import Config from "../../config/config.js";
import logger from "../../util/logger.js";

const deleteProductFromS3 = async (bucket, key) => {
  try {
    const listParams = {
      Bucket: bucket,
      Prefix: key,
    };
    const listedObjects = await s3.listObjectsV2(listParams).promise();
    const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: [] },
    };
    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });
    await s3.deleteObjects(deleteParams).promise();
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

const setErrorResponse = (error, response) => {
  response.status(500);
  response.json(error);
  logger.error(
    `${error.status || 500} - ${response.statusMessage} - ${error.message} - ${
      request.originalUrl
    } - ${request.method} - ${request.ip}`
  )
};

const setSuccessResponse = (obj, response) => {
  response.status(201);
  response.json(obj);
};

const sendErrorResponse = (obj, response) => {
  response.status(obj.errorCode);
  response.json({
    message: obj.message
  });
  logger.error(`${obj.errorCode} - ${response.statusMessage} - ${obj.message}`);
};

export const post = async (request, response) => {
  client.increment("endpoint.createProduct.http.post");
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
      // response.status(400);
      // response.json({
      //   message,
      // });
      const err = {
        errorCode: 400,
        message: message
      };
      sendErrorResponse(err, response);
    } else if (
      "date_added" in request.body ||
      "id" in request.body ||
      "date_last_updated" in request.body ||
      "owner_user_id" in request.body
    ) {
      // response.status(400).json({
      //   message: "Bad Request",
      // });
      const err = {
        errorCode: 400,
        message: "Bad Request"
      };
      sendErrorResponse(err, response);
    } else {
      if (request.body.quantity && typeof request.body.quantity != "number") {
        // response.status(400).json({
        //   message: "Quantity should be an integer value.",
        // });
        const err = {
          errorCode: 400,
          message: "Quantity should be an integer value."
        };
        sendErrorResponse(err, message);
        return;
      }
      const result = await getAuthorizedUser(request, response);
      if (result.message) {
        // response.status(401).json({
        //   message: result.message,
        // });
        const err = {
          errorCode: 401,
          message: result.message
        };
        sendErrorResponse(err, response);
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
      // response.status(400);
      // response.json({
      //   message: "A product with the same sku already exists!",
      // });
      const err = {
        errorCode: 400,
        message: "A product with the same sku already exists!"
      }
      sendErrorResponse(err, response);
    } else if (error.message.includes("SequelizeValidationError")) {
      // response.status(400).send({
      //   message: error.message,
      // });
      const err = {
        errorCode: 400,
        message: error.message
      };
      sendErrorResponse(err, response);
    } else {
      console.log(error);
      setErrorResponse(error, response);
    }
  }
};

export const fetchProductByUser = async (request, response) => {
  const productId = request.params.id;

  if (isNaN(productId)) {
    response.status(400).send({
      message: "Invalid Product ID",
    });
    return;
  }

  try {
    const result = await getAuthorizedUser(request, response);

    if (result.message) {
      return {
        message: result.message,
        status: 401,
      };
    } else {
      const product = await productService.getProduct(productId);
      if (!product) {
        return {
          message: "Product not found!",
          status: 404,
        };
      } else if (product.owner_user_id != result.id) {
        return {
          message: "Forbidden",
          status: 403,
        };
      } else {
        return {
          product,
        };
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const get = async (request, response) => {
  client.increment("endpoint.fetchProduct.http.get");
  const productId = request.params.id;

  if (isNaN(productId)) {
    // response.status(400).send({
    //   message: "Invalid Product ID",
    // });
    const err = {
      errorCode: 400,
      message: "Invalid Product ID"
    };
    sendErrorResponse(err, response);
    return;
  }

  try {
    const product = await productService.getProduct(productId);

    if (!product) {
      // response.status(404).send({
      //   message: "Product not found!",
      // });
      const err = {
        errorCode: 400,
        message: "Product not found!"
      };
      sendErrorResponse(err, response);
      return;
    }

    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      manufacturer: product.manufacturer,
      quantity: product.quantity,
      owner_user_id: product.owner_user_id,
      date_added: product.date_added,
      date_last_updated: product.date_last_updated,
    };

    response.status(200).send(productData);
  } catch (error) {
    setErrorResponse(error, response);
  }
};

export const update = async (request, response) => {
  client.increment("endpoint.updateProduct.http.patch");
  const productId = request.params.id;

  if (isNaN(productId)) {
    // response.status(400).send({
    //   message: "Invalid Product ID",
    // });
    const err = {
      errorCode: 400,
      message: "Invalid Product ID"
    };
    sendErrorResponse(err, response);
    return;
  }

  for (let key in request.body) {
    if (request.body[key] == null) {
      // response.status(400).send({
      //   message: "Bad Request",
      // });
      const err = {
        errorCode: 400,
        message: "Bad Request"
      };
      sendErrorResponse(err, response);
      return;
    }
  }

  try {
    if (request.body.quantity && typeof request.body.quantity != "number") {
      // response.status(400).json({
      //   message: "Quantity should be an integer value.",
      // });
      const err = {
        errorCode: 400,
        message: "Quantity should be an integer value."
      };
      sendErrorResponse(err, message);
      return;
    }
    const result = await getAuthorizedUser(request, response);
    if (result.message) {
      // response.status(401).json({
      //   message: result.message,
      // });
      const err = {
        errorCode: 401,
        message: result.message
      };
      sendErrorResponse(err, response);
    } else {
      const product = await productService.getProduct(productId);

      if (!product) {
        // response.status(404).send({
        //   message: "Product not found!",
        // });
        const err = {
          errorCode: 404,
          message: "Product not found!"
        };
        sendErrorResponse(err, response);
        return;
      }
      if (product.owner_user_id != result.id) {
        // response.status(403).send({
        //   message: "Forbidden",
        // });
        const err = {
          errorCode: 403,
          message: "Forbidden"
        };
        sendErrorResponse(err, response);
        return;
      } else {
        if (
          "date_added" in request.body ||
          "id" in request.body ||
          "date_last_updated" in request.body ||
          "owner_user_id" in request.body
        ) {
          // response.status(400).json({
          //   message: "Bad Request",
          // });
          const err = {
            errorCode: 400,
            message: "Bad Request"
          };
          sendErrorResponse(err, response);
          return;
        }
        const payload = {
          ...request.body,
          id: productId,
          date_added: product.date_added,
          date_last_updated: product.date_last_updated,
        };
        const updated = await productService.updateProduct(payload);
        const updatedProduct = {
          id: updated[1].id,
          name: updated[1].name,
          description: updated[1].description,
          sku: updated[1].sku,
          manufacturer: updated[1].manufacturer,
          quantity: updated[1].quantity,
          owner_user_id: updated[1].owner_user_id,
          date_added: updated[1].date_added,
          date_last_updated: updated[1].date_last_updated,
        };
        response.status(204).send(updatedProduct);
        logger.info(`Product with sku ${updatedProduct.sku} was successfully updated!`);
      }
    }
  } catch (error) {
    if (error.message.includes("SequelizeUniqueConstraintError")) {
      // response.status(400);
      // response.json({
      //   message: "A product with the same sku already exists!",
      // });
      const err = {
        errorCode: 400,
        message: "A product with the same sku already exists!"
      }
      sendErrorResponse(err, response);
    } else if (error.message.includes("SequelizeValidationError")) {
      // response.status(400).send({
      //   message: error.message,
      // });
      const err = {
        errorCode: 400,
        message: error.message
      };
      sendErrorResponse(err, response);
    } else {
      setErrorResponse(error, response);
    }
  }
};

export const updateProduct = async (request, response) => {
  client.increment("endpoint.updateProduct.http.put");
  if (
    !request.body.name ||
    !request.body.description ||
    !request.body.sku ||
    !request.body.manufacturer ||
    !request.body.quantity
  ) {
    // response.status(400);
    // response.json({
    //   message: "A required field is empty.",
    // });
    const err = {
      errorCode: 400,
      message: "A required field is empty."
    };
    sendErrorResponse(err, response);
    return;
  }
  update(request, response);
};

export const deleteProduct = async (request, response) => {
  client.increment("endpoint.deleteProduct.http.delete");
  const productId = request.params.id;

  if (isNaN(productId)) {
    // response.status(400).send({
    //   message: "Invalid Product ID",
    // });
    const err = {
      errorCode: 400,
      message: "Invalid Product ID"
    };
    sendErrorResponse(err, response);
    return;
  }

  try {
    const result = await getAuthorizedUser(request, response);
    if (result.message) {
      // response.status(401).json({
      //   message: result.message,
      // });
      const err = {
        errorCode: 401,
        message: result.message
      };
      sendErrorResponse(err, response);
    } else {
      const product = await productService.getProduct(productId);

      if (!product) {
        // response.status(404).send({
        //   message: "Product not found!",
        // });
        const err = {
          errorCode: 404,
          message: "Product not found!"
        };
        sendErrorResponse(err, response);
        return;
      }

      if (product.owner_user_id != result.id) {
        // response.status(403).send({
        //   message: "Forbidden",
        // });
        const err = {
          errorCode: 403,
          message: "Forbidden"
        };
        sendErrorResponse(err, response);
        return;
      } else {
        const images = await (uploadService.getImagesByProduct(productId));

        await (deleteProductFromS3(Config.s3bucketName, `Product ${productId}/`));
        logger.info(`Product ${productId} was successfully deleted from the S3 bucket.`);
        await Promise.all(images.map((image) => uploadService.deleteImage(image.id, productId)));
        logger.info(`Images metadata belonging to the product ${productId} was deleted successfully!`);

        const res = await productService.deleteProduct(productId);
        if (!res) {
          // response.status(404).send({
          //   message: "The product doesn't exist."
          // });
          const err = {
            errorCode: 404,
            message: "The product doesn't exist."
          };
          sendErrorResponse(err, response);
        } else {
          response.status(204).send();
        }
        // response.status(204).send();
      }
    }
  } catch (error) {
    if (error.message.includes("SequelizeValidationError")) {
      // response.status(400).send({
      //   message: error.message,
      // });
      const err = {
        errorCode: 400,
        message: error.message
      };
      sendErrorResponse(err, response);
    } else {
      setErrorResponse(error, response);
    }
  }
};
