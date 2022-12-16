const uuid = require('uuid');
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

  async editarUsuario(nome, email, senha, id) {
    let edicaoRealizada = false
    let existeEmail = await this.#checarEmail(email)
    if (!existeEmail) {
      await this.#atualizar(nome, email, senha, id)
      edicaoRealizada = true
    }
    this.#con.fechar()
    return edicaoRealizada
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
      let id = uuid.v4()
      let db = cliente.db()
      let colecao = db.collection('usuario')
      await colecao.insertOne({nome: nome, email: email, senha: senha, id: id})
    })
  }

  async #atualizar(nome, email, senha, id) {
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db();
      let colecao = db.collection('usuario');
      var toUpdate = {}
      if (senha != "") {
        toUpdate = { nome: nome, senha: senha, email: email }
      } else {
        toUpdate = { nome: nome, email: email }
      }
      await colecao.findOneAndUpdate(
        {id: id},
        {$set: toUpdate},
        {new: true}
      );
    })
  }
}
