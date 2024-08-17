import puppeteer from "puppeteer";
import STATUS_CODE from "../constants/statusCodes.js";
import { isURL } from "../utils/isURL.js";

export const fetchData = async (req, res, next) => {
  const { urls } = req.query;
  const arrOfUrls = Array.isArray(urls) ? urls : [urls];

  const data = [];
  try {
    if (!arrOfUrls.length || arrOfUrls.length < 3) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("You must provide atleast three URLs");
    }
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 30000,
      defaultViewport: null,
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--no-zygote",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--disable-gpu",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    // Intercept requests to ignore loading videos
    page.on("request", (request) => {
      if (request.resourceType() === "video") {
        request.abort();
      } else {
        request.continue();
      }
    });

    for (const site of arrOfUrls) {
      if (!isURL(site)) {
        data.push({
          url: site,
          title: "This site is not available",
          description: "This site is not available",
          img: "This site is not available",
        });
        continue;
      }

      try {
        await page.goto(site, {
          timeout: 30000,
          waitUntil: "networkidle2",
        });

        await page.waitForSelector(
          `title , meta[name="description"], meta[name="title"] , meta[property="og:title"] , img`
        );

        await page.$eval("title", (el) => el.scrollIntoView());

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

        data.push({
          url: site,
          title: "This site is not available",
          description: "This site is not available",
          img: "This site is not available",
        });
      }
    }

    // console.log({ data });

    await browser.close();
    res.json(data);
  } catch (error) {
    next(error);
  }
};
