const { Command } = require("../../structures/command");
const vscode = require("vscode");
const axios = require("axios")

module.exports = class extends Command {
  constructor(pterodactyl) {
    super(pterodactyl, {
      name: "stopEntry",
    });
  }

  run = async (item) => {

    const token = this.pterodactyl.config.get("token");
    const url = this.pterodactyl.config.get("url");

    if (!token) {
      return;
    }
    if (!url) {
      return;
    }

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Parar Aplicação",
      },
      async (progress) => {
        progress.report({ message: ` Iniciando Processo...` });

        const stop = await axios.post(`${url}/api/client/servers/${item.tooltip}/power`, {
          "signal": "stop"
        },
          {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(err => {
            vscode.window.showInformationMessage(`Error`);
          })


        if (!stop) {
          return;
        }

        progress.report({ increment: 100 });
        vscode.window.showInformationMessage(`Desligado com sucesso`);
        this.pterodactyl.mainTree?.refresh();
      }
    );
  };
};
