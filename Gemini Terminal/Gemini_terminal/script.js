
//Importando bibliotecas
const express = require('express'); //Framework NodeJS
const path = require('path'); //Biblioteca que permite a conexão entre arquivos
const { GoogleGenerativeAI } = require("@google/generative-ai"); //Biblioteca do Germini
const readline = require('readline');
const { clear } = require('console');

//Configurando variáveis de ambiente
require('dotenv').config();

//Servidor express
const app = express();

const port = process.env.SERVER_PORT;
const api_key = process.env.API_KEY;

//Acessa minha chave de API como uma variável de ambiente
const genAI = new GoogleGenerativeAI(api_key);

//Modelo de IA da API
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

//Indicando o caminho da pasta
app.use(express.static(path.join(__dirname, 'public')));

//Realizando conexão
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Conexão bem sucedida
app.listen(port, () => {
    //console.info(`Servidor rodando em http://localhost:${port}`);
});

//Permitir a entrada de dados
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function clearPrompt() {
    process.stdout.write('\033c');
}

async function question() {
    while (true) {

        const prompt = await new Promise((resolve) => {
            rl.question('\n[YOU] ', (input) => {
                resolve(input);
            });
        });

        if (prompt.toLowerCase() === "sair") {
            clearPrompt();
            console.log("\nEncerrado\n");
            process.exit(0);
        }

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = await response.text();
        console.log(`\n[GERMINI] ${text}`);
    
    }

    rl.close();
}

//Programa principal
async function main() {

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

    console.log('\nConverse com o Germini ou digite "sair" para encerrar.\n');

    question();
}

main();