const Product = (sequelize, DataTypes, Model) => {
    const product = sequelize.define(
      "Product",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
          readOnly: true
        },
        name: {
          type: DataTypes.STRING
        },
        description: {
          type: DataTypes.STRING
        },
        sku: {
          type: DataTypes.CITEXT,
          unique: true
        },
        manufacturer: {
          type: DataTypes.STRING
        },
        quantity: {
          type: DataTypes.INTEGER,
          validate: {
            isInt: true,
            min: 0
          }
        },
        owner_user_id: {
          type: DataTypes.INTEGER,
          readOnly: true,
          references: {model: 'Users', key: 'id'}
        },
        date_added: {
          type: DataTypes.DATE,
          readOnly: true
        },
        date_last_updated: {
          type: DataTypes.DATE,
          readOnly: true
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'date_added'
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: 'date_last_updated'
        }
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "Product", // We need to choose the model name
      }
    );
  
    return product;
  
  };
  
  export default Product;