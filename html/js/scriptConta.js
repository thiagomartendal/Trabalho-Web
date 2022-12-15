let idUsuarioAtual

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
      idUsuarioAtual = val.id
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

function editarUsuario() {
  let novoNome = document.querySelector('input[name="novo-nome"]')
  let email = document.querySelector('input[name="email-usuario"]')
  let novaSenha = document.querySelector('input[name="nova-senha"]')
  let confirmacaoSenha = document.querySelector('input[name="confirmacao-nova-senha"]')

  let valNovoNome = novoNome.value
  let valEmail = email.value
  let valNovaSenha = novaSenha.value
  let valConfirmacaoSenha = confirmacaoSenha.value

  fetch('/editaUsuario', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      novoNome: valNovoNome,
      email: valEmail,
      novaSenha: valNovaSenha,
      id: idUsuarioAtual
    })
  }).then(res => {
    res.json().then((val) => {
      let h4 = document.getElementById('mensagemEdicao')
      if (!val.cadastroEditado) {
        h4.innerHTML = 'Erro ao editar perfil'
      } else {
        h4.innerHTML = 'Perfil editado com sucesso!'
        setTimeout(function() {
          esconderLightbox()
        }, 3000)
      }
    })
  })

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
  if (document.body.offsetWidth < 768) {
    let painelCentral = document.getElementById('painel-central')
    if (painelCentral.classList.contains('show')) {
      painelCentral.classList.remove('show')
    }
    painelCentral.classList.add('show')
  }
  titulo.innerHTML = nome + ' - ' + email
  exibirMensagens()
  console.log()
}

function encerrarConversa() {
  let conversa = document.getElementById('conversa')
  conversa.classList.remove('show')
  if (document.body.offsetWidth < 768) {
    let painelCentral = document.getElementById('painel-central')
    painelCentral.classList.remove('show')
  }
  clearInterval(atualizacaoMsg)
}

function atualizarPainelMsg() {
  let conversa = document.getElementById('conversa')
  if (document.body.offsetWidth < 768 && conversa.classList.contains('show')) {
    let painelCentral = document.getElementById('painel-central')
    if (painelCentral.classList.contains('show')) {
      painelCentral.classList.remove('show')
    }
    painelCentral.classList.add('show')
  }
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
    },
    body: JSON.stringify({
        emailDestinatario: usuarioConversa,
    })
    
  }).then(res => {
    return res.json()
  }).then(res => {
    let divMensagens = document.getElementById('mensagens')
    divMensagens.innerHTML = ''
    res.forEach(mensagem => {
      if (mensagem.id_usuario_remetente == idUsuarioAtual) {
        divMensagens.innerHTML += '<div class="linhaMsg2"><div class="msg2">' + mensagem.mensagem + '</div></div>'
      }
      else {
        divMensagens.innerHTML += '<div class="linhaMsg1"><div class="msg1">' + mensagem.mensagem + '</div></div>'
      }
    })
  })
}
