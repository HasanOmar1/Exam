import puppeteer from "puppeteer";
import STATUS_CODE from "../constants/statusCodes.js";

const url1 = "https://crossfire.z8games.com/";
const url2 = "https://combatarms-c.valofe.com/";

// const urls = [url1, url2];

export const fetchData = async (req, res, next) => {
  const { urls } = req.query;
  const urlsArray = Array.isArray(urls) ? urls : [urls];

  if (!urlsArray.length) {
    res.status(STATUS_CODE.NOT_FOUND);
    throw new Error("Please provide an url");
  }

  const data = [];
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (let sites of urls) {
      await page.goto(sites);

      await page.waitForSelector(
        `meta[name="title"] , meta[property="og:title"]`
      );

      const dataInfo = await page.evaluate((pageUrl) => {
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

        const description = document
          .querySelector(`meta[name="description"]`)
          ?.getAttribute("content");

        const img = document.querySelector(`img`).src;

        return { url: pageUrl, title, description, img };
      }, sites);

      data.push(dataInfo);
    }
    console.log({ data });
    await browser.close();
    res.send(data);
  } catch (error) {
    next();
  }
};
