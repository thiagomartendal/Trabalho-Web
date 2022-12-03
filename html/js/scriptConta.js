let usuarioAtual

function boasVindas() {
  fetch('/usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => {
    let h1 = document.getElementById('boas-vindas')
    res.json().then((val) => {
      h1.innerHTML += val.nome
      usuarioAtual = val.email
    })
  })
}

function exibirLightbox() {
  let lightbox = document.getElementById('lightbox')
  lightbox.classList.add('show')
}

function esconderLightbox() {
  let lightbox = document.getElementById('lightbox')
  lightbox.classList.remove('show')
}

function busca() {
  let valorBusca = document.querySelector('input[name="valor-busca"]')
  const dados = {
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valorBusca: valorBusca.value
    })
  }
  if (valorBusca.value != '') {
    let resultados = document.getElementById('resultados')
    resultados.innerHTML = ''
    const resultado = fetch('/busca', dados)
    resultado.then(res => {
      return res.json()
    }).then(res => {
      if (res) {
        res.forEach(item => {
          resultados.innerHTML += '<input type="button" value="' + item.nome + '" class="btn largura-botao" onclick="iniciarConversa(\'' + item.nome + '\',\'' + item.email + '\')" />'
        })
      }
    })
  }
}

let usuarioConversa

function iniciarConversa(nome, email) {
  usuarioConversa = email
  let conversa = document.getElementById('conversa')
  let titulo = document.getElementById('titulo')
  if (conversa.classList.contains('show')) {
    conversa.classList.remove('show')
  }
  conversa.classList.add('show')
  titulo.innerHTML = nome + ' - ' + email
  exibirMensagens()
}

function encerrarConversa() {
  conversa.classList.remove('show')
  clearInterval(atualizacaoMsg)
}

function nl2br(str, is_xhtml) { // Função para adicionar quebra de linha na mensagem
    if (typeof str === 'undefined' || str === null) {
        return ''
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? ' <br /> ' : ' <br> '
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
}

function enviarMensagem() {
  let msg = document.querySelector('textarea[name="mensagem"]')
  if (msg.value != '') {
    let msgFormatada = nl2br(msg.value)
    const dados = {
      method: 'POST',
      mode: 'cors',
      cache: 'default',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailDestinatario: usuarioConversa,
        msg: msgFormatada
      })
    }
    fetch('/enviarMensagem', dados)
    msg.value = ''
  }
}

function exibirMensagens() {
  pesquisarMensagens()
  atualizacaoMsg = setInterval(function() {
    pesquisarMensagens()
  }, 500)
}

function pesquisarMensagens() {
  fetch('/retornarMensagens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => {
    return res.json()
  }).then(res => {
    let divMensagens = document.getElementById('mensagens')
    divMensagens.innerHTML = ''
    res.forEach(item => {
      if (item.email_usuario_remetente == usuarioAtual && item.email_usuario_destinatario == usuarioConversa) {
        divMensagens.innerHTML += '<div class="linhaMsg1"><div class="msg1">' + item.mensagem + '</div></div>'
      }
      if (item.email_usuario_remetente == usuarioConversa && item.email_usuario_destinatario == usuarioAtual) {
        divMensagens.innerHTML += '<div class="linhaMsg2"><div class="msg2">' + item.mensagem + '</div></div>'
      }
    })
  })
}
