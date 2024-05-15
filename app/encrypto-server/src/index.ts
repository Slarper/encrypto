import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { runCC2, InvokeOrQuery, runCC3 } from './app3';
import {bigIntToString, json, stringToBigInt} from './encryption'
import * as fs from 'fs';
import * as paillierBigint from 'paillier-bigint'


const app = express();
const port = 3001;

// parse application/json
app.use(bodyParser.json())

app.use(cors());

app.get('/', (req, res) => {
    console.log("hwl")
    res.send('Hello World!');
});

app.post('/api/call', async (req, res) => {

    try {
        const invokeOrQuery = JSON.parse(req.body.invokeOrQuery) as InvokeOrQuery;
        const peer = req.body.peer;
        const identity = req.body.identity;
        const signer = req.body.signer;
        const channelName = req.body.channelName;
        const chaincodeName = req.body.chaincodeName;
        const transaction = req.body.transaction;
        const args:string = req.body.args;
        const args_array = JSON.parse(args)
        console.log("args:")
        console.log(args_array)
        const resultJson = await runCC2(invokeOrQuery, peer, identity, signer
            , channelName, chaincodeName, transaction, ...args_array);
        res.send(resultJson);
    }

    catch (error) {
        console.error('Error:', error);
        res.send(error);
    }


});

app.post('/api/putData', async (req, res) =>{

    try {
        const peer = req.body.peer;
        const identity = req.body.identity;
        const signer = req.body.signer;
        const channelName = req.body.channelName;
        const chaincodeName = req.body.chaincodeName;

        const id = req.body.id;
        const to_encrypt = req.body.datatype;
        const data = req.body.data;

        const data2 = stringToBigInt(data);

        const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(3072)



        const data3 = publicKey.encrypt(data2);

        console.log('trying decryption:')
        console.log(bigIntToString(privateKey.decrypt(data3)))

        await runCC3(peer, identity, signer,
            channelName, chaincodeName,
            async  (c) => {
                return c.submitTransaction('PutData', id, to_encrypt, data3.toString());
            }
        );
        res.send('Success!');
        fs.mkdir(`../server-storage/${id}`, { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
        }
        );
        fs.writeFile(
            `../server-storage/${id}/publicKey.json`,
            json(publicKey),
            err => {
                if (err) {
                    console.error('An error occurred:', err);
                } else {
                    console.log('Successfully wrote to file!');
                }
            }
        )

        fs.writeFile(
            `../server-storage/${id}/privateKey.json`,
            json(privateKey),
            err => {
                if (err) {
                    console.error('An error occurred:', err);
                } else {
                    console.log('Successfully wrote to file!');
                }
            }
        )
    }     catch (error) {
        console.error('Error:', error);
        res.send(error);
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

