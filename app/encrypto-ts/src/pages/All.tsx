import { useState } from "react";
import './All.css'

function All() {
    const [mspId, setMspId] = useState('Org1MSP');
    const [channelId, setChannelId] = useState('mychannel');
    const [chaincodeId, setChaincodeId] = useState('encrypto');
    const [peerEndpoint, setPeerEndpoint] = useState('localhost:7051');
    const [peerHostAlias, setPeerHostAlias] = useState('peer0.org1.example.com');
    const [tlsCertPath, setTlsCertPath] = useState('/root/encrypto/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt');
    const [keyDirectoryPath, setKeyDirectoryPath] = useState('/root/encrypto/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore')
    const [certDirectoryPath, setCertDirectoryPath] = useState('/root/encrypto/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts')
    const [result, setResult] = useState('');


    const [transaction, setTransaction] = useState('PutData');
    const [args, setArgs] = useState('[]');
    const [invokeOrQuery, setInvokeOrQuery] = useState("0");

    const submmit = async () => {
        console.log('runCC init...')
        fetch('http://localhost:3001/api/call',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    invokeOrQuery: invokeOrQuery,
                    peer: {
                        peerEndpoint: peerEndpoint,
                        peerHostAlias: peerHostAlias,
                        tlsCertPath: tlsCertPath,
                    },
                    identity: {
                        mspId: mspId,
                        certDirectoryPath: certDirectoryPath
                    },
                    signer: {
                        keyDirectoryPath: keyDirectoryPath,

                    },
                    channelName: channelId,
                    chaincodeName: chaincodeId,
                    transaction: transaction,
                    args: args // string here
                })

            }
        )
            .then(response => response.text())
            .then(data => setResult(data))
            .catch(error => console.error('Error:', error));

    }

    const [assetid, setAssetid] = useState('');
    const [to_encrypt, setTo_encrypt] = useState('0');
    const [data, setData] = useState('');

    const putData= async () => {
        console.log('runCC init...')
        fetch('http://localhost:3001/api/putData',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    peer: {
                        peerEndpoint: peerEndpoint,
                        peerHostAlias: peerHostAlias,
                        tlsCertPath: tlsCertPath,
                    },
                    identity: {
                        mspId: mspId,
                        certDirectoryPath: certDirectoryPath
                    },
                    signer: {
                        keyDirectoryPath: keyDirectoryPath,

                    },
                    channelName: channelId,
                    chaincodeName: chaincodeId,
                    id : assetid,
                    datatype: to_encrypt,
                    data: data
                })

            }
        )
            .then(response => response.text())
            .then(data => setResult(data))
            .catch(error => console.error('Error:', error));

    }
    return (
        <div>
            <h1>All Assets</h1>
            <table>
                <tr>
                    <td>
                        <label>MSP ID</label>
                    </td>
                    <td>
                        <input type="text" className="input-table"
                            onChange={(e) => setMspId(e.target.value)}
                            value={mspId} />

                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Channel ID</label>
                    </td>
                    <td>
                        <input type="text" value={channelId} className="input-table"
                            onChange={(e) => setChannelId(e.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Chaincode ID</label>
                    </td>
                    <td>
                        <input type="text" value={chaincodeId} className="input-table"
                            onChange={(e) => setChaincodeId(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Peer Endpoint</label>
                    </td>
                    <td>
                        <input type="text" value={peerEndpoint} className="input-table"
                            onChange={(e) => setPeerEndpoint(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Peer Host Alias</label>
                    </td>
                    <td>
                        <input type="text" value={peerHostAlias} className="input-table"
                            onChange={(e) => setPeerHostAlias(e.target.value)}
                        />
                    </td>

                </tr>
                <tr>
                    <td>
                        <label>TLS Cert Path</label>
                    </td>
                    <td>
                        <input type="text" value={tlsCertPath} className="input-table"
                            onChange={(e) => setTlsCertPath(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Key Directory Path</label>
                    </td>
                    <td>
                        <input type="text" value={keyDirectoryPath} className="input-table"
                            onChange={(e) => setKeyDirectoryPath(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Cert Directory Path</label>
                    </td>
                    <td>
                        <input type="text" value={certDirectoryPath} className="input-table"
                            onChange={(e) => setCertDirectoryPath(e.target.value)}
                        />
                    </td>
                </tr>

            </table>
            <table>
                <tr>
                    <td>
                        <button
                            onClick={submmit}
                        >Submit</button>
                    </td>
                    <td>
                        <tr>
                            <td>
                                <label>Invoke=0 Or Query=1 </label>
                            </td>
                            <td>
                                <input type="text" value={invokeOrQuery}
                                    onChange={(e) => setInvokeOrQuery(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Transaction</label>
                            </td>
                            <td>
                                <input type="text" value={transaction}
                                    onChange={(e) => setTransaction(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Args</label>
                            </td>
                            <td>
                                <textarea value={args}
                                    onChange={(e) => {
                                        try {
                                            setArgs((e.target.value))
                                        }
                                        catch (error) {
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                    </td>
                </tr>


            </table>
            <table>
                <tr>
                    <td>
                        <button
                            onClick={putData}
                        >PutData</button>
                    </td>
                    <td>
                        <tr>
                            <td>
                                <label>Asset ID</label>
                            </td>
                            <td>
                                <input type="text" value={assetid}
                                    onChange={(e) => setAssetid(e.target.value)}
                                />
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <label>To Encrypt</label>
                            </td>
                            <td>
                                <input type="text" value={to_encrypt}
                                    onChange={(e) => setTo_encrypt(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Data</label>
                            </td>
                            <td>
                                <textarea value={data}
                                    onChange={(e) => setData(e.target.value)}
                                />
                            </td>
                        </tr>
                    </td>
                </tr>
            </table>
            <textarea value={result}
                onChange={(e) => setResult(e.target.value)}
            />
        </div>
    )
}

export default All;