const Pterodactyl = require("./structures/extend");

async function activate(context) {
  new Pterodactyl(context);
};
function deactivate() {};

module.exports = {
	activate,
	deactivate
}