import csv from "csv-parser";
import fs from "fs";

/**
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<string[]>} - A promise that resolves to an array of IDs
 */
export async function parseCSV(filePath, idLength) {
    const ids = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                if (row.id && ids.length < idLength) {
                    ids.push(row.id);
                }
            })
            .on("end", () => resolve(ids))
            .on("error", (error) => {
                console.error("Error reading CSV file:", error);
                reject(error);
            });
    });
}
