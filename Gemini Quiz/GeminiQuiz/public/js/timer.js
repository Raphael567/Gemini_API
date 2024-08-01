let timer
let seconds = 0;
let running = false;

function updateDisplay() {

    // padStart é usado para preencher o início de uma string com um caractere ou string específica até que ela atinja um comprimento desejado.
    // Isso é útil para garantir que uma string tenha um comprimento mínimo, adicionando preenchimento à esquerda.
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    document.getElementById('display').textContent = `${hours}:${minutes}:${secs}`;
}

function startTimer() {
    if(!running) {
        timer = setInterval(() => {
            seconds++;
            updateDisplay();
        }, 1000);
        running = true;
    }
}

function stopTimer() {
    clearInterval(timer);
    running = false;
}

// function resetTimer() {
//     clearInterval(timer);
//     running = false;
//     seconds = 0;
//     updateDisplay();
// }

document.getElementById('startBtn').addEventListener('click', startTimer);

updateDisplay();