// Importando bibliotecas
const express = require('express'); // Framework NodeJS
const path = require('path'); // Biblioteca que permite a conexão entre arquivos
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Biblioteca do Germini
const fs = require('fs').promises; //Bibilioteca para leitura de arquivos

//Configurando variáveis de ambiente
require('dotenv').config();

// Servidor express
const app = express();

const port = process.env.SERVER_PORT;
const api_key = process.env.API_KEY
// Acessa minha chave de API como uma variável de ambiente
const genAI = new GoogleGenerativeAI(api_key);

// Indicando o caminho da pasta
app.use(express.static(path.join(__dirname, 'public')));

// Realizando conexão
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para gerar perguntas
app.get('/ask', async (req, res) => {
    try {
        // Modelo de IA da API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = req.query.prompt || "Olá Germini"; // Usar o valor do parâmetro prompt ou um padrão
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = await response.text();
        
        res.json({ response: text }); // Enviar resposta para o cliente em formato JSON
    } catch (e) {
        res.status(500).json({ error: "Erro ao se conectar com a API: ", message: e.message }); // Enviar erro para o cliente
    }
});

// Endpoint para a leitura do prompt
app.get('/prompt', async (req, res) => {
    try {
        const caminhoArquivo = path.join(__dirname, 'prompt.txt');
        const data = await fs.readFile(caminhoArquivo, 'utf-8');
        res.json({ prompt: data });
    } catch (e) {
        res.status(500).json({ error: "Erro ao ler o arquivo", message: e.message });
    }
});

// Conexão bem sucedida
app.listen(port, () => {
    console.info(
        `
         ####   #######   ##   ##   ####    ##   ##   ####               ##     ######    ####
        ##  ##   ##   #   ### ###    ##     ###  ##    ##               ####     ##  ##    ##
       ##        ## #     #######    ##     #### ##    ##              ##  ##    ##  ##    ##
       ##        ####     #######    ##     ## ####    ##              ##  ##    #####     ##
       ##  ###   ## #     ## # ##    ##     ##  ###    ##              ######    ##        ##
        ##  ##   ##   #   ##   ##    ##     ##   ##    ##              ##  ##    ##        ##
         #####  #######   ##   ##   ####    ##   ##   ####             ##  ##   ####      ####      
        `
    );

    console.info(`Servidor rodando em http://localhost:${port}`);
});

