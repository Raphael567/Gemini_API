let currentQuestion = 0;
const totalQuestions = 10;
let correctAnswers = 0;
let quizActive = false;

async function fetchQuestion() {
    try {
        const promptResponse = await fetch("http://localhost:3000/prompt");
        if (!promptResponse.ok) throw new Error("Falha na requisição: " + promptResponse.status);
        const promptData = await promptResponse.json();

        const askUrl = `http://localhost:3000/ask?prompt=${encodeURIComponent(promptData.prompt)}`;
        const askResponse = await fetch(askUrl);
        if (!askResponse.ok) throw new Error("Falha na requisição: " + askResponse.status);
        return askResponse.json();
    } catch (error) {
        throw new Error('Erro ao buscar a pergunta: ' + error.message);
    }
}

async function displayNextQuestion() {
    try {
        const askData = await fetchQuestion();

        if (typeof askData.response !== 'string') {
            throw new Error('Formato inesperado na resposta da API');
        }

        let jsonString = askData.response.replace(/```json/g, '').replace(/```/g, '').trim();
        jsonString = cleanResponse(jsonString);
        const parsedData = parseJsonResponse(jsonString);

        const { materia, pergunta, alternativas } = parsedData;
        const respostaHtml = `
            <h3>${materia}</h3>
            <h3>${pergunta}</h3>
            <div class="alternative-buttons">
                ${alternativas.map((a, index) => `
                    <button 
                        onclick="handleAnswer(${a.correta})"
                        class="${a.correta ? 'correct' : 'incorrect'}"
                        id="answer-${index}"
                    >
                        ${a.alternativa}
                    </button>
                `).join('')}
            </div>
            <p>Pergunta ${currentQuestion + 1} de ${totalQuestions}</p>
        `;
        document.getElementById('response').innerHTML = respostaHtml;
    } catch (error) {
        document.getElementById('response').textContent = 'Erro: ' + error.message;
    }
}

function handleAnswer(correta) {
    if (correta) {
        correctAnswers++;
    }
    currentQuestion++;
    if (currentQuestion < totalQuestions) {
        displayNextQuestion();
    } else {
        finalMessage();
    }
}

function finalMessage() {
    stopTimer();
    const totalTime = document.getElementById('display').textContent;
    document.getElementById('response').innerHTML = `
        <h2>Quiz Completo!</h2>
        <p>Você acertou ${correctAnswers} de ${totalQuestions} perguntas.</p>
        <p>Tempo total: ${totalTime}</p>
    `;
    document.getElementById('timer-container').style.display = 'none';
    document.getElementById('startBtn').style.display = 'none';
    quizActive = false;
}

document.getElementById('apiForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (quizActive) {
        return;
    }
    quizActive = true;
    currentQuestion = 0;
    correctAnswers = 0;
    startTimer();
    displayNextQuestion();
});

function cleanResponse(response) {
    if (typeof response !== 'string') {
        throw new Error('Resposta não é uma string.');
    }
    return response.replace(/^\s*|\s*$/g, '').replace(/[\u0000-\u001F]/g, '');
}

function parseJsonResponse(response) {
    try {
        return JSON.parse(response);
    } catch (error) {
        throw new Error('Erro ao processar a resposta JSON: ' + error.message);
    }
}
