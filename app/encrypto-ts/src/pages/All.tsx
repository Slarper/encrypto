import { useState } from "react";
import './All.css'
import CsvToHtmlTable from "../components/csvToHtmlTable";

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


    const [assetid, setAssetid] = useState('');
    const [datatype, setDatatype] = useState('0');
    const [data, setData] = useState('');

    const [requestID, setRequestID] = useState('');

    const [csvdata, setCsvData] = useState('');

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



    const putData = async () => {
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
                    id: assetid,
                    datatype: datatype,
                    data: data
                })

            }
        )
            .then(response => response.text())
            .then(data => setResult(data))
            .catch(error => console.error('Error:', error));

    }

    const getData = async () => {
        console.log('runCC init...')
        fetch('http://localhost:3001/api/getData',
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
                    id: assetid,
                })

            }
        )
            .then(response => response.text())
            .then(data => {setResult(data)

                const data2 = JSON.parse(data)
                const csv = data2.value
                
                setCsvData(csv)
            })
            .catch(error => console.error('Error:', error));

    }
    const requestData = async () => {
        console.log('runCC init...')
        fetch('http://localhost:3001/api/request',
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
                    id: requestID,
                    assetID: assetid
                })

            }
        )
            .then(response => response.text())
            .then(data => setResult(data))
            .catch(error => console.error('Error:', error));

    }
    const approval = async () => {
        console.log('runCC init...')
        fetch('http://localhost:3001/api/provideKey',
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
                    id: requestID,
                })

            }
        )
            .then(response => response.text())
            .then(data => setResult(data))
            .catch(error => console.error('Error:', error));

    }
    const getEncrypted = async () => {
        console.log('runCC init...')
        fetch('http://localhost:3001/api/getEncryptedData',
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
                    requestID: requestID,
                })

            }
        )
            .then(response => response.text())
            .then(data => {setResult(data)

                const csv = data

                setCsvData(csv)
            
            })
            .catch(error => console.error('Error:', error));

    }
    const getRequest = async () => {
        console.log('runCC init...')
        fetch('http://localhost:3001/api/getRequest',
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
                    rid: requestID,
                })

            }
        )
            .then(response => response.text())
            .then(data => setResult(data))
            .catch(error => console.error('Error:', error));

    }
    return (
        <div>
            <h1>欢迎使用电力数据加密原型系统</h1>
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
            <textarea value={result}
                onChange={(e) => setResult(e.target.value)}
            />

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
                                <input type="text" value={datatype}
                                    onChange={(e) => setDatatype(e.target.value)}
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
            <table>
                <tr>
                    <td>
                        <button
                            onClick={getData}
                        >GetData</button>
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
                    </td>
                </tr>
            </table>

            <table>
                <tr>
                    <td>
                        <button
                            onClick={requestData}
                        >RequestData</button>
                    </td>
                    <td>
                        <tr>
                            <td>
                                <label>Request ID</label>
                            </td>
                            <td>
                                <input type="text" value={requestID}
                                    onChange={(e) => setRequestID(e.target.value)}
                                />
                            </td>

                        </tr>
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

                    </td>
                </tr>
            </table>

            <table>
                <td>
                    <button
                        onClick={approval}
                    >Approval</button>
                </td>
                <td>
                    <tr>
                        <td>
                            <label>Request ID</label>
                        </td>
                        <td>
                            <input type="text" value={requestID}
                                onChange={(e) => setRequestID(e.target.value)}
                            />
                        </td>

                    </tr>
                </td>
            </table>

            <table>
                <td>
                    <button
                        onClick={getEncrypted}
                    >GetEncrypted</button>
                </td>
                <td>
                    <tr>
                        <td>
                            <label>Request ID</label>
                        </td>
                        <td>
                            <input type="text" value={requestID}
                                onChange={(e) => setRequestID(e.target.value)}
                            />
                        </td>

                    </tr>
                </td>
            </table>
            <table>
                <td>
                    <button
                        onClick={getRequest}
                    >GetRequest</button>
                </td>
                <td>
                    <tr>
                        <td>
                            <label>Request ID</label>
                        </td>
                        <td>
                            <input type="text" value={requestID}
                                onChange={(e) => setRequestID(e.target.value)}
                            />
                        </td>

                    </tr>
                </td>
            </table>
            <CsvToHtmlTable
                data={csvdata}
                csvDelimiter=","
                tableClassName="table table-striped table-hover"
            />


        </div>
    )
}

export default All;