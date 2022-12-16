module.exports = class Conexao {
  #cli

  constructor() {
    var {MongoClient} = require('mongodb')
    var url = 'mongodb://localhost:27017/chat'
    this.#cli = new MongoClient(url, {useUnifiedTopology: true})
  }

  cliente() {
    return this.#cli
  }

  fechar() {
    this.#cli.close()
  }
}
