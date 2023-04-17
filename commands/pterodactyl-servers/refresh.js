const { Command } = require("../../structures/command");

module.exports = class extends Command {
  constructor(pterodactyl) {
    super(pterodactyl, {
      name: "refreshButton",
    });
  }

  run = async () => {
    const tree = this.pterodactyl.mainTree;
    tree ? await tree.refresh() : false;
  };
};