import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { api } from "./routes";

export class Server
{
    public app: express.Express = null;

    public constructor()
    {
        this.app = express();
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());

        this.app.use(cors());
        this.app.use(express.static('public'));
        this.app.use(compression());
        this.app.use(helmet());
     
        // 라우팅
        this.app.use('/api', api);
    }
    public async listen(): Promise<void>
    {
        this.app.listen(3000, () =>
        {
            console.log(`server listening on port ${3000}`);
        });
    }
}