/**
 * Retries an asynchronous operation with a specified maximum number of retries and delay between retries.
 *
 * @param {Function} operation - The asynchronous operation to retry.
 * @param {number} [maxRetries=5] - The maximum number of times to retry the operation.
 * @param {number} [retryDelayMs=3000] - The delay in milliseconds between retries.
 * @returns {Promise} - A Promise that resolves when the operation succeeds or rejects if it fails after all retries.
 * @throws {Error} If the operation continues to fail after the specified number of retries,
 *  the process will exit with code 1.
 */

const retryOperation = async (operation, maxRetries = 10, retryDelayMs = 3000) => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const result = await operation();
            return result; // Operation succeeded, exit the loop
        } catch (err) {
            console.error(`Error launching browser (retry ${retries + 1}):`, err);
            // Increment the retry count
            retries++;
            if (retries < maxRetries) {
                console.log(`Retrying in ${retryDelayMs / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
            } else {
                // If max retries exceeded, throw an error
                console.error(`Operation failed after ${maxRetries} attempts.`);
                process.exit(1);
            }
        }
    }
    console.error(`Operation failed after ${maxRetries} attempts.`);
    process.exit(1);
}

module.exports = retryOperation;