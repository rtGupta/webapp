const Image = (sequelize, DataTypes, Model) => {
  const image = sequelize.define(
    "Image",
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        readOnly: true,
      },
      image_id: {
        type: DataTypes.UUID,
        readOnly: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        readOnly: true,
        references: { model: "Products", key: "id" },
      },
      file_name: {
        type: DataTypes.STRING,
        readOnly: true,
      },
      date_created: {
        type: DataTypes.DATE,
        readOnly: true,
      },
      s3_bucket_path: {
        type: DataTypes.TEXT,
        readOnly: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "date_created",
      }
    },
    {
      updatedAt: false,
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "Image", // We need to choose the model name
    }
  );

  return image;
};

export default Image;
