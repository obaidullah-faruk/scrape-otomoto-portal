# Scrape Otomoto Portal

### This is a web scraping app built with Node.js and Puppeteer to extract data from the Otomoto portal.

## Initital URL : [Otomoto portal](https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc)

## Features

- Iterate over pages
- Fetches item urls + item ids (unique ids that the portal uses) from list page
- Shows how many total ads exist for the provided initial url
- Scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power
- Scrapes all pages, all ads
- Stores data in an excel file

## Tech

- [Puppeteer] - For fetching ads
- [Cheerio] - For parsing HTML
- [ExcelJS] - To store data in .xlsx file
- [node.js] - Runtime environment

## Installation

Clone the repository

```sh
git clone https://github.com/obaidullah-faruk/scrape-otomoto-portal.git
cd scrape-otomoto-portal
```

Run using Docker

```sh
docker-compose up --build
```

After the completing the executation, scraped data will found on `scrape-otomoto-portal/data/` directory.

## Questions/thoughts

**Ideas for error catching/solving, retry strategies?**

- For error handling and solving, a High-Order Function (RetryOperation) is used with a maximum of 10 retries for an operation, with a 3-second delay for each retry. This allows the system some time to recover from errors.

**Accessing more ads from this link than the limit allows (max 50 pages)?**

- During scraping, there were no observed issues with accessing more pages than the limit. However, to access more than the limit, we would need to implement rotation proxy techniques.

**Experience with CI/CD tools?**

- GitLab CI/CD pipeline
- Terraform
- Ansible

**Other considerations?**

- To improve scraping speed, unnecessary image requests are ignored since images are not required for this application.
- Vulnerabilities in npm packages were checked using `npm audit`, and no vulnerabilities were found.
- Regular maintenance is necessary to adapt to any structural changes on the website.
- Prices on the website come in two currencies (PLN, EUR), but they are not converted into a single currency due free APIs might not work smoothly always and that may break the app.
- The `robots.txt` file was checked to ensure there are no legal issues with the target URL.

## License

ISC

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job."
[node.js]: http://nodejs.org
[Puppeteer]: https://pptr.dev/
[Cheerio]: https://cheerio.js.org/
[ExcelJS]: https://github.com/exceljs/exceljs#readme
