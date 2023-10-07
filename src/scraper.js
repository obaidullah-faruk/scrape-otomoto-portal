const cheerio = require("cheerio");

/**
 * Parses HTML content and extracts total pagination page
 * @param {String} htmlContent - The HTML Document to parse
 * @returns {Number} totalPage - Total page number from pagination
 */
const getTotalPage = async (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  const paginationList = $('li[data-testid="pagination-list-item"]');
  let totalPage = 0;
  paginationList.each((index, paginationListItem) => {
    totalPage = $(paginationListItem).find("span").text();
  });
  return totalPage;
};

/**
 * Parses HTML content and fetches item url + item id
 * @param {string} htmlContent - The HTML content to parse.
 * @returns {Array<Object>} - An array of items, each containing a URL and an ID.
 */
const addItems = async (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  let items = [];
  const mainElement = $("article.ooa-1t80gpj");
  mainElement.each((index, element) => {
    const id = $(element).attr("data-id");
    const url = $(element)
      .find("article > section > div > h1 > a")
      .attr("href");
    items.push({
      url,
      id,
    });
  });
  return items;
};

/**
 * Parses HTML content and extracts the total number of ads.
 * @param {String} htmlContent - The HTML content to parse.
 * @returns {Number} numberOfAds - Total number of ads
 */
const getTotalAdsCount = async (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  const numberOfAdsElement = $("p.ev5apm50");
  const numberOfAdsText = numberOfAdsElement.find('b').first().text().trim();
  const numberOfAds = parseInt(numberOfAdsText, 10);
  return numberOfAds;
};


/**
 * Scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power
 *
 * @param {string} truck - The HTML content containing truck details.
 * @returns {object} - An object containing parsed truck information: adId, title, price, registrationDate, productionDate, mileage, and power.
 */
const scrapeTruckItem = async (truck) => {
  const $ = cheerio.load(truck);
  // item id, title, price, registration date, production date, mileage, power
  const adId = $(".offer-meta__item > #ad_id").first().text();
  const title = $(".offer-title").first().text().trim();
  const price =
    $(".offer-price").attr("data-price") +
    " " +
    $(".offer-price__currency").first().text();

  let registrationDate, productionDate, mileage, power;
  $("ul > .offer-params__item").each((index, listItemElement) => {
    const label = $(listItemElement).find(".offer-params__label").text();
    const value = $(listItemElement)
      .find(".offer-params__value")
      .text()
      .trim();
    if (label == "Data pierwszej rejestracji w historii pojazdu") {
      registrationDate = value
    } else if (label == "Rok produkcji") {
      productionDate = value
    } else if (label == "Przebieg") {
      mileage = value
    } else if (label == "Moc") {
      power = value
    }
  });
  return {
    adId,
    title,
    price,
    registrationDate,
    productionDate,
    mileage,
    power,
  };
};

module.exports = { scrapeTruckItem, getTotalAdsCount, getTotalPage, addItems };
