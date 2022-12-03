module.exports = class CadastrarUsuario {
  #con

  constructor() {
    const conexao = require('./Conexao')
    this.#con = new conexao()
  }

  async cadastrarUsuario(nome, email, senha) {
    let cadastroRealizado = false
    let existeEmail = await this.#checarEmail(email)
    if (!existeEmail) {
      cadastroRealizado = true
      await this.#inserir(nome, email, senha)
    }
    this.#con.fechar()
    return cadastroRealizado
  }

  async #checarEmail(email) {
    let emailCadastrado = false
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db()
      let colecao = db.collection('usuario')
      await colecao.findOne({email: email}).then(res => {
        if (res != null) {
          emailCadastrado = true
        } else {
          emailCadastrado = false
        }
      })
    })
    return emailCadastrado
  }

  async #inserir(nome, email, senha) {
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db()
      let colecao = db.collection('usuario')
      await colecao.insertOne({nome: nome, email: email, senha: senha})
    })
  }
}
