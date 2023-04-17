class Command {

    constructor(pterodactyl, options) {
        this.pterodactyl = pterodactyl;
        this.name = options.name;
    }
}

module.exports = { Command }