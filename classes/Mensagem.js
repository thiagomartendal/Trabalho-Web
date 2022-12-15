module.exports = class Mensagem {
  #con

  constructor() {
    const conexao = require('./Conexao')
    this.#con = new conexao()
  }

  async enviar(idRemetente, emailDestinatario, mensagem) {
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db()
      let colecaoConversa = db.collection('conversa')
      let colecaoUsuario = db.collection('usuario')
      const usuario = await colecaoUsuario.findOne({email: emailDestinatario})
      let destinatarioId = usuario.id
      await colecaoConversa.insertOne({id_usuario_remetente: idRemetente, id_usuario_destinatario: destinatarioId, mensagem: mensagem})
    })
  }

  async buscar(idRemetente, emailDestinatario) {
    let mensagens
    await this.#con.cliente().connect().then(async function(cliente) {
      let db = cliente.db()
      let colecao = db.collection('conversa')
      let colecaoUsuario = db.collection('usuario')
      const usuario = await colecaoUsuario.findOne({email: emailDestinatario})
      let destinatarioId = usuario.id
      const consulta = {
        $or: 
          [
            {id_usuario_remetente: idRemetente, id_usuario_destinatario: destinatarioId}, 
            {id_usuario_remetente: destinatarioId, id_usuario_destinatario: idRemetente}
          ]
      }
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
