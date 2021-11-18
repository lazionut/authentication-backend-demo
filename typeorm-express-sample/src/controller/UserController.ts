import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export class UserController {

    private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) { 
        return this.userRepository.find();
    } 

    async one(request: Request, response: Response, next: NextFunction) { 
        if(this.userRepository.findOne(request.params.id) !== undefined)
            return this.userRepository.findOne(request.params.id);
        
        response.status(404);
        return "User doesn't exist!"
    } 

    async registerUser(request: Request, response: Response, next: NextFunction) {
        const body = request.body;
        const userEmail = body.email;
        const userName = body.username;
        const userPassword = body.password;

        let user = await this.userRepository.findOne({
            where: {
                email: userEmail,
                username: userName            
            }
        });

        if (user) {
            response.status(404);
            return "User already exist!";
        }

        this.userRepository.save(request.body);

        return "New user created!";
    }

    async loginUser(request: Request, response: Response, next: NextFunction) {
        const body = request.body;
        const userEmail = body.email;
        const userName = body.username;
        const userPassword = body.password;

        let userByEmail = await this.userRepository.findOne({
            where: {
                userMail: userEmail,
                password: userPassword
            }
        });

        let userByUsername = await this.userRepository.findOne({
            where: {
                username: userName,
                password: userPassword
            }
        });

        if (!this.userRepository.find(userByEmail) || !this.userRepository.find(userByUsername)) {
            response.status(404);
            return "User doesn't exist!";
        }
    }

    async removeUser(request: Request, response: Response, next: NextFunction) {
        const body = request.body;
        const userMail = body.email;
        const userName = body.username;
        const userPassword = body.password;

        let user = await this.userRepository.findOne({
            where: {
                userMail: userMail,
                username: userName,
                password: userPassword,
            }
        });

        if (!this.userRepository.find(user)) {
            response.status(404);
            return "User doesn't exist!";
        }

        this.userRepository.remove(user);
    }

    async updateUser(request: Request, response: Response, next: NextFunction) {
        const body = request.body;
        const userMail = body.email;
        const userName = body.username;
        const userPassword = body.password;

        let user = await this.userRepository.findOne({
            where: {
                userMail: userMail,
                username: userName,
                userPassword: userPassword
            }
        });

        if (!this.userRepository.find(user)) {
            response.status(404);
            return "User doesn't exist!";
        }

        this.userRepository.save(user);
    }
}