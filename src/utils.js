const { INITIAL_URL } = require("./constants/urls")

/**
 * @param {Number} pageNumber - Page number of pagination URL
 * @returns {String} - Next url
 */
const getNextPageUrl = async (pageNumber) => {
    return INITIAL_URL + `&page=${pageNumber}`
}


/**
 * Clicks the "Accept Cookies" button on a web page.
 *
 * @param {Object} page - The Puppeteer page object.
 * @throws {Error} If the cookies cannot be accepted 
 * @returns {void}
 */
const acceptCookiesButton = async (page) => {
    await page.waitForSelector("#onetrust-accept-btn-handler");
    const acceptButton = await page.$("#onetrust-accept-btn-handler");
    if (acceptButton) {
        await acceptButton.click();
    }
}

module.exports = { getNextPageUrl, acceptCookiesButton }