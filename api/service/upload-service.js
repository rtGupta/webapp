import connect from "../db.connect.js";

export const upload = async (image) => {
  const db = connect();
  let data = {};

  try {
    data = await db.images.create(image);

    return {
      image_id: data.id,
      product_id: data.product_id,
      file_name: data.file_name,
      date_created: data.date_created,
      s3_bucket_path: data.s3_bucket_path,
    };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getImagesByProduct = async (productId) => {
  const db = connect();

  let data = {};
  try {
    data = await db.images.findAll({
      where: {
        product_id: productId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getImageById = async (imageId) => {
  const db = connect();

  let data = {};
  try {
    data = await db.images.findOne({
      raw: true,
      where: {
        id: imageId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const deleteImage = async (imageId) => {
  const db = connect();

  let data = {};
  try {
    data = await db.images.destroy({
      where: {
        id: imageId
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
