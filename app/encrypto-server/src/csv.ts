import Papa from 'papaparse';

export function encryptcsv(csv: string, encrypt: (entry: string) => string): string {
  // Parse the CSV as string matrix
    const parsed = Papa.parse<string[]>(csv, { header: true });
    // Encrypt each slot of data
    parsed.data.forEach((entry) => {
        for (const key in entry) {
            entry[key] = encrypt(entry[key]);
        }
    });

    const output: string = Papa.unparse(parsed.data);

    return output

}