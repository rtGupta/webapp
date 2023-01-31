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
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          notEmpty: true
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
          notEmpty: true
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          notEmpty: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          notEmpty: true
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
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
  