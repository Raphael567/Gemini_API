document.getElementById('apiForm').addEventListener('submit', function(event){
    event.preventDefault(); //evita o envio do formulário padrão

    const prompt = document.getElementById('prompt').value;
    const url = `http://localhost:3000/ask?prompt=${encodeURIComponent(prompt)}`;

    fetch(url)
        .then(response => response.json())
        .then(data =>{
            document.getElementById('response').textContent = data.response;
        })
        .catch(error => {
            document.getElementById('response').textContent = 'Erro' + error;
        });
});