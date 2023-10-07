const startBrowser = require("./browser");
const scraper = require("./scraper");
const utils = require("./utils");
const writeToExcel = require("./excelWriter");
const { INITIAL_URL } = require("./constants/urls");
const retryOperation = require("./retry");

/**
 * Sets up the page for web scraping. Stops images and css from loading
 * @param {Object} page - The Puppeteer page object.
 */
const setupPage = async (page) => {
  await page.setRequestInterception(true);
  page.on("request", (interceptedRequest) => {
    if (
      interceptedRequest.url().endsWith(".png") ||
      interceptedRequest.url().endsWith(".jpg") ||
      interceptedRequest.resourceType() === "image" ||
      interceptedRequest.resourceType() === "stylesheet"
    )
      interceptedRequest.abort();
    else interceptedRequest.continue();
  });

  await retryOperation(() => page.goto(INITIAL_URL, { waitUntil: "domcontentloaded" }));
  // Accept cookie if exists
  await retryOperation(() => utils.acceptCookiesButton(page));
};

/**
 * Gets all items from the web page.
 * @param {Object} page - The Puppeteer page object.
 * @param {number} totalPage - The total number of pages to scrape.
 * @returns {Array} - An array of scraped items.
 */
const getAllItems = async (page, totalPage) => {
  let nextPageUrl = INITIAL_URL;
  let allItems = [];
  let pageNumber = 1;
  while (pageNumber <= totalPage) {
    await retryOperation(() => page.goto(nextPageUrl, { waitUntil: "domcontentloaded" }));

    // get urls and ids of the current page
    const content = await page.evaluate(() => document.body.innerHTML);
    const items = await scraper.addItems(content);
    allItems = [...allItems, ...items];
    pageNumber++;
    nextPageUrl = await utils.getNextPageUrl(pageNumber);
  }
  return allItems;
};

/**
 * Gets all truck details from the web page.
 * @param {Object} page - The Puppeteer page object.
 * @param {Array} allItems - An array of scraped items.
 * @returns {Array} - An array of scraped truck details.
 */
const getAllTrucks = async (page, allItems) => {
  let allTrucks = [];
  for (const truck of allItems) {
    await retryOperation(() => page.goto(truck.url, { waitUntil: "domcontentloaded" }));
    const content = await page.evaluate(() => document.body.innerHTML);
    const truckContent = await scraper.scrapeTruckItem(content);
    allTrucks.push(truckContent);
  }
  return allTrucks;
};

/**
 * The main function for scraping the Otomoto portal.
 */
const main = async () => {
  console.time("Execution Time");

  // Start the browser & open a page
  const browser = await retryOperation(startBrowser);
  const page = await retryOperation(() => browser.newPage());

  await setupPage(page);

  const content = await page.evaluate(() => document.body.innerHTML);
  const numberOfAds = await scraper.getTotalAdsCount(content);
  console.log(`Number of ads: ${numberOfAds}`);

  // get total page number
  const totalPage = await scraper.getTotalPage(content);
  console.log("totalPage: ", totalPage);

  const allItems = await getAllItems(page, totalPage);
  const allTrucks = await getAllTrucks(page, allItems);

  // Closing browser object
  await browser.close();

  // Save into file
  await writeToExcel(allTrucks);
  console.timeEnd("Execution Time");
};

main();
