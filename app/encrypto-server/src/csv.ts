import Papa from 'papaparse';

import { performance } from 'perf_hooks';

export function encryptcsv(csv: string, encrypt: (entry: string) => string): string {

    let startTime = performance.now();

    // Parse the CSV as string matrix
    const parsed = Papa.parse<string[]>(csv, { header: true });

    // count


    let count = 0;

    // Encrypt each slot of data
    parsed.data.forEach((entry) => {
        for (const key in entry) {
            entry[key] = encrypt(entry[key]);
            count++;
        }
    });


    const output: string = Papa.unparse(parsed.data);




    // End the timer
    let endTime = performance.now();



    // Calculate the elapsed time
    let timeElapsed = endTime - startTime;

    console.log(`The function encryptcsv took ${timeElapsed} milliseconds to execute. for ${count} entries`);

    return output

}