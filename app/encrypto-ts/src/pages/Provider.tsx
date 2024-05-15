function Provider() {
    return (
        <div>
            <h1>Provider</h1>

            <table>
                <tr>
                    <td>
                        <label>MSP ID</label>
                    </td>
                    <td>
                        <input type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Channel ID</label>
                    </td>
                    <td>
                        <input type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Chaincode ID</label>
                    </td>
                    <td>
                        <input type="text" />
                    </td>
                </tr>
            </table>
        </div>
    );
}

export default Provider;