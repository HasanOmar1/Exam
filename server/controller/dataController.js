import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import STATUS_CODE from "../constants/statusCodes.js";
import { isURL } from "../utils/isURL.js";

// to avoid bot detection
puppeteer.use(StealthPlugin());

export const fetchData = async (req, res, next) => {
  const { urls } = req.query;
  const arrOfUrls = Array.isArray(urls) ? urls : [urls];

  const data = [];
  try {
    if (arrOfUrls.length < 3) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("You must provide at least three URLs");
    }
    console.log(
      `Started Scrapping data from these websites: ${arrOfUrls.join(" - ")}`
    );
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 120000,
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

    // to mimic real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    );

    // to block images/stylesheets/fonts/videos
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["stylesheet", "font", "video"].includes(resourceType)) {
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
          timeout: 120000,
          waitUntil: "domcontentloaded",
        });

        await page.waitForSelector(
          `title , meta[name="description"], meta[name="title"] , meta[property="og:title"] , meta[property="og:image"]`
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

          const description =
            document
              .querySelector(`meta[name="description"]`)
              ?.getAttribute("content") || "No description";

          const img =
            document
              .querySelector(`meta[property="og:image"]`)
              ?.getAttribute("content") ??
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
        console.error(`Error retrieving data from ${site}: ${error.message}`);

        data.push({
          url: site,
          title: "This site is not available",
          description: "This site is not available",
          img: "This site is not available",
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
