const axios = require("axios")
const { Command } = require("../../structures/command");
const vscode = require("vscode");
const { createStatus } = require("../../functions/toLogs");
const { formatBytes } = require("../../functions/formatBytes");
const moment = require("moment")
require("moment-duration-format");

module.exports = class extends Command {
  constructor(pterodactyl) {
    super(pterodactyl, {
      name: "statusEntry",
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
        title: "Status da Aplicação",
      },
      async (progress) => {

        let status = await axios.get(`${url}/api/client/servers/${item.tooltip}/resources`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        status = status.data.attributes;

        let status2 = await axios.get(`${url}/api/client/servers/${item.tooltip}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        status2 = status2.data.attributes.limits;

        if (!status) {
          return;
        }

        if (!status2) {
          return;
        }

        progress.report({
          message: " Status recebidas com sucesso.",
          increment: 100,
        });

        return createStatus(
          "Status acessadas com sucesso. Selecione uma das Opções:",
          {
            text: `Container: ${status.current_state}\nRAM: ${formatBytes(status.resources.memory_bytes)}/${formatBytes(status2.memory)}\nCPU: ${status.resources.cpu_absolute}/${status2.cpu}\nSSD NVMe: ${formatBytes(status.resources.disk_bytes)}/${formatBytes(status2.disk)}\nNetwork: ⬆${formatBytes(status.resources.network_rx_bytes)} ⬇${formatBytes(status.resources.network_tx_bytes)}\nUptime: ${moment.duration(status.resources.uptime).format("y [anos] M [meses] d [dias] h [horas] m [minutos] e s [segundos]").replace("minsutos", "minutos")}\n`
          },
          { type: "withLink" }
        );
      }
    );
  };
};
