import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import * as Fs from "fs";
import * as Path from "path";

async function main(): Promise<void>
{
    console.log("웹 스크래핑이 시작되었습니다. 잠시만 기다려주세요.");
    
    try
    {
        let url: string = process.argv[2];
        let html = await getHtml(url);
        
        if (html.status !== 200)
            throw new Error(`Failed to get html file. url: ${url}`);
            
        // CHEERIO LOAD HTML
        let $ = cheerio.load(html.data);

        let title: string = $("div.htitle span.itemSubjectBoldfont").text();
        let photoList: string[] = [];
        $("p img._photoImage").each((index: number, element: CheerioElement) => {

            if (element.attribs && element.attribs.src)
            {
                let src: string = element.attribs.src;
                photoList[index] = src.substring(0, src.lastIndexOf("?"));
            }
        });

        // SAVE FILES
        if (!Fs.existsSync(`photos/`))
            Fs.mkdirSync(`photos`);

        if (!Fs.existsSync(`photos/${title}`))
            Fs.mkdirSync(`photos/${title}`);

        for (let i = 0; i < photoList.length; i++)
            download(i, photoList[i], title);

        console.log("웹 스크래핑이 완료되었습니다.");
    }
    catch (err)
    {
        console.log(err);
    }
}
// START WEB SCAPING
main();

async function getHtml(url: string): Promise<AxiosResponse<any>>
{
    console.log("요청한 페이지 검색중..");
    return await axios.get(url);
}

async function download(i: number, url: string, title: string)
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