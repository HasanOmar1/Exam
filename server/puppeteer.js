import puppeteer from "puppeteer";

const url = "https://crossfire.z8games.com/";
const main = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector(`meta[name="title"]`);

  const data = await page.evaluate(() => {
    const title = document
      .querySelector(`meta[name="title"]`)
      .getAttribute("content");

    const description = document
      .querySelector(`meta[name="description"]`)
      .getAttribute("content");

    const img = document.querySelector(`main img`).src;

    return { title, description, img };
  }, url);

  console.log(data);

  await browser.close();
};

main();
