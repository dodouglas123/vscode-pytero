const vscode = require("vscode");
// eslint-disable-next-line no-unused-vars
const pterodactyl = require("../../structures/extend");
const { formatBytes } = require("../formatBytes");
const { ChildrenTreeItem, TreeItem } = require("./treeItem");
const axios = require("axios")
const moment = require("moment")
require("moment-duration-format");

class AppTreeDataProvider {

  /** @param {pterodactyl} pterodactyl */
  constructor(cache, pterodactyl) {
    this.pterodactyl = pterodactyl;
    this.data = [];
    this.cache = cache;
    this.init();
    this.refresh();
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  async verifyApps() {
    const token = await vscode.workspace.getConfiguration("pterodactyl").get("token");
    const url = await vscode.workspace.getConfiguration("pterodactyl").get("url");

    const tree = [];

    if (!url) {
      return;
    }

    if (!token) {
      return;
    }

    // @ts-ignore
    const res = await axios.get(`${url}/api/client`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res) {
      return;
    }

    const alphabeticApps = res.data.data.sort((a, b) => {
      if (a.attributes.name < b.attributes.name) { return -1; }
      if (a.attributes.name > b.attributes.name) { return 1; }
      return 0;
    });

    const status = {
      "online": "on",
      "starting": "on",
      "offline": "off"
    }

    for await (const app of alphabeticApps) {

      if (!app) {
        continue;
      }

      let childrens;
      let b

      if (res) {

        // @ts-ignore
        b = await axios.get(`${url}/api/client/servers/${app.attributes.identifier}/resources`, {
          headers: { Authorization: `Bearer ${token}` }
        })


        childrens = {
          cont: new ChildrenTreeItem(
            `Container`,
            b.data.attributes.current_state === 'offline' ? "Offline" : "Online",
            vscode.TreeItemCollapsibleState.None,
            { iconName: "container" }
          ),
          ram: new ChildrenTreeItem(
            "RAM",
            `${formatBytes(app.attributes.limits.memory)}/${formatBytes(b.data.attributes.resources.memory_bytes)}`,
            vscode.TreeItemCollapsibleState.None,
            { iconName: "ram" }
          ),
          cpu: new ChildrenTreeItem(
            "CPU",
            b.data.attributes.resources.cpu_absolute + "%",
            vscode.TreeItemCollapsibleState.None,
            { iconName: "cpu" }
          ),
          ssd: new ChildrenTreeItem(
            "SSD NVMe",
            `${formatBytes(app.attributes.limits.disk)}/${formatBytes(b.data.attributes.resources.disk_bytes)}`,
            vscode.TreeItemCollapsibleState.None,
            { iconName: "ssd" }
          ),
          net: new ChildrenTreeItem(
            "Network",
            `⬆${formatBytes(b.data.attributes.resources.network_rx_bytes)} ⬇${formatBytes(b.data.attributes.resources.network_tx_bytes)}`,
            vscode.TreeItemCollapsibleState.None,
            { iconName: "network" }
          ),
          lstr: new ChildrenTreeItem(
            "Última Reinicialização",
            `${moment.duration(b.data.attributes.resources.uptime).format("y [anos] M [meses] d [dias] h [horas] m [minutos] e s [segundos]").replace("minsutos", "minutos")}`,
            vscode.TreeItemCollapsibleState.None,
            { iconName: "uptime" }
          ),
        };
      }

      tree.push(
        new TreeItem(`${app.attributes.name}`, childrens == undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed, {
          iconName: status[b.data.attributes.current_state],
          children: (childrens) ? Object.values(childrens) : undefined,
          tooltip: app.attributes.identifier,
        })
      );

    }

    this.cache.set(`apps-user_verify`, res);

    tree.length > 0
      ? await this.createTreeItem(tree)
      : await this.createTreeItem([
        new TreeItem(
          "Nenhuma aplicação foi encontrada.",
          vscode.TreeItemCollapsibleState.None,
          { iconName: "x" }
        ),
      ]);
  }

  createTreeItem(array) {
    this.data = array;
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  async refresh(data) {
    const token = vscode.workspace.getConfiguration("pterodactyl").get("token");
    if (!token) {
      return;
    }

    if (data) {
      data.length > 0
        ? await this.createTreeItem(data)
        : await this.createTreeItem([
          new TreeItem(
            "Nenhuma aplicação foi encontrada.",
            vscode.TreeItemCollapsibleState.None,
            { iconName: "x" }
          ),
        ]);
    } else {
      await this.verifyApps();
    }
    this._onDidChangeTreeData.fire();
    console.log("[TREE] Refreshed.");
  }

  async init() {
    const token = vscode.workspace.getConfiguration("pterodactyl").get("token");
    if (!token) {
      return;
    } else {
      this.data = [
        new TreeItem(
          "Nenhuma aplicação foi encontrada.",
          vscode.TreeItemCollapsibleState.None,
          { iconName: "x" }
        ),
      ];
    }
  }
};

module.exports = { AppTreeDataProvider };