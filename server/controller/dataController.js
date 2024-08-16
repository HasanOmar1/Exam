import puppeteer from "puppeteer";
import STATUS_CODE from "../constants/statusCodes.js";
import { isURL } from "../utils/isURL.js";

export const fetchData = async (req, res, next) => {
  const { urls } = req.query;
  const urlsArray = Array.isArray(urls) ? urls : [urls];

  if (!urlsArray.length) {
    res.status(STATUS_CODE.NOT_FOUND);
    throw new Error({ error: "Please provide a URL" });
  }

  const data = [];
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1280, height: 800 },
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    for (const site of urlsArray) {
      if (!isURL(site)) {
        data.push({
          url: site,
          title: "Error",
          description: "Error retrieving data",
          img: "Error retrieving data",
        });
        continue;
      }

      try {
        await page.goto(site, {
          timeout: 20000,
          waitUntil: "networkidle2",
        });

        await page.waitForSelector(
          `title , meta[name="title"] , meta[property="og:title"] , img`,
          { timeout: 20000 }
        );

        const dataInfo = await page.evaluate((pageUrl) => {
          //
          const titleElement = document.querySelector("title")?.innerText;
          const metaTitleElement = document.querySelector('meta[name="title"]');
          const ogMetaTitleElement = document.querySelector(
            'meta[property="og:title"]'
          );

          const title = metaTitleElement
            ? metaTitleElement.getAttribute("content")
            : ogMetaTitleElement
            ? ogMetaTitleElement.getAttribute("content")
            : titleElement;

          const description =
            document
              .querySelector(`meta[name="description"]`)
              ?.getAttribute("content") || "No description";

          const img =
            document.querySelector(`main img`)?.src ??
            document.querySelector(`section img`)?.src ??
            document.querySelector(`div img`)?.src ??
            document.querySelector(`a img`)?.src ??
            document.querySelector(`img`)?.src ??
            "No img found";

          return { url: pageUrl, title, description, img };
        }, site);

        data.push(dataInfo);
      } catch (error) {
        console.error(`Error retrieving data from ${site}`);
        console.error("Stack trace:", error.stack);

        data.push({
          url: site,
          title: "Error",
          description: "Error retrieving data",
          img: "Error retrieving data",
        });
      }
    }

    console.log({ data });

    await browser.close();
    res.json(data);
  } catch (error) {
    next(error);
  }
};
