module.exports = class Mensagem {
  #con

  constructor() {
    const conexao = require('./Conexao')
    this.#con = new conexao()
  }

  async enviar(remetente, destinatario, mensagem) {
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db()
      let colecao = db.collection('conversa')
      await colecao.insertOne({email_usuario_remetente: remetente, email_usuario_destinatario: destinatario, mensagem: mensagem})
    })
  }

  async buscar(emailUsuario) {
    let mensagens
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db()
      let colecao = db.collection('conversa')
      const consulta = {$or: [{email_usuario_remetente: emailUsuario}, {email_usuario_destinatario: emailUsuario}]}
      mensagens = await colecao.find(consulta).toArray()
    })
    mensagens.forEach(item => {
      delete item._id
    });

    return mensagens
  }

  fechar() {
    this.#con.fechar()
  }
}
