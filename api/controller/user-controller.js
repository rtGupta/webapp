import emailValidator from "email-validator";
import passwordValidator from "password-validator";
import bcrypt from "bcrypt";

import * as userService from "../service/user-service.js";
import { client } from "../../util/statsd_client.js";
import logger from "../../util/logger.js";

// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();

const setErrorResponse = (error, request, response) => {
  response.status(500);
  response.json(error);
  logger.error(
    `${error.status || 500} - ${response.statusMessage} - ${error.message} - ${
      request.originalUrl
    } - ${request.method} - ${request.ip}`
  )
};

const setSuccessResponse = (obj, response) => {
  response.status(201);
  response.json(obj);
};

const sendErrorResponse = (obj, response) => {
  response.status(obj.errorCode);
  response.json({
    message: obj.message
  });
  logger.error(`${obj.errorCode} - ${response.statusMessage} - ${obj.message}`);
};

export const getAuthorizedUser = async (request, response) => {
  try {
    // check for basic auth header
    if (
      !request.headers.authorization ||
      request.headers.authorization.indexOf("Basic ") === -1
    ) {
      return {
        message: "Missing Request Header: Authorization",
      };
    }

    // verify auth credentials
    const base64Credentials = request.headers.authorization.split(" ")[1];
    console.log(base64Credentials);
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [email, password] = credentials.split(":");

    const authUser = await userService.getUserByUsername(email);
    if (!authUser) {
      return {
        message: "Oops! Unauthorized Access",
      };
    }
    const compareRes = await bcrypt.compare(password, authUser.password);
    if (!compareRes) {
      return {
        message: "Oops! Unauthorized Access",
      };
    } else {
      return authUser;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const post = async (request, response) => {
  client.increment("endpoint.createUser.http.post");
  const email = request.body.username;
  const password = request.body.password;

  if (
    !request.body.first_name ||
    !request.body.last_name ||
    !email ||
    !password
  ) {
    const err = {
      errorCode: 400,
      message: "A required field is empty"
    };
    // response.status(400);
    // response.json({
      // message: "A required field is empty.",
    // });
    sendErrorResponse(err, response);
  } else if (
    "account_created" in request.body ||
    "id" in request.body ||
    "account_updated" in request.body
  ) {
    const err = {
      errorCode: 400,
      message: "Bad Request"
    }
    sendErrorResponse(err, response);
    // response.status(400).json({
    //   message: "Bad Request",
    // });
  } else {
    if (emailValidator.validate(email) && schema.validate(password)) {
      try {
        const payload = {
          first_name: request.body.first_name,
          last_name: request.body.last_name,
          username: request.body.username,
          password: request.body.password,
        };
        const user = await userService.createUser(payload);
        setSuccessResponse(user, response);
        logger.info(`User Created Successfully! ${user.username}`);
      } catch (error) {
        if (error.message.includes("SequelizeUniqueConstraintError")) {
          const err = {
            errorCode: 400,
            message: "A user account with the email address already exists"
          };
          sendErrorResponse(err, response);
          // response.status(400);
          // response.json({
          //   message: "A user account with the email address already exists",
          // });
        } else setErrorResponse(error, request, response);
      }
    } else {
      const err = {
        errorCode: 400,
        message: "Invalid Email or password."
      };
      sendErrorResponse(err, response);
      // response.status(400);
      // response.json({
      //   message: "Invalid Email or password.",
      // });
    }
  }
};

export const get = async (request, response) => {
  client.increment("endpoint.fetchUser.http.get");
  try {
    const id = request.params.id;

    const result = await getAuthorizedUser(request, response);
    if (result.message) {
      const err = {
        errorCode: 401,
        message: result.message
      };
      sendErrorResponse(err, response);
      // response.status(401).json({
      //   message: result.message,
      // });
    } else {
      if (result.id != id) {
        const err = {
          errorCode: 403,
          message: "Forbidden"
        };
        sendErrorResponse(err, response);
        // response.status(403).json({
        //   message: "Forbidden",
        // });
      } else {
        const user = await userService.getUser(id);
        if (!user) {
          const err = {
            errorCode: 401,
            message: "Oops! Unauthorized Access"
          };
          sendErrorResponse(err, response);
          // response.status(401).json({
          //   message: "Oops! Unauthorized Access",
          // });
          return;
        }
        const resData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          account_created: user.account_created,
          account_updated: user.account_updated,
        };

        response.status(200).json(resData);
        logger.info(`User ${resData.id} was retrieved successfully!`);
      }
    }
  } catch (error) {
    setErrorResponse(error, request, response);
  }
};

export const update = async (request, response) => {
  client.increment("endpoint.updateUser.http.put");
  try {
    const id = request.params.id;
    
    if (JSON.stringify(request.body) == '{}') {
      const err = {
        errorCode: 400,
        message: "None of the fields have been updated."
      };
      sendErrorResponse(err, response);
      // response.status(400).send({
      //   message: "None of the fields have been updated."
      // });
      return;
    }

    const result = await getAuthorizedUser(request, response);
    if (result.message) {
      const err = {
        errorCode: 401,
        message: result.message
      };
      sendErrorResponse(err, response);
      // response.status(401).json({
      //   message: result.message,
      // });
    } else {
      if (result.id != id) {
        const err = {
          errorCode: 403,
          message: "Forbidden"
        };
        sendErrorResponse(err, response);
        // response.status(403).json({
        //   message: "Forbidden",
        // });
      } else {
        if (
          "account_updated" in request.body ||
          "username" in request.body ||
          "id" in request.body ||
          "account_created" in request.body
        ) {
          const err = {
            errorCode: 400,
            message: "Bad Request"
          }
          sendErrorResponse(err, response);
          // response.status(400).json({
          //   message: "Bad Request",
          // });
          return;
        }
        const updated = {
          ...request.body,
          account_created: result.account_created,
          account_updated: result.account_updated,
        };
        updated.id = id;
        if (updated.password) {
          if (schema.validate(updated.password)) {
            const newEncryptedPwd = await bcrypt.hash(updated.password, 10);
            updated.password = newEncryptedPwd;
          } else {
            const err = {
              errorCode: 401,
              message: "Invalid Password!"
            }
            sendErrorResponse(err, response);
            // response.status(401).send({
            //   message: "Invalid Password!",
            // });
            return;
          }
        }
        const data = await userService.updateUser(updated);
        const updatedUserObj = {
          id: data[1].id,
          first_name: data[1].first_name,
          last_name: data[1].last_name,
          username: data[1].username,
          account_created: data[1].account_created,
          account_updated: data[1].account_updated,
        };

        response.status(204).json(updatedUserObj);
        logger.info(`User ${updatedUserObj.username} was updated successfully!`);
        return;
      }
    }
  } catch (error) {
    console.log(error);
    setErrorResponse(error, request, response);
  }
};
