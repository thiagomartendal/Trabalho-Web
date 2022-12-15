function exibirNovaConta() {
  let novaConta = document.getElementById('novaConta')
  novaConta.style.visibility = 'visible'
  novaConta.style.transition = 'visibility 0s, opacity 0.5s linear'
  novaConta.style.opacity = 1
}

function esconderNovaConta() {
  let novaConta = document.getElementById('novaConta')
  let nome = document.querySelector('input[name="nome-conta"]')
  let email = document.querySelector('input[name="email-conta"]')
  let senha = document.querySelector('input[name="senha-conta"]')
  let confirmarSenhaConta = document.querySelector('input[name="confirmar-senha-conta"]')
  let h4 = document.getElementById('msgNovaConta')
  novaConta.style.opacity = 0
  novaConta.style.transition = 'visibility 0s 0.5s, opacity 0.5s linear'
  novaConta.style.visibility = 'hidden'
  setTimeout(function() {
    nome.value = ''
    email.value = ''
    senha.value = ''
    confirmarSenhaConta.value = ''
    h4.innerHTML = ''
  }, 500)
}

function envioNovaConta() {
  let nome = document.querySelector('input[name="nome-conta"]')
  let email = document.querySelector('input[name="email-conta"]')
  let senha = document.querySelector('input[name="senha-conta"]')
  let valNome = nome.value
  let valEmail = email.value
  let valSenha = senha.value
  fetch('/novaConta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nomeConta: valNome,
      emailConta: valEmail,
      senhaConta: valSenha
    })
  }).then(res => {
    res.json().then((val) => {
      let h4 = document.getElementById('msgNovaConta')
      if (!val.situacaoCadastro) {
        h4.innerHTML = 'O email ' + email.value + ' já está em uso.'
        nome.value = valNome
        email.value = valEmail
        senha.value = valSenha
      } else {
        h4.innerHTML = 'Cadastro realizado com sucesso.'
        setTimeout(function() {
          esconderNovaConta()
        }, 3000)
      }
    })
  })
}

function checarLogin() {
  let h4 = document.getElementById('msgLogin')
  fetch('/falhaLogin', {
    method: 'POST',
  	headers: {
  		'Content-Type': 'application/json',
  	}
  }).then(res => {
    res.json().then((val) => {
      if (val.falhaLogin) {
        h4.innerHTML = 'Email ou senha incorretos.'
      }
    })
  })
}

function validaLogin() {
  let emailLogin = document.querySelector('input[name="email-login"]')
  let senhaLogin = document.querySelector('input[name="senha-login"]')
  let entrar = document.querySelector('input[value="Entrar"]')
  if (emailLogin.value != "" && senhaLogin.value != "" && emailLogin.value.includes("@")) {
    entrar.classList.remove("btn-dst");
    entrar.classList.add("btn");
    entrar.disabled = false
  } else {
    entrar.classList.remove("btn");
    entrar.classList.add("btn-dst");
    entrar.disabled = true
  }
}

function validaNovaConta() {
  let nomeConta = document.querySelector('input[name="nome-conta"]')
  let emailConta = document.querySelector('input[name="email-conta"]')
  let senhaConta = document.querySelector('input[name="senha-conta"]')
  let confirmarSenhaConta = document.querySelector('input[name="confirmar-senha-conta"]')
  let criarConta = document.querySelector('input[value="Criar Conta"]')
  if (nomeConta.value != "" && emailConta.value != "" && senhaConta.value != "" && confirmarSenhaConta.value != "") {
    let h4 = document.getElementById('msgNovaConta')
    let dadosCorretos = false
    if (emailConta.value.includes("@")) {
      h4.innerHTML = ''
      if (senhaConta.value != confirmarSenhaConta.value) {
        h4.innerHTML = 'As senhas digitadas são diferentes.'
        dadosCorretos = false
      } else {
        h4.innerHTML = ''
        dadosCorretos = true
      }
    } else {
      h4.innerHTML = 'O email deve conter @.'
      dadosCorretos = false
    }
    if (dadosCorretos) {
      criarConta.classList.remove("btn-dst");
      criarConta.classList.add("btn");
      criarConta.disabled = false
    } else {
      criarConta.classList.remove("btn");
      criarConta.classList.add("btn-dst");
      criarConta.disabled = true
    }
  } else {
    criarConta.classList.remove("btn");
    criarConta.classList.add("btn-dst");
    criarConta.disabled = true
  }
}
