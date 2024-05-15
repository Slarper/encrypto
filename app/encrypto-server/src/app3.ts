import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}


const utf8Decoder = new TextDecoder();




type CryptoPath = string | { keyDirectoryPath: string, certDirectoryPath: string, tlsCertPath:string };

export enum InvokeOrQuery {
    Invoke,
    Query
}

// export async function runCC(ioq:InvokeOrQuery ,peer: Peer, channelName: string, chaincodeName: string, transaction:string, ...args: Array<string | Uint8Array>): Promise<any> {
//     console.log('runCC init...')
//     let keyDirectoryPath: string;
//     let certDirectoryPath: string;
//     let tlsCertPath: string;
    
//     if (typeof peer.cryptoPath === 'string') {
//         keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(peer.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));
//         certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(peer.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));
//         tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(peer.cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));
//     } else {
//         keyDirectoryPath = peer.cryptoPath.keyDirectoryPath;
//         certDirectoryPath = peer.cryptoPath.certDirectoryPath;
//         tlsCertPath = peer.cryptoPath.tlsCertPath;
//     }

//     console.log(keyDirectoryPath)
//     console.log(certDirectoryPath)
//     console.log(tlsCertPath)
    
//     const client = await newGrpcConnection(peer.peerEndpoint, tlsCertPath, peer.peerHostAlias);
    
//     const gateway = connect({
//         client,
//         identity: await newIdentity(peer.mspId, certDirectoryPath),
//         signer: await newSigner(keyDirectoryPath),
//         // Default timeouts for different gRPC calls
//         evaluateOptions: () => {
//             return { deadline: Date.now() + 5000 }; // 5 seconds
//         },
//         endorseOptions: () => {
//             return { deadline: Date.now() + 15000 }; // 15 seconds
//         },
//         submitOptions: () => {
//             return { deadline: Date.now() + 5000 }; // 5 seconds
//         },
//         commitStatusOptions: () => {
//             return { deadline: Date.now() + 60000 }; // 1 minute
//         },
//     });
//     try {
//         // Get a network instance representing the channel where the smart contract is deployed.
//         const network = gateway.getNetwork(channelName);

//         // Get the smart contract from the network.
//         const contract = network.getContract(chaincodeName);

//         let resultBytes: Uint8Array;
//         console.log('runCC starting...')
//         if (ioq === InvokeOrQuery.Invoke) {
//             console.log(transaction)
//             console.log(args)
//             resultBytes = await contract.submitTransaction(transaction,...args);


//         } else {
//             resultBytes = await contract.evaluateTransaction(transaction,...args);
//         }

//         const resultJson = utf8Decoder.decode(resultBytes);

//         return resultJson;
            
//     } finally {
//         gateway.close();
//         client.close();
//     }


// }
export interface Peer {

    peerEndpoint: string;
    peerHostAlias: string;

    tlsCertPath: string;
}

export interface Identity2 {
    mspId: string;
    certDirectoryPath: string;
}

export interface Signer2 {
    keyDirectoryPath: string;

}

export async function runCC2(ioq:InvokeOrQuery , peer: Peer, identity: Identity2, signer: Signer2,
     channelName: string, chaincodeName: string, transaction:string, ...args: Array<string | Uint8Array>): Promise<any> {
    console.log('runCC init...')


    
    const client = await newGrpcConnection(peer.peerEndpoint, peer.tlsCertPath, peer.peerHostAlias);
    
    const gateway = connect({
        client,
        identity: await newIdentity(identity.mspId, identity.certDirectoryPath),
        signer: await newSigner(signer.keyDirectoryPath),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });
    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);

        let resultBytes: Uint8Array;
        console.log('runCC starting...')
        if (ioq === InvokeOrQuery.Invoke) {
            console.log(transaction)
            console.log(args)
            resultBytes = await contract.submitTransaction(transaction,...args);


        } else {
            resultBytes = await contract.evaluateTransaction(transaction,...args);
        }

        const resultJson = utf8Decoder.decode(resultBytes);

        return resultJson;
            
    } finally {
        gateway.close();
        client.close();
    }


}

export async function runCC3(peer: Peer, identity: Identity2, signer: Signer2,
    channelName: string, chaincodeName: string, callback: (c:Contract) => Promise<any>): Promise<string> {
   console.log('runCC init...')


   
   const client = await newGrpcConnection(peer.peerEndpoint, peer.tlsCertPath, peer.peerHostAlias);
   
   const gateway = connect({
       client,
       identity: await newIdentity(identity.mspId, identity.certDirectoryPath),
       signer: await newSigner(signer.keyDirectoryPath),
       // Default timeouts for different gRPC calls
       evaluateOptions: () => {
           return { deadline: Date.now() + 5000 }; // 5 seconds
       },
       endorseOptions: () => {
           return { deadline: Date.now() + 15000 }; // 15 seconds
       },
       submitOptions: () => {
           return { deadline: Date.now() + 5000 }; // 5 seconds
       },
       commitStatusOptions: () => {
           return { deadline: Date.now() + 60000 }; // 1 minute
       },
   });
   try {
       // Get a network instance representing the channel where the smart contract is deployed.
       const network = gateway.getNetwork(channelName);

       // Get the smart contract from the network.
       const contract = network.getContract(chaincodeName);

       let resultBytes: Uint8Array;
       console.log('runCC starting...')

        resultBytes = await callback(contract);

       const resultJson = utf8Decoder.decode(resultBytes);

       return resultJson;
           
   } finally {
       gateway.close();
       client.close();
   }


}



async function newGrpcConnection(peerEndpoint: string, tlsCertPath: string, peerHostAlias: string): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(mspId:string, certDirectoryPath:string): Promise<Identity> {
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    return path.join(dirPath, files[0]);
}

async function newSigner(keyDirectoryPath:string): Promise<Signer> {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}