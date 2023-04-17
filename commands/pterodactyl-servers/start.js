const { Command } = require("../../structures/command");
const axios = require("axios")
const vscode = require("vscode");

module.exports = class extends Command {
  constructor(pterodactyl) {
    super(pterodactyl, {
      name: "startEntry",
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
        title: "Iniciar Aplicação",
      },
      async (progress) => {
        progress.report({ message: ` Inicializando Aplicação...` });

        const start = await axios.post(`${url}/api/client/servers/${item.tooltip}/power`, {
          "signal": "start"
        },
          {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(err => {
            vscode.window.showInformationMessage(`Error`);
          })

        if (!start) {
          return;
        }

        progress.report({ increment: 100 });
        vscode.window.showInformationMessage(`Ligado com sucesso`);
        this.pterodactyl.mainTree?.refresh();
      }
    );
  };
};
