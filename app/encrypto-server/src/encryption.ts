import * as paillierBigint from 'paillier-bigint'

interface PublicKey {
    n: bigint
    g: bigint
}
interface PrivateKey {
    lambda: bigint
    mu: bigint
    publicKey: PublicKey

}

export function plainToPublicKey(publicKey: PublicKey): paillierBigint.PublicKey {
    return new paillierBigint.PublicKey(publicKey.n, publicKey.g)
}

export function plainToPrivateKey(privateKey: PrivateKey): paillierBigint.PrivateKey {
    return new paillierBigint.PrivateKey(privateKey.lambda, privateKey.mu, plainToPublicKey(privateKey.publicKey))
}

export function stringToBigInt(str: string):bigint {
    // Use TextEncoder to convert string to bytes
    let encoder = new TextEncoder();
    let bytes = encoder.encode(str);
    
    // Combine bytes into a BigInt
    let result = BigInt(0);
    for (let i = 0; i < bytes.length; i++) {
        result = (result << BigInt(8)) + BigInt(bytes[i]);
    }
    
    return result;
}

// warning: not all bigints can convert into String!
// plz use bigInt.toString (or json())to serialize bigint
export function bigIntToString(bigInt:bigint): string {
    let bytes = [];

    // Convert BigInt to bytes
    while (bigInt > 0n) {
        bytes.unshift(Number(bigInt & 255n));  // Get the least significant byte
        bigInt >>= 8n;  // Right shift by one byte
    }

    // Use TextDecoder to convert bytes to string
    let decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
}



export const json = (param: any): string => {
    return JSON.stringify(
      param,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    );
  };

export const parse = (param: string): any => {
    return JSON.parse(
        param,
        (key, value) => (typeof value === "string" && value.match(/^-?\d+$/g) ? BigInt(value) : value)
    )
}

async function paillierTest () {
    // (asynchronous) creation of a random private, public key pair for the Paillier cryptosystem
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(3072)
    
    const publicKey_str = json(publicKey)
    console.log(publicKey)
    console.log(parse(publicKey_str))
    // Optionally, you can create your public/private keys from known parameters
    // const publicKey = new paillierBigint.PublicKey(n, g)
    // const privateKey = new paillierBigint.PrivateKey(lambda, mu, publicKey)
  
    const m1 = 12345678901234567890n
    const m2 = 5n
  
    // encryption/decryption
    const c1 = publicKey.encrypt(m1)
    console.log(privateKey.decrypt(c1)) // 12345678901234567890n
  
    // homomorphic addition of two ciphertexts (encrypted numbers)
    const c2 = publicKey.encrypt(m2)
    const encryptedSum = publicKey.addition(c1, c2)
    console.log(privateKey.decrypt(encryptedSum)) // m1 + m2 = 12345678901234567895n
  
    // multiplication by k
    const k = 10n
    const encryptedMul = publicKey.multiply(c1, k)
    console.log(privateKey.decrypt(encryptedMul)) // k · m1 = 123456789012345678900n
  }
//   paillierTest()