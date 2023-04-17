const { Command } = require("../../structures/command");
const vscode = require("vscode");
const { tokenValidator } = require("../../functions/tokenValidator");

module.exports = class extends Command {
    constructor(pterodactyl) {
        super(pterodactyl, {
            name: "config",
        });
    }

    run = async () => {
        let configPanel = vscode.window.createWebviewPanel(
            'config', // Identificador do painel
            'Configuration', // Título
            vscode.ViewColumn.One, // Coluna onde o painel será exibido
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        function getConfigContent() {

            return `<!DOCTYPE html>
            <html>
              <body>
                <h1>Configuração</h1>
                <form onsubmit="return validateForm()">
                  <label for="token">Token:</label>
                  <input type="text" id="token" name="token" required />
                  <br />
                  <label for="link">Link:</label>
                  <input type="text" id="link" name="link" required />
                  <br />
                  <input type="submit" value="Submit" />
                </form>
                <p id="formValidation"></p>
                <script>
                  function validateForm() {
                    let token = document.getElementById("token").value;
                    let link = document.getElementById("link").value;
                    let formValidationMessage = document.getElementById("formValidation");
                    const vscode = acquireVsCodeApi();
            
                    if (!token) {
                      formValidationMessage.innerHTML = "Please fill out the Token field";
                      return false;
                    } else if (!token.startsWith("ptlc_")) {
                      formValidationMessage.innerHTML = "Please provide a valid token";
                      return false;
                    } else if (!link) {
                      formValidationMessage.innerHTML = "Please fill out the Link field";
                      return false;
                    } else if (!link.startsWith("http")) {
                      formValidationMessage.innerHTML = "Please provide a valid link";
                      return false;
                    } else {
                      vscode.postMessage({ token: token, url: link });
                      formValidationMessage.innerHTML = "Form submitted successfully";
                      return true;
                    }
                  }
                </script>
              </body>
            </html>
            `;
        }
        configPanel.webview.html = getConfigContent();

        configPanel.webview.onDidReceiveMessage(
            async message => {
                if (!await tokenValidator(message.token, message.url)) {
                    vscode.window.showErrorMessage("Token ou link inválido tente novamente.");
                } else {
                    const link = new URL(message.url);
                    const config = vscode.workspace.getConfiguration("pterodactyl")

                    config.update("url", link.origin, true);
                    config.update("token", message.token, true);

                    vscode.window.showInformationMessage("configurado com sucesso!")
                    this.pterodactyl.mainTree ? await this.pterodactyl.mainTree.refresh() : false;
                }
            }
        );

    };
};