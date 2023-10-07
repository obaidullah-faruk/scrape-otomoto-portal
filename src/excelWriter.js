const ExcelJS = require("exceljs");

/**
 * Writes data to an Excel file in XLSX format.
 *
 * @param {Array} data - An array of objects containing data to be written to the Excel file.
 * @returns {Promise<void>} - A Promise that resolves once the data is successfully written to the file.
 * @throws {Error} If there is an error while writing the Excel file.
 */
const writeToExcel = async (data) => {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    const dataDir = "./data/";

    // Define headers for the Excel file
    const headers = [
        { header: "Ad ID", key: "adId", width: 15 },
        { header: "Title", key: "title", width: 50 },
        { header: "Price", key: "price", width: 15 },
        { header: "Registration Date", key: "registrationDate", width: 20 },
        { header: "Production Date", key: "productionDate", width: 20 },
        { header: "Mileage", key: "mileage", width: 15 },
        { header: "Power (KM)", key: "power", width: 15 },
    ];

    // Set the headers in the worksheet
    worksheet.columns = headers;

    // Add data to the worksheet
    data.forEach((item) => {
        worksheet.addRow(item);
    });

    // Generate a timestamp for the file name
    const now = new Date();
    const timestamp = now.toISOString().replace(/[^0-9]/g, "");

    // Define the Excel file name in directory
    const excelFileName = `${dataDir}data_${timestamp}.xlsx`;

    // Save the workbook as an Excel file
    try {
        await workbook.xlsx.writeFile(excelFileName)
    } catch (err) {
        console.error("Error writing Excel file:", err);
    }
}

module.exports = writeToExcel;
