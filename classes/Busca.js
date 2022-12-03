module.exports = class Busca {
  #con

  constructor() {
    const conexao = require('./Conexao')
    this.#con = new conexao()
  }

  async buscarUsuario(valorBusca) {
    let resultado
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db()
      let colecao = db.collection('usuario')
      resultado = await colecao.find({nome: valorBusca}).toArray()
      if (resultado.length == 0) {
        resultado = await colecao.find({email: valorBusca}).toArray()
      }
      if (resultado != null) {
        resultado.forEach(item => {
          delete item._id
          delete item.senha
        })
      }
    })
    this.#con.fechar()
    return resultado
  }
}
