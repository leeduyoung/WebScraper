import { Server } from "./server";

async function main(): Promise<void>
{   
    try
    {
        let server = new Server();
        server.listen();

        // let url: string = process.argv[2];

        // // EXCUTE WEB SCRAPING
        // Scraping.default.excute(url);
    }
    catch (err)
    {
        console.log(err);
    }
}

// START WEB SCAPING
main();