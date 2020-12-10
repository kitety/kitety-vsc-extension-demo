import * as https from "https";
import * as cheerio from "cheerio";

const request = async (url: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    https.get(url, (res) => {
      let chunks = "";
      if (!res || res.statusCode !== 200) {
        return reject(new Error("网络请求错误"));
      }
      res.on("data", (chunk) => {
        chunks += chunk.toString("utf8");
      });
      res.on("end", () => {
        resolve(chunks);
      });
    });
  });
};

// 我们从笔趣阁小说站抓页面
const DOMAIN = "https://www.biquge.com.cn";

// 搜索关键词相对应的小说
export const search = async (keyword: string) => {
  const result = [] as any;
  try {
    const res = await request(DOMAIN + "/search.php?q=" + encodeURI(keyword));
    console.log(res);

    const $ = cheerio.load(res);
    $(".result-list .result-item.result-game-item").each(function (
      i: number,
      elem: any
    ) {
      const title = $(elem).find("a.result-game-item-title-link span").text();
      const author = $(elem)
        .find(
          ".result-game-item-info .result-game-item-info-tag:nth-child(1) span:nth-child(2)"
        )
        .text();
      const path = $(elem).find("a.result-game-item-pic-link").attr().href;
      console.log(title, author, path);

      result.push({
        type: ".biquge",
        name: `${title} - ${author}`,
        isDirectory: true,
        path,
      });
    });
  } catch (error) {
    console.warn(error);
  }
  return result;
};

// 搜索该小说对应的章节
export const getChapter = async (pathStr: string) => {
  const result = [] as any;
  try {
    const res = await request(DOMAIN + pathStr);
    const $ = cheerio.load(res);
    $("#list dd").each(function (i: number, elem: any) {
      const name = $(elem).find("a").text();
      const path = $(elem).find("a").attr().href;
      result.push({
        type: ".biquge",
        name,
        isDirectory: false,
        path,
      });
    });
  } catch (error) {
    console.warn(error);
  }
  return result;
};
// 获取章节对应的内容并html化
export const getContent = async (pathStr: string) => {
  let result = "";
  try {
    const res = await request(DOMAIN + pathStr);
    const $ = cheerio.load(res);
    const html = $("#content").html();
    result = html ? html : "";
  } catch (error) {
    console.warn(error);
  }
  return result;
};
