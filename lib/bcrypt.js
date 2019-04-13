const bcryptjs = require('bcryptjs')

function hash(password) {

    return new Promise((resolve, reject) => {
        bcryptjs.hash(password, 8)
            .then(hash => resolve(hash))
            .catch(err => (reject(err.message)))
    })
}

async function compare(password, hash) {
    return await bcryptjs.compare(password, hash);

}
module.exports = { hash, compare }