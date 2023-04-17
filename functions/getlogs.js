const { WebSocket } = require('ws');

async function getLogs(identifier) {
    const token = await vscode.workspace.getConfiguration("pterodactyl").get("token");
    const url = await vscode.workspace.getConfiguration("pterodactyl").get("url");

    if (!url) {
        return;
    }

    if (!token) {
        return;
    }

    let websocket = await axios.get(`${url}/api/client/servers/${identifier}/websocket`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    websocket = websocket.data.data

    const ws = new WebSocket(websocket.socket);

    ws.on("open", () => {
        console.log("Starting")
        ws.send(JSON.stringify({ "event": "auth", "args": [`${websocket.token}`] }));

    });

    let allowedToLog = false;

    ws.on("message", (data) => {
        const result = JSON.parse(data)

        let logs = "";

        if (result.event === 'auth success') {
            console.log("Auth successful")
            ws.send(JSON.stringify({ "event": "send logs", "args": [null] }))
        }

        if (result.event === 'console output') {

            for (let v of result.args) {
                if (!allowedToLog && v.endsWith(" vulnerabilities")) {
                    allowedToLog = true;
                    continue;
                }

                if (!allowedToLog || v.length < 1) continue;
                logs += v + "\n";
            }

            return logs
        }
    });

    ws.on("error", (err) => {
        console.log(err);
    });
}

module.exports = { getLogs }