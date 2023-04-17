function html() {
  return `<!DOCTYPE html>
  <html class="text-center" lang="en">
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
      />
      <title>login</title>
      <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
      <link rel="stylesheet" href="assets/css/styles.min.css" />
    </head>
    <body style="background: rgb(51, 64, 77)">
      <h1 style="color: var(--bs-white)">Configuração</h1>
      <div>
        <form
          class="text-center"
          style="
            margin-bottom: 1px;
            color: var(--bs-white);
            padding-left: 500px;
            padding-right: 500px;
          "
          onsubmit="return validateForm()"
        >
          <label class="form-label">Token</label
          ><input
            class="form-control"
            type="password"
            id="token"
            style="
              color: rgb(60, 60, 60);
              background: rgb(60, 60, 60);
              text-shadow: 0px 0px rgb(98, 98, 98);
              text-align: center;
              border-radius: 40;
              border-style: none;
            "
            placeholder="ptlc_Nbe..."
            required=""
          /><label class="form-label">URL</label
          ><input
            class="form-control"
            type="url"
            id="link"
            style="
              background: rgb(60, 60, 60);
              border-style: none;
              text-shadow: 0px 0px rgb(98, 98, 98);
              text-align: center;
              color: rgb(98, 98, 98);
            "
            placeholder="https://pterodactyl.io"
            required=""
          /><br /><input
            class="btn btn-primary"
            type="submit"
            style="
              color: var(--bs-btn-active-color);
              background: rgb(17, 119, 187);
            "
          />
        </form>
      </div>
      <script src="assets/bootstrap/js/bootstrap.min.js"></script>
      <script src="assets/js/script.min.js"></script>
    </body>
  </html>`;
}

module.exports = { html }