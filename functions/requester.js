const { request } = require("undici");
const vscode = require("vscode");
const { createLogs } = require("./toLogs");

let { maxUses, uses, time, remain } = {
  maxUses: 60,
  uses: 0,
  time: 60000,
  remain: 60,
};

setInterval(() => {
  uses = 0
}, time);

let hasProcess = { i: false, p: "" };

async function requester(url, config, options) {
  const link = await vscode.workspace.getConfiguration("pterodactyl").get("url");

  if (hasProcess.i && ((options && !options.isVS) || !options)) {
    vscode.window.showErrorMessage(
      `Você já tem um processo de ${hasProcess.p} em execução.`
    );
    return;
  } else {
    hasProcess = { i: true, p: `${url.split("/")[url.split("/").length - 1]}` };
  }

  if (uses > maxUses || remain === 0) {
    vscode.window.showInformationMessage(
      `Você atingiu o limite de requisições. Espere ${Math.floor(
        time / 1000
      )} segundos para usar novamente.`
    );
    return;
  }

  let data;
  try {
    data = await request(`${link}${url}`, config);

    hasProcess.i = false;
  } catch (err) {
    hasProcess.i = false;
    if (err.status === 401) {
      vscode.window.showErrorMessage(err.body.message);
      return err.status;
    }
    if (err.statusCode === 404) {
      return err.statusCode;
    }
    if (err === "Invalid endpoint") {
      return vscode.window.showErrorMessage(
        `${link}/${url}`
      );
    }

    return vscode.window.showErrorMessage(
      `${err.body ? err.body.message : err}`
    );
  }

  const fixData = await data.body.json();

  if ([504, 222].includes(fixData.statusCode) && fixData.status === "error") {
    createLogs(fixData.message, { text: fixData.logs }, {
      type: "normal",
    });
  }

  return fixData;
};

module.exports = { requester }


