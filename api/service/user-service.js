import connect from "../db.connect.js";
import bcrypt from 'bcrypt';

export const createUser = async (user) => {
  const db = connect();

  let data = {};
  try {

    var encryptedPwd = await bcrypt.hash(user.password, 10);
    user.password = encryptedPwd;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    data = await db.users.create(user);

    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      account_created: data.createdAt,
      account_updated: data.updatedAt,
    };
  } catch (err) {
    console.log("Error: " + err);
    throw new Error(err);
  }
};

export const getUser = async (id) => {
  const db = connect();

  let data = {};
  try {
    data = await db.users.findOne({
      raw: true,
      where: {
        id: id
      }
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}