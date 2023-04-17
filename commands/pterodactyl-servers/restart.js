const { Command } = require("../../structures/command");
const axios = require("axios")
const vscode = require("vscode");

module.exports = class extends Command {
  constructor(pterodactyl) {
    super(pterodactyl, {
      name: "restartEntry",
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
        title: "Reinciar Aplicação",
      },
      async (progress) => {
        progress.report({ message: ` Iniciando Processo...` });
        console.log(item.tooltip)
        // @ts-ignore
        const restart = await axios.post(`${url}/api/client/servers/${item.tooltip}/power`, {
          "signal": "restart"
        },
          {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(err => {
            console.log(err)
            vscode.window.showInformationMessage(`Error`);
          })

        if (!restart) {
          return;
        }

        progress.report({ increment: 100 });
        vscode.window.showInformationMessage(`Reiniciado com sucesso`);
        this.pterodactyl.mainTree?.refresh();
      }
    );
  };
};
