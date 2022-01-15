import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";

import { MnistData } from "./../tfjs-digit/data";
import { getModel, train, doPrediction } from "./../tfjs-digit/script";
import { toArrayBuffer } from "./../tfjs-digit/arrayBufferConverter";

let CryptoJS = require("crypto-js");

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

export class UserController {
  private userRepository = getRepository(User);

  async findAllUsers(request: Request, response: Response, next: NextFunction) {
    response.status(200);
    return this.userRepository.find();
  }

  async findUser(request: Request, response: Response, next: NextFunction) {
    const user = this.userRepository.findOne(request.params.id);
    if (user) {
      response.status(200);
      return user;
    }

    response.status(500);
    return next("User not found");
  }

  async registerUser(request: Request, response: Response, next: NextFunction) {
    const userEmail: string = request.body.email;
    const userName: string = request.body.username;
    const userPassword: string = request.body.password;

    if (
      userEmail === undefined ||
      userName === undefined ||
      userPassword === undefined
    ) {
      response.status(500);
      return next("Email, username and password are required");
    }

    request.body.password = CryptoJS.SHA256(userPassword).toString(
      CryptoJS.enc.Base64
    );

    let userByEmail = await this.userRepository.findOne({
      where: {
        email: userEmail,
      },
    });

    let userByUsername = await this.userRepository.findOne({
      where: {
        username: userName,
      },
    });

    if (userByEmail || userByUsername) {
      response.status(500);
      return next("User already exists");
    }

    this.userRepository.save(request.body);

    response.status(200).send("New user created");
  }

  async loginUser(request: Request, response: Response, next: NextFunction) {
    const userEmail: string = request.body.email;
    const userName: string = request.body.username;
    const userPassword: string = request.body.password;
    const encryptedPassword: string = CryptoJS.SHA256(userPassword).toString(
      CryptoJS.enc.Base64
    );

    let user = null;

    if (userEmail) {
      user = await this.userRepository.findOne({
        where: {
          email: userEmail,
          password: encryptedPassword,
        },
      });

      if (user) {
        const token = jwt.sign({ userEmail, userPassword }, jwtSecret, {
          expiresIn: "10h",
        });
        response.status(200).send({ token: token });
      }

      response.status(500);
      return next("User not found");
    }

    if (userName) {
      user = await this.userRepository.findOne({
        where: {
          username: userName,
          password: encryptedPassword,
        },
      });

      if (user) {
        const token = jwt.sign({ userName, userPassword }, jwtSecret, {
          expiresIn: "10h",
        });
        response.status(200).send({ token: token });
      }

      response.status(500);
      return next("User not found");
    }
  }

  async updateUser(request: Request, response: Response, next: NextFunction) {
    const userEmail: string = request.body.email;
    const userName: string = request.body.username;
    const userPassword: string = request.body.password;

    if (
      userEmail === undefined &&
      userName === undefined &&
      userPassword === undefined
    ) {
      response.status(500);
      return next("Email, username or password are required");
    }

    let user = await this.userRepository.findOne(request.params.id);

    if (user === undefined) {
      response.status(500);
      return next("User not found");
    }

    if (userEmail) {
      user.email = userEmail;
    }
    if (userName) {
      user.username = userName;
    }
    if (userPassword) {
      user.password = userPassword;
    }

    this.userRepository.save(user);

    response.status(200).send("User updated");
  }

  async removeUser(request: Request, response: Response, next: NextFunction) {
    const userEmail: string = request.body.email;
    const userName: string = request.body.username;
    const userPassword: string = request.body.password;

    let user = await this.userRepository.findOne({
      where: {
        email: userEmail,
        username: userName,
        password: userPassword,
      },
    });

    if (user === undefined) {
      response.status(500);
      return next("User not found");
    }

    this.userRepository.remove(user);
    response.status(200).send("User removed");
  }

  async trainImage(request: Request, response: Response, next: NextFunction) {
    const data = new MnistData();
    await data.load();
    const model = getModel();
    const trainedModel = await train(model, data);
    await trainedModel.save("file://./src/tfjs-digit/model");

    response.status(200).send(trainedModel);
  }

  async evaluateImage(request, response: Response, next: NextFunction) {
    const arrayBuffer = toArrayBuffer(request.files.image.data);
    const predictions = await doPrediction(arrayBuffer);

    response.status(200).send(predictions);
  }
}
