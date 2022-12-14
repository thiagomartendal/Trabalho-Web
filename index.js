(function() {
  const express = require('express')
  const bodyParser = require('body-parser')
  const session = require('express-session')
  const app = express()

  var falhaLogin = false

  app.use(session({
      name: 'sessao',
      secret: 'sessao-login',
      resave: false,
      saveUninitialized: false
  }))
  app.use(express.json())
  app.use(bodyParser.urlencoded({extended: true}))

  app.get('/', function(req, res) {
    if (req.session.usuarioConectado) {
      res.redirect('/conta')
    } else {
      res.sendFile(__dirname + '/html/index.html')
    }
  })

  app.use(express.static(__dirname + '/html')) // Deve ser instanciado após app.get('/') para poder se processar a rota inicial

  app.post('/novaConta', async function(req, res) {
    const CadastrarUsuario = require('./classes/CadastrarUsuario')
    let nome = req.body['nomeConta']
    let email = req.body['emailConta']
    let senha = req.body['senhaConta']
    let cadastro = new CadastrarUsuario()
    let status
    await cadastro.cadastrarUsuario(nome, email, senha).then(res => {
      status = res
    })
    res.send({situacaoCadastro: status})
  })


  app.patch('/editaUsuario', async function(req, res) {
    const CadastrarUsuario = require('./classes/CadastrarUsuario')
    let novoNome = req.body['novoNome']
    let email = req.body['email']
    let novaSenha = req.body['novaSenha']
    let cadastro = new CadastrarUsuario()
    let status
    await cadastro.editarUsuario(novoNome, email, novaSenha).then(res => {
      status = res
    })
    res.send({cadastroEditado: status})
  })

  app.post('/login', async function(req, res) {
    const Login = require('./classes/Login')
    let email = req.body['email-login']
    let senha = req.body['senha-login']
    let log = new Login()
    let loginValido = false
    await log.verificar(email, senha).then(res => {
      loginValido = res
    })
    if (loginValido) {
      usuario = log.usuario
      req.session.usuario = log.usuario
      req.session.usuarioConectado = true
      res.redirect('/conta')
    } else {
      falhaLogin = true
      res.redirect('/')
    }
  })

  app.post('/falhaLogin', function(req, res) {
    let status = false
    if (falhaLogin) {
      falhaLogin = false
      status = true
    }
    res.send({falhaLogin: status})
  })

  app.post('/usuario', function(req, res) {
    res.send(req.session.usuario)
  })

  app.get('/conta', function(req, res) {
    // if (usuarioConectado) {
    if (req.session.usuarioConectado) {
      res.sendFile(__dirname + '/html/conta.html')
    } else {
      res.redirect('/')
    }
  })

  app.get('/sair', function(req, res) {
    req.session.usuarioConectado = false
    req.session.usuario = null
    req.session.destroy()
    res.redirect('/')
  })

  app.post('/busca', async function(req, res) {
    const Busca = require('./classes/Busca')
    let valorBusca = req.body['valorBusca']
    let busca = new Busca()
    let resultado
    await busca.buscarUsuario(valorBusca).then(res => {
      resultado = res
    })
    resultado.forEach((item, i) => {
      if (item.nome == req.session.usuario.nome && item.email == req.session.usuario.email) {
        resultado.splice(i, 1)
      }
    })
    res.send(resultado)
  })

  app.post('/enviarMensagem', async function(req, res) {
    const Mensagem = require('./classes/Mensagem')
    let emailDestinatario = req.body['emailDestinatario']
    let msg = req.body['msg']
    const mensagem = new Mensagem()
    await mensagem.enviar(req.session.usuario.email, emailDestinatario, msg)
    mensagem.fechar()
  })

  app.post('/retornarMensagens', async function(req, res) {
    if (req.session.usuario) {
      const Mensagem = require('./classes/Mensagem')
      const mensagem = new Mensagem()
      let mensagens = await mensagem.buscar(req.session.usuario.email)
      mensagem.fechar()
      res.send(mensagens)
    }
  })

  app.listen(4000)
})()
