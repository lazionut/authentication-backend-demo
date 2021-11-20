import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {
  private userRepository = getRepository(User);

  async findAllUsers(request: Request, response: Response, next: NextFunction) {
    response.status(200);
    return this.userRepository.find();
  }

  async findUser(request: Request, response: Response, next: NextFunction) {
    if (this.userRepository.findOne(request.username) !== undefined) {
      response.status(200);
      return this.userRepository.findOne(request.username);
    }

    response.status(404);
    return "Error: User doesn't exist";
  }

  async findEmail(request: Request, response: Response, next: NextFunction) {
    if (this.userRepository.findOne(request.email) !== undefined) {
      response.status(200);
      return this.userRepository.findOne(request.email);
    }

    response.status(404);
    return "Error: User doesn't exist";
  }

  async registerUser(request: Request, response: Response, next: NextFunction) {
    const body = request.body;
    const userEmail = body.email;
    const userName = body.username;
    const userPassword = body.password;

    if (
      userEmail === undefined ||
      userName === undefined ||
      userPassword === undefined
    ) {
      response.status(404);
      return "Error: Email, username and password are required";
    }

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
      response.status(404);
      return "Error: User already exist";
    }

    this.userRepository.save(request.body);

    response.status(200);
    return "New user created";
  }

  async loginUser(request: Request, response: Response, next: NextFunction) {
    const body = request.body;
    const userEmail = body.email;
    const userName = body.username;
    const userPassword = body.password;

    let user = null;

    if (
      (userEmail === undefined && userName === undefined) ||
      userPassword === undefined
    ) {
      response.status(404);
      return "Error: Email/username and password are required";
    }

    if (userEmail) {
      user = await this.userRepository.findOne({
        where: {
          email: userEmail,
          password: userPassword,
        },
      });

      return this.userRepository.findOne(request.email);
    } else if (userName) {
      user = await this.userRepository.findOne({
        where: {
          username: userName,
          password: userPassword,
        },
      });

      return this.userRepository.findOne(request.username);
    }

    if (user === undefined) {
      response.status(404);
      return "Error: User not found";
    }
  }

  async updateUser(request: Request, response: Response, next: NextFunction) {
    const body = request.body;
    const userEmail = body.email;
    const userName = body.username;
    const userPassword = body.password;

    if (
      userEmail === undefined &&
      userName === undefined &&
      userPassword === undefined
    ) {
      response.status(404);
      return "Error: Email, username or password are required";
    }

    let user = await this.userRepository.findOne(request.params.id);

    if (user === undefined) {
      response.status(404);
      return "Error: User not found";
    }

    /*let userByEmail = await this.userRepository.findOne({
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
      response.status(404);
      return "Error: User already exist";
    }*/

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

    response.status(200);
    return "User updated";
  }

  async removeUser(request: Request, response: Response, next: NextFunction) {
    const body = request.body;
    const userEmail = body.email;
    const userName = body.username;
    const userPassword = body.password;

    let user = await this.userRepository.findOne({
      where: {
        email: userEmail,
        username: userName,
        password: userPassword,
      },
    });

    if (user === undefined) {
      response.status(404);
      return "Error: User not found";
    }

    this.userRepository.remove(user);
    response.status(200);
  }
}
