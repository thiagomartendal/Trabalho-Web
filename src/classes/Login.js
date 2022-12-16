module.exports = class Login {
  #con
  #usuario

  constructor() {
    const conexao = require('./Conexao')
    this.#con = new conexao()
    this.#usuario = {}
  }

  async verificar(email, senha) {
    let loginValido = false
    let us = {}
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db()
      let colecao = db.collection('usuario')
      await colecao.findOne({email: email, senha: senha}).then(res => {
        us = res
        loginValido = ((res != null) ? true : false)
      })
    })
    this.#con.fechar()
    if (us != null) {
      delete us._id
      delete us.senha
      this.#usuario = us
    }
    return loginValido
  }

  get usuario() {
    return this.#usuario
  }
}
