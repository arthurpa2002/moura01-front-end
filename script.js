const nacionalidadeSelect = document.querySelector('#nacionalidade-select');
const rgLabel = document.querySelector('#rg-label');
const rgInput = document.querySelector('#rg-input');
const passaporteLabel = document.querySelector('#passaporte-label');
const passaporteInput = document.querySelector('#passaporte-input');

nacionalidadeSelect.addEventListener("change", () => {
  if (nacionalidadeSelect.value !== "brasileiro(a)") {
    rgLabel.style.display = 'none';
    rgInput.style.display = 'none';
    passaporteLabel.style.display = 'block';
    passaporteInput.style.display = 'block';
  } else {
    rgLabel.style.display = 'block';
    rgInput.style.display = 'block';
    passaporteLabel.style.display = 'none';
    passaporteInput.style.display = 'none';
  }
});




//essa função de nome "adicionarPessoa" é para que quando o botão "Adicionar" for clicado, os dados do formulário sejam enviados para a API
async function adicionarPessoa(){
  const nome = document.querySelector('input[type="name"]').value;
  const dataNascimento = document.querySelector('input[type="date"]').value;
  const inativo = document.querySelector('input[type="checkbox"]').checked;
  const nacionalidade = document.querySelector('#nacionalidade-select').value;
  let rg = null;
  let passaporte = null;

  if (nacionalidade === 'brasileiro(a)') {
    rg = document.querySelector('#rg-input').value;
  } else if (nacionalidade !== 'brasileiro(a)'){
    passaporte = document.querySelector('#rg-input').value;
  }

  const formData = {
    nome: nome,
    dataNascimento: dataNascimento,
    inativo: inativo,
    nacionalidade: nacionalidade,
    rg: rg || passaporte, // Se rg for null, use o valor de passaporte
    passaporte: passaporte
  };

  
  
    try {
      const response = await fetch('https://localhost:7000/v1/Pessoa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        

          exibirPessoas ();
       
      } else {
        // console.error('Erro ao adicionar pessoa:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao adicionar pessoa:', error.message);
    }
  
}






//essa função de nome "limparFormulario" serve para que quando o botão "Adicionar" for clicado, os campos do formulário sejam limpos
function limparFormulario() {
  document.querySelector('input[type="name"]').value = '';
  document.querySelector('input[type="date"]').value = '';
  document.querySelector('input[type="checkbox"]').checked = false;
  document.querySelector('#nacionalidade-select').value = 'brasileiro(a)';
  document.querySelector('#rg-input').value = '';
}



// essa função é para que quando a página carregar, as pessoas cadastradas sejam exibidas na tela
 async function exibirPessoas() {

  let pessoas = [];

   try {
      const response = await fetch('https://localhost:7000/v1/Pessoa', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
       
      });

      if (response.ok) {
        const responseData = await response.json();
        pessoas = responseData;
        
      } else {
        console.error('Erro ao adicionar pessoa:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao adicionar pessoa:', error.message);
    }









//esse código a seguir é para que as pessoas cadastradas sejam exibidas na tela de forma dinâmica

const pessoasContainer = document.querySelector('#pessoas-container');
pessoasContainer.innerHTML = `
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Data de Nascimento</th>
        <th>Inativo</th>
        <th>Nacionalidade</th>
        <th>RG</th>
        <th>Passaporte</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
`;

pessoas.forEach((pessoa, index) => {
  const pessoaItem = document.createElement('tr');
//esse código é para criar uma linha na tabela para cada pessoa cadastrada

  const nomeCell = document.createElement('td');
  nomeCell.textContent = pessoa.nome;
  pessoaItem.appendChild(nomeCell);
  //esse código é para criar uma célula na linha da tabela para o nome da pessoa 

  const dataNascimentoCell = document.createElement('td');
  dataNascimentoCell.textContent = formataData(pessoa.dataNascimento);
  pessoaItem.appendChild(dataNascimentoCell);
  //esse código é para criar uma célula na linha da tabela para a data de nascimento da pessoa

  const inativoCell = document.createElement('td');
  inativoCell.textContent = pessoa.inativo ? 'Sim' : 'Não';
  pessoaItem.appendChild(inativoCell);
  //esse código é para criar uma célula na linha da tabela para o status da pessoa (se está ou não inativa)

  const nacionalidadeCell = document.createElement('td');
  nacionalidadeCell.textContent = pessoa.nacionalidade;
  pessoaItem.appendChild(nacionalidadeCell);
  //esse código é para criar uma célula na linha da tabela para a nacionalidade da pessoa

  const rgCell = document.createElement('td');
  rgCell.textContent = formataRg(pessoa.rg);
  pessoaItem.appendChild(rgCell);
//esse código é para criar uma célula na linha da tabela para o RG da pessoa

  const passaporteCell = document.createElement('td');
  passaporteCell.textContent = formataPassaporte(pessoa.passaporte);
  pessoaItem.appendChild(passaporteCell);
  //esse código é para criar uma célula na linha da tabela para o passaporte da pessoa

  const acoesCell = document.createElement('td');
  pessoaItem.appendChild(acoesCell);
  //esse código é para criar uma célula na linha da tabela para as ações que podem ser feitas com a pessoa

  const editarButton = document.createElement('button');
  editarButton.textContent = 'Editar';
  editarButton.onclick = () => editarPessoa(index);
  acoesCell.appendChild(editarButton);
  //esse código é para criar um botão de editar na célula de ações e associá-lo à função de editar pessoa

  const excluirButton = document.createElement('button');
  excluirButton.textContent = 'Excluir';
  excluirButton.onclick = () => excluirPessoa(index);
  //esse código é para criar um botão de excluir na célula de ações e associá-lo à função de excluir pessoa

  const acoesContainer = document.createElement('div');
  acoesContainer.style.display = 'flex';
  acoesContainer.appendChild(editarButton);
  acoesContainer.appendChild(excluirButton);
  acoesCell.appendChild(acoesContainer);
  //esse código é para que os botões de editar e excluir fiquem lado a lado na célula de ações

  pessoasContainer.querySelector('tbody').appendChild(pessoaItem);
});
}
















function formataRg(pValue, nacionalidade) {
  if (nacionalidade !== 'brasileiro(a)') {
    return '';
  }
  if (pValue === null) {
    return "Sem GR";
  }
  return pValue;
}

function formataPassaporte(pValue, nacionalidade) {
  if (nacionalidade === 'brasileiro(a)') {
    return '';
  }
  if (pValue === null) {
    return "";
  }
  return pValue;
}

// // In the exibirPessoas function:
// pessoas.forEach((pessoa, index) => {
//   // ...
//   const rgCell = document.createElement('td');
//   rgCell.textContent = formataRg(pessoa.rg, pessoa.nacionalidade);
//   pessoaItem.appendChild(rgCell);

//   const passaporteCell = document.createElement('td');
//   passaporteCell.textContent = formataPassaporte(pessoa.rg, pessoa.nacionalidade);
//   pessoaItem.appendChild(passaporteCell);
//   // este trecho acima é para criar uma célula na linha da tabela para o passaporte da pessoa
// });












function limparFormulario() {
  document.querySelector('input[type="name"]').value = '';
  document.querySelector('input[type="date"]').value = '';
  document.querySelector('input[type="checkbox"]').checked = false;
  document.querySelector('#nacionalidade-select').value = 'brasileiro(a)';
  document.querySelector('#rg-input').value = '';
}







let pessoaAtual;





function limparFormulario() {
  document.querySelector('input[type="name"]').value = '';
  document.querySelector('input[type="date"]').valueAsNumber = Date.now();
  document.querySelector('input[type="checkbox"]').checked = false;
  document.querySelector('#nacionalidade-select').value = 'brasileiro(a)';
  document.querySelector('#rg-input').value = '';
}

function excluirPessoa(index) {
  pessoas.splice(index, 1);
  exibirPessoas();
}

function editarPessoa(index) {
    pessoaAtual = index;
    const pessoa = pessoas[index];
    document.querySelector('input[type="name"]').value = pessoa.nome;
    document.querySelector('input[type="date"]').value = pessoa.dataNascimento;
    document.querySelector('input[type="checkbox"]').checked = pessoa.inativo;
    document.querySelector('#nacionalidade-select').value = pessoa.nacionalidade;
    document.querySelector('#rg-input').value = pessoa.rg;
    document.querySelector('button').textContent = 'Salvar';
    document.querySelector('button').setAttribute('onclick', 'salvarEdicao()');
}








function limparFormulario() {
  document.querySelector('input[type="name"]').value = '';
  document.querySelector('input[type="date"]').valueAsNumber = Date.now();
  document.querySelector('input[type="checkbox"]').checked = false;
  document.querySelector('#nacionalidade-select').value = 'brasileiro(a)';
  document.querySelector('#rg-input').value = '';
}

function excluirPessoa(index) {
  pessoas.splice(index, 1);
  exibirPessoas();
}

function editarPessoa(index) {
  pessoaAtual = pessoas[index];
  document.querySelector('#nome-input').value = pessoaAtual.nome;
  document.querySelector('#dataNascimento-input').value = pessoaAtual.dataNascimento;
  document.querySelector('#inativo-input').checked = pessoaAtual.inativo;
  document.querySelector('#nacionalidade-select').value = pessoaAtual.nacionalidade;
  document.querySelector('#rg-input').value = pessoaAtual.rg;
  document.querySelector('#editar-pessoa-container').style.display = 'block';
}

function pesquisarPessoa() {
  const searchTerm = document.querySelector('#search-input').value.toLowerCase();
  const filteredPessoas = pessoas.filter(pessoa => pessoa.nome.toLowerCase().includes(searchTerm));

  exibirPessoas(filteredPessoas);
}

function formataData(pdata) {
  if( pdata===null) {
    return "";
  } 
  var dataParte = pdata.split('T');
  return dataParte[0];
}

 function formataRg(pValue) {
  if( pValue===null) {
    return "";
  } 
  return pValue;
}

 function formataPassaporte(pValue) {
  if( pValue===null) {
    return "";
  } 
  return pValue;
}
