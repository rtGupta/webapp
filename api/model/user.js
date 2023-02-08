const User = (sequelize, DataTypes, Model) => {
  const user = sequelize.define(
    "User",
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        readOnly: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
      },
      username: {
        type: DataTypes.CITEXT,
        allowNull: false,
        unique: true,
        notEmpty: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        writeOnly: true
      },
      account_created: {
        type: DataTypes.DATE,
        readOnly: true,
      },
      account_updated: {
        type: DataTypes.DATE,
        readOnly: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "account_created",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "account_updated",
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "User", // We need to choose the model name
    }
  );

  return user;
};

export default User;
