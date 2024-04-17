import { readdirSync } from "fs";
import express from "express";
import { setupRoutes } from "./router";
import path from "path";
import cors from "cors";

const folders = readdirSync(path.join(__dirname, "api"));
for (let i = 0; i < folders.length; i++) {
    const files = readdirSync(path.join(__dirname, "api", folders[i]));
    for (let j = 0; j < files.length; j++) {
        require(`./api/${folders[i]}/${files[j]}`);
    }
}

async function main() {
    const httpPort = parseInt(process.env.PORT) || 5000;
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: "https://bsaber.com",
    }));

    app.disable("x-powered-by");

    setupRoutes(app);

    app.use(express.static("public"));

    app.listen(httpPort, () => {
        console.log(
            `App is listening to port ${httpPort} | https://localhost:${httpPort}!`
        );
    });
}

main();
