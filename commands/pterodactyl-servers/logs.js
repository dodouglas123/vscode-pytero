const { Command } = require("../../structures/command");
const vscode = require("vscode");
const { createLogs } = require("../../functions/toLogs");
const { getLogs } = require("../../functions/getlogs");

module.exports = class extends Command {
  constructor(pterodactyl) {
    super(pterodactyl, {
      name: "logsEntry",
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

    const workspaceFolders = vscode.workspace.workspaceFolders || [];
    if (workspaceFolders.length == 0) {
      vscode.window.showErrorMessage("Você precisa abrir alguma pasta com o VSCode antes de realizar essa ação.");
      return;
    }

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Logs da Aplicação",
      },
      async (progress) => {

        
        const logs = await getLogs(item.tooltip)

        if (!logs) {
          return;
        }

        progress.report({
          message: " Logs recebidas com sucesso.",
          increment: 100,
        });

        return createLogs(
          "Logs acessadas com sucesso.",
          {
            text: logs,
          },
          { type: "withLink" }
        );
      }
    );
  };
};
