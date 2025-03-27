const express = require('express');
const cepPromise = require('cep-promise');

const app = express();
const port = 3000;


const cors = require('cors');
app.use(cors());


app.get('/consultar-cep/:cep', async (req, res) => {
    const { cep } = req.params;
  
    try {
        const dados = await cepPromise(cep);
        console.log(dados); 
        res.json(dados);
    } catch (erro) {
        res.status(400).json({ error: erro.message });
    }
});

  
async function consultarCep() {
    const cep = document.getElementById('cep').value;

    if (!cep) {
        alert('Por favor, digite um CEP.');
        return;
    }

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = 'Consultando...';

    try {
        const response = await fetch(`http://localhost:3000/consultar-cep/${cep}`);
        if (!response.ok) {
            throw new Error('CEP não encontrado');
        }

        const dados = await response.json();

        // Verifique se os dados existem
        if (!dados.cep) {
            throw new Error('Não foi possível encontrar o CEP');
        }

        resultadoDiv.innerHTML = `
            <strong>CEP:</strong> ${dados.cep || 'Não encontrado'}<br>
            <strong>Logradouro:</strong> ${dados.logradouro || 'Não encontrado'}<br>
            <strong>Bairro:</strong> ${dados.bairro || 'Não encontrado'}<br>
            <strong>Cidade:</strong> ${dados.localidade || 'Não encontrado'}<br>
            <strong>Estado:</strong> ${dados.uf || 'Não encontrado'}
        `;
    } catch (erro) {
        resultadoDiv.innerHTML = `<span style="color: red;">Erro: ${erro.message}</span>`;
    }
}


app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
