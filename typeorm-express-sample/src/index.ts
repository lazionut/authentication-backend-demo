import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entity/User";
import cors = require("cors");

createConnection().then(async connection => {

    // create express app
    const app = express();

    const allowedOrigins = ['http://localhost:3001'];

    const options: cors.CorsOptions = {
    origin: allowedOrigins
    };

    app.set('env', process.env.APP_ENV);
    app.use(bodyParser.json());
    app.use(cors(options));

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });
    

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000. Open http://localhost:3000/api/users to see results");

}).catch(error => console.log(error));
