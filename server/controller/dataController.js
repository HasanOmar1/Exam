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
    page.setDefaultNavigationTimeout(120000);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.setRequestInterception(true);

    // Intercept requests to ignore loading videos
    page.on("request", (request) => {
      if (request.resourceType() === "video") {
        request.abort();
      } else {
        request.continue();
      }
    });
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
          timeout: 60000,
          waitUntil: "networkidle2",
        });

        await page.waitForTimeout(3000);

        await page.waitForSelector(
          `title , meta[name="title"] , meta[property="og:title"] , img`,
          { timeout: 60000 }
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
