import { Sequelize, Model, DataTypes } from "sequelize";
import Config from "../config/config.js";
import User from "./model/user.js";
import Product from "./model/product.js";
import Image from "./model/image.js";

const connect = () => {
    const sequelize = new Sequelize(Config.database, Config.username, Config.password, {
        host: Config.host,
        dialect: Config.dialect,
        pool: {
            max: 10,
            min: 0,
            acquire: 20000,
            idle: 5000
        }
    });

    let db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    db.users = User(sequelize, DataTypes, Model);
    db.products = Product(sequelize, DataTypes, Model);
    db.images = Image(sequelize, DataTypes, Model);

    return db;
}

export default connect;