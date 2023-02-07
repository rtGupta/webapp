import connect from "../db.connect.js";

export const createProduct = async (product) => {
  const db = connect();

  let data = {};
  try {
    data = await db.products.create(product);

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      sku: data.sku,
      manufacturer: data.manufacturer,
      quantity: data.quantity,
      owner_user_id: data.owner_user_id,
      date_added: data.date_added,
      date_last_updated: data.date_last_updated,
    };
  } catch (err) {
    throw new Error(err);
  }
};