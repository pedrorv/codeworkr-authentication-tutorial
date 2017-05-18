const bcrypt = require('bcryptjs')

module.exports = {
  hashPassword: (password) => {
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .catch(error => {
        throw new Error('Hashing failed.', error)
      })
  }
}