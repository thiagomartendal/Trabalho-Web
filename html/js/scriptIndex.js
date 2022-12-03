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
  let h4 = document.getElementById('msgNovaConta')
  novaConta.style.opacity = 0
  novaConta.style.transition = 'visibility 0s 0.5s, opacity 0.5s linear'
  novaConta.style.visibility = 'hidden'
  setTimeout(function() {
    nome.value = ''
    email.value = ''
    senha.value = ''
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
