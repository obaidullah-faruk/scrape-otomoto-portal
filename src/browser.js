const puppeteer = require("puppeteer");

/**
 * Starts a Puppeteer browser instance.
 * @returns {Promise} - A Promise that resolves to the Puppeteer browser instance.
 * @throws {Error} If the browser cannot be launched.
*/
const startBrowser = async () => {
  let browser;

  browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    headless: "new", // false will open the browser.
    timeout: 60000, // To resolve timeout error
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  });
  return browser;
};

module.exports = startBrowser;
