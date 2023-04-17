const axios = require("axios")

async function tokenValidator(token, url) {
  const link = new URL(url);

  // @ts-ignore
  await axios.get(`${link.origin}/api/client/account`, {
    headers: { Authorization: `Bearer ${token}` }
  }).catch(err => {
    return false
  })

  return true
}

module.exports = { tokenValidator }