import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import * as Fs from "fs";
import * as Path from "path";

export class Scraping
{
    private static _default: Scraping = null;

    public static get default(): Scraping
    {
        if (!Scraping._default)
            Scraping._default = new Scraping();
        
        return Scraping._default;
    }

    public async excute(url: string): Promise<void>
    {
        console.log("웹 스크래핑이 시작되었습니다. 잠시만 기다려주세요.");
        
        let html = await this.getHtml(url);
        
        if (html.status !== 200)
            throw new Error(`Failed to get html file. url: ${url}`);

        // CHEERIO LOAD HTML & SCRAPING
        let result = this.scraping(html.data);

        // SAVE FILES
        this.save(result);

        console.log("웹 스크래핑이 완료되었습니다.");
    }

    private loadCheerio(data: string): CheerioStatic
    {
        return cheerio.load(data);
    }

    private scraping(data: string): IScrapingResult
    {
        // LOAD CHEERIO
        let $ = this.loadCheerio(data);

        // WEB SCRAPING
        let title: string = $("div.htitle span.itemSubjectBoldfont").text();
        let photos: string[] = [];

        $("p img._photoImage").each((index: number, element: CheerioElement) => {

            if (element.attribs && element.attribs.src)
            {
                let src: string = element.attribs.src;
                photos[index] = src.substring(0, src.lastIndexOf("?"));
            }
        });

        return {
            title,
            photos
        }
    }

    private save(result: IScrapingResult): void
    {
        if (!Fs.existsSync(`photos/`))
            Fs.mkdirSync(`photos`);

        if (!Fs.existsSync(`photos/${result.title}`))
            Fs.mkdirSync(`photos/${result.title}`);

        for (let i = 0; i < result.photos.length; i++)
            this.download(i, result.photos[i], result.title);        
    }

    private async getHtml(url: string): Promise<AxiosResponse<any>>
    {
        console.log("요청한 페이지 검색중..");
        return await axios.get(url);
    }
    
    private async download(i: number, url: string, title: string)
    {
        console.log(`${i}번째 이미지 다운로드 중..`);
        const path = Path.resolve(`${__dirname}/../photos/${title}`, `${i}.jpg`)
        const writer = Fs.createWriteStream(path)
    
        const response = await axios({
            url,
            method: "GET",
            responseType: "stream"
        });
    
        response.data.pipe(writer);
    
        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    }
}

interface IScrapingResult
{
    title: string;
    photos: string[];   
}