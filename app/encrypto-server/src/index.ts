import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { runCC2, InvokeOrQuery, runCC3 } from './app3';
import { bigIntToString, json, parse, plainToPrivateKey, plainToPublicKey, stringToBigInt } from './encryption'
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
        const args: string = req.body.args;
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

app.post('/api/putData', async (req, res) => {

    try {
        const peer = req.body.peer;
        const identity = req.body.identity;
        const signer = req.body.signer;
        const channelName = req.body.channelName;
        const chaincodeName = req.body.chaincodeName;

        const id = req.body.id;
        const datatype = req.body.datatype;
        const data = req.body.data;

        if (datatype === '0' || datatype === 0) {

            await runCC3(peer, identity, signer,
                channelName, chaincodeName,
                async (c) => {
                    return c.submitTransaction('PutData', id, datatype, data);
                }
            );
            res.send('Success!');
            return;
        }

        // need encryption

        const data2 = stringToBigInt(data);

        const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(128)



        const data3 = publicKey.encrypt(data2);

        console.log('trying decryption:')
        console.log(bigIntToString(privateKey.decrypt(data3)))

        const data4 = json(data3);

        await runCC3(peer, identity, signer,
            channelName, chaincodeName,
            async (c) => {
                return c.submitTransaction('PutData', id, datatype, data4);
            }
        );
        res.send('Success!');
        fs.mkdirSync(`./storage/data/${id}`, { recursive: true }
        );

        fs.writeFile(
            `./storage/data/${id}/publicKey.json`,
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
            `./storage/data/${id}/privateKey.json`,
            json(privateKey),
            err => {
                if (err) {
                    console.error('An error occurred:', err);
                } else {
                    console.log('Successfully wrote to file!');
                }
            }
        )
    } catch (error) {
        console.error('Error:', error);
        res.send(error);
    }
})

app.post('/api/getData', async (req, res) => {
    const peer = req.body.peer;
    const identity = req.body.identity;
    const signer = req.body.signer;
    const channelName = req.body.channelName;
    const chaincodeName = req.body.chaincodeName;

    const id = req.body.id;
    try {
        const resultJson = await runCC3(peer, identity, signer,
            channelName, chaincodeName,
            async (c) => {
                return c.evaluateTransaction('GetAsset', id);
            }
        );
        res.send(resultJson);
    }

    catch (error) {
        console.error('Error:', error);
        res.send(error);
    }




})

app.post('/api/request', async (req, res) => {
    console.log("requestData start")
    const peer = req.body.peer;
    const identity = req.body.identity;
    const signer = req.body.signer;
    const channelName = req.body.channelName;
    const chaincodeName = req.body.chaincodeName;

    const id = req.body.id;
    const assetID = req.body.assetID;

    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(3072)

    const publicKeyString = json(publicKey);

    try {
        const resultJson = await runCC3(peer, identity, signer,
            channelName, chaincodeName,
            async (c) => {
                return c.submitTransaction('RequestData', assetID,id, publicKeyString);
            }
        );
        res.send("Success");
        fs.mkdirSync(`./storage/request/${id}`, { recursive: true }
        );
        fs.writeFile(
            `./storage/request/${id}/publicKey.json`,
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
            `./storage/request/${id}/privateKey.json`,
            json(privateKey),
            err => {
                if (err) {
                    console.error('An error occurred:', err);
                } else {
                    console.log('Successfully wrote to file!');
                }
            }
        )

    }

    catch (error) {
        console.error('Error:', error);
        res.send(error);
    }


});

app.post('/api/provideKey', async (req, res) => {
    const peer = req.body.peer;
    const identity = req.body.identity;
    const signer = req.body.signer;
    const channelName = req.body.channelName;
    const chaincodeName = req.body.chaincodeName;

    const id = req.body.id;


    try {
        const request = await runCC3(peer, identity, signer,
            channelName, chaincodeName,
            async (c) => {
                return c.evaluateTransaction('GetRequest', id);
            }
        );

        const request2 = JSON.parse(request);

        const publicKey = request2.privatekey;
        const publicKey_plain = parse(publicKey) as {n:bigint, g:bigint, n2:bigint, lambda:bigint, publicKey:bigint[]}

        const publicKey2 = plainToPublicKey(publicKey_plain);
        console.log('publick key of p2 = ')
        console.log(publicKey2)

        const assetID = request2.assetID;

        const key =fs.readFileSync(`./storage/data/${assetID}/privateKey.json`, 'utf8');

        const key2 = stringToBigInt(key);

        console.log(key2)

        console.log('is it work?')
        const key3 = publicKey2.encrypt(key2);

        const key4 = json(key3);


        const resultJson = await runCC3(peer, identity, signer,
            channelName, chaincodeName,
            async (c) => {
                return c.submitTransaction('ProvideKey',id, key4);
            }
        );
        res.send(resultJson);
    }

    catch (error) {
        console.error('Error:', error);
        res.send(error);
    }


});




app.post('/api/getEncryptedData', async (req, res) => {
    const peer = req.body.peer;
    const identity = req.body.identity;
    const signer = req.body.signer;
    const channelName = req.body.channelName;
    const chaincodeName = req.body.chaincodeName;

    const requestid = req.body.requestID;


    try {
        const request = await runCC3(peer, identity, signer,
            channelName, chaincodeName,
            async (c) => {
                return c.evaluateTransaction('GetRequest', requestid);
            }
        );

        const request2 = JSON.parse(request);

        const status = request2.status;

        if (!(status === '1' || status === 1)) {
            res.send('Data not ready yet');
            return;
        }



        const key  = request2.key;


        const assetID = request2.assetID;
        const privateKey =fs.readFileSync(`./storage/request/${requestid}/privateKey.json`, 'utf8');
        
        const privateKay_plain = parse(privateKey) 
        const privateKey2 = plainToPrivateKey(privateKay_plain);
        console.log('privatekey of p2 = ')
        console.log(privateKey2)
        const key1 = parse(key);
        console.log(typeof key1)

        console.log(key1)
        const key3 = privateKey2.decrypt(key1);

        console.log(key3)

        const key4 = bigIntToString(key3);
        console.log(key4)
        const key5 = plainToPrivateKey(parse(key4))



        const resultJson = await runCC3(peer, identity, signer,
            channelName, chaincodeName,
            async (c) => {
                return c.submitTransaction('GetAsset',assetID);
            }
        );


        const result = JSON.parse(resultJson);
        const data = result.value;

        const data2 = parse(data);

        const data3 = key5.decrypt(data2);

        const data4 = bigIntToString(data3);

        res.send(data4);
    }

    catch (error) {
        console.error('Error:', error);
        res.send(error);
    }


});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/test', ()=>{
    console.log(json(19999999999999999999999999999999999999999999999999999999999999999999n))
})

