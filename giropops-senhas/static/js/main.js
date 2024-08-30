"use strict";

function showSenha() {
  const input = document.getElementById("senha");
  const senhaIcon = document.getElementById("senha-icon");
  if (input.attributes.type.nodeValue == "password") {
    input.setAttribute("type", "text");
    senhaIcon.innerText = "visibility_off";
  } else {
    input.setAttribute("type", "password");
    senhaIcon.innerText = "visibility";
  }
}
function showSenhaPorId(id) {
  console.log(id);
  const input = document.getElementById("senha-" + id);
  const senhaIcon = document.getElementById("senha-icon-" + id);
  if (input.attributes.type.nodeValue == "password") {
    input.setAttribute("type", "text");
    senhaIcon.innerText = "visibility_off";
  } else {
    input.setAttribute("type", "password");
    senhaIcon.innerText = "visibility";
  }
}
function copiarParaAreaDeTransferencia() {
  const senhaElemento = document.getElementById("senha");
  navigator.clipboard.writeText(senhaElemento.value).then(
    () => {
      alert("Senha copiada para a área de transferência!");
    },
    (err) => {
      alert("Não foi possível copiar a senha: " + err);
    }
  );
}

function copiarParaAreaDeTransferenciaPorId(id) {
  const senhaElemento = document.getElementById("senha-" + id);
  navigator.clipboard.writeText(senhaElemento.value).then(
    () => {
      alert("Senha copiada para a área de transferência!");
    },
    (err) => {
      alert("Não foi possível copiar a senha: " + err);
    }
  );
}

function toggleUsuarios() {
  const listaUsuariosContainer = document.getElementById(
    "lista-usuarios-container"
  );
  listaUsuariosContainer.classList.toggle("hidden");
}
function buscarUltimasSenhas() {
  navigation.reload();
}

function limparTodasAsSenhas() {
  const confirmacao = confirm("Tem certeza que deseja apagar todas as senhas salvas?");
  
  if (confirmacao) {
    fetch(`/apagar_todas_senhas`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        document.getElementById('lista-senhas').innerHTML = '';
        mostrarToast("Todas as senhas foram apagadas!");
      } else {
        mostrarToast("Não foi possível apagar as senhas.");
      }
    })
    .catch(error => {
      mostrarToast("Erro ao apagar as senhas: " + error);
    });
  }
}



