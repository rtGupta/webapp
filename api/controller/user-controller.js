import emailValidator from "email-validator";
import passwordValidator from "password-validator";

import * as userService from "../service/user-service.js";

// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits(2)
  .has().not().spaces()

const setErrorResponse = (error, response) => {
  response.status(500);
  response.json(error);
};

const setSuccessResponse = (obj, response) => {
  response.status(201);
  response.json(obj);
};

export const post = async (request, response) => {
  const email = request.body.username;
  const password = request.body.password;

  if (
    !request.body.firstName ||
    !request.body.lastName ||
    !email ||
    !password
  ) {
    response.status(400);
    response.json({
      message: "A required field is empty.",
    });
  } else {
    if (emailValidator.validate(email) && schema.validate(password)) {
      try {
        const payload = request.body;
        const user = await userService.createUser(payload);
        setSuccessResponse(user, response);
      } catch (error) {
        if (error.message.includes("SequelizeUniqueConstraintError")) {
          response.status(400);
          response.json({
            message: "A user account with the email address already exists",
          });
        } else setErrorResponse(error, response);
      }
    } else {
      response.status(401);
      response.json({
        message: "Invalid Email or password.",
      });
    }
  }
};
