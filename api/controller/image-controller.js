import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import * as productController from "../controller/product-controller.js";
import * as uploadService from "../service/upload-service.js";

import Config from "../../config/config.js";
import { s3 } from "./s3.js";

const storage = multer.memoryStorage();

const S3_BUCKET = Config.s3bucketName;

const multerFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    // upload only png, jpg, or jpeg format
    return cb(new Error("Please upload an Image!"));
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

const uploadToS3 = async (key, buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: S3_BUCKET,
        ContentType: mimetype,
        Key: key,
        Body: buffer,
      },
      () => resolve()
    );
  });
};

const deleteS3Object = async (bucket, key) => {
  return new Promise((resolve, reject) => {
    s3.deleteObject(
      {
        Bucket: bucket,
        Key: key,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const getSignedURL = (bucket, key, expires = 3600) => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl(
      "getObject",
      {
        Bucket: bucket,
        Key: key,
        Expires: expires,
      },
      (err, url) => {
        if (err) {
          reject(err);
        } else {
          console.log(url);
          resolve(url);
        }
      }
    );
  });
};

const setErrorResponse = (error, response) => {
  response.status(500);
  response.json(error);
};

const setSuccessResponse = (obj, response) => {
  response.status(201);
  response.json(obj);
};

export const uploadImage = async (request, response) => {
  try {
    const result = await productController.fetchProductByUser(
      request,
      response
    );

    if (!result.product) {
      response.status(result.status).send(result);
      return;
    } else {
      if (!("file" in request.body) || !request.file) {
        response.status(400).json({
          message: "Bad Request",
        });
        return;
      }

      const imageId = uuidv4();
      await uploadToS3(
        `Product ${result.product.id}/images/${imageId}`,
        request.file.buffer,
        request.file.mimetype
      );
      const s3_image_url = await getSignedURL(
        S3_BUCKET,
        `Product ${result.product.id}/images/${imageId}`
      );

      const payload = {
        file_name: request.body.file,
        image_id: imageId,
        product_id: result.product.id,
        s3_bucket_path: s3_image_url,
      };
      const data = await uploadService.upload(payload);
      setSuccessResponse(data, response);
    }
  } catch (error) {
    setErrorResponse(error, response);
  }
};

export const getImagesList = async (request, response) => {
  try {
    const result = await productController.fetchProductByUser(
      request,
      response
    );

    if (!result.product) {
      response.status(result.status).send(result);
      return;
    } else {
      const data = await uploadService
        .getImagesByProduct(result.product.id)
        .then((res) => {
          return res.map((image) => {
            return {
              image_id: image.dataValues.image_id,
              product_id: image.dataValues.product_id,
              file_name: image.dataValues.file_name,
              date_created: image.dataValues.date_created,
              s3_bucket_path: image.dataValues.s3_bucket_path,
            };
          });
        });
      response.status(200).send(data);
    }
  } catch (error) {
    setErrorResponse(error, response);
  }
};

export const fetchImageByID = async (request, response) => {
  const productId = request.params.id;
  const imageId = request.params.imageId;

  if (!productId || !imageId) {
    response.status(400).send({
      message: "Bad Request",
    });
    return;
  } else {
    try {
      const result = await productController.fetchProductByUser(
        request,
        response
      );

      if (!result.product) {
        return result;
      } else {
        const image = await uploadService.getImageById(imageId);
        if (!image) {
          return {
            message: "Image not found!",
            status: 404,
          };
        } else {
          return {
            product: result.product,
            image,
          };
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
};

export const getImage = async (request, response) => {
  try {
    const result = await fetchImageByID(request, response);
    if (!result.image) {
      response.status(result.status).send(result);
      return;
    } else {
      setSuccessResponse(result.image, response);
    }
  } catch (error) {
    setErrorResponse(error, response);
  }
};

export const deleteImage = async (request, response) => {
  try {
    const result = await fetchImageByID(request, response);
    if (!result.image) {
      response.status(result.status).send(result);
      return;
    } else {
      await deleteS3Object(
        S3_BUCKET,
        `Product ${result.product.id}/images/${result.image.image_id}`
      );
      const res = await uploadService.deleteImage(request.params.imageId);
      response.status(204).send();
    }
  } catch (error) {
    setErrorResponse(error, response);
  }
};
