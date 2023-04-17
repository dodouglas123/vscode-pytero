const { readdirSync } = require("fs");
const { join } = require("path");
const vscode = require("vscode");
const { AppTreeDataProvider } = require("../functions/api/tree");


module.exports = class pterodactyl {
  /** @param {vscode.ExtensionContext} context */
  constructor(context) {
    this.secrets = context.secrets
    this.commands = [];
    this.subscriptions = context.subscriptions;
    this.cache = new Map();
    this.bars = new Map();
    this.trees = new Map();
    this.mainTree;
    this.config = vscode.workspace.getConfiguration("pterodactyl");
    this.loadCommands();
    this.loadStatusBar();
    this.loadTrees();
  }

  loadCommands() {
    const categories = readdirSync(join(__filename, "..", "..", "commands"));
    for (const category of categories) {
      const commands = readdirSync(
        join(__filename, "..", "..", "commands", category)
      ).filter((r) => r.endsWith(".js"));
      for (const command of commands) {
        const commandClass = require(join(
          __filename,
          "..",
          "..",
          "commands",
          category,
          command
        ));
        const cmd = new commandClass(this);

        let disp = vscode.commands.registerCommand(
          `${category}.${cmd.name}`,
          async (uri) => {
            await cmd.run(uri);
          }
        );
        this.subscriptions.push(disp);

        this.commands.push(cmd);
      }
    }
    console.log("[PTERODACTYL] Extension has loaded all commands.");
  }

  loadStatusBar() {
    const uploadBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      40
    );
    uploadBar.command = "pterodactyl.upload";
    uploadBar.text = "$(cloud-upload) Upload pterodactyl";

    this.subscriptions.push(uploadBar);
    uploadBar.tooltip = "Upload to pterodactyl";
    uploadBar.show();
    this.cache.set('upload_bar', uploadBar);
    this.bars.set('upload_bar', uploadBar);
  }

  loadTrees() {
    const apps = new AppTreeDataProvider(this.cache, this);
    vscode.window.registerTreeDataProvider("pterodactyl-servers", apps);
    this.mainTree = apps;
  }
}

Object.defineProperty(global, 'actualProcess', {
  value: new Map()
});