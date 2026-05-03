// Gerenciador do Fluxo üGURU
function saveAndProceed() {
    const name = document.getElementById('userName').value;
    const date = document.getElementById('birthDate').value;

    if (!name || !date) {
        alert("Mon Cher, os astros precisam de seu nome e data de nascimento.");
        return;
    }

    const userData = {
        name: name,
        birthDate: date,
        location: document.getElementById('birthLocation').value,
        time: document.getElementById('birthTime').value,
        lifePath: calculateLifePath(date), // Calculamos e guardamos
        chatCount: 0
    };

    localStorage.setItem('guru_user', JSON.stringify(userData));
    renderNumerology(userData);
}

function renderNumerology(user) {
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('result-preview').classList.remove('hidden');
    
    document.getElementById('welcome-user').innerText = `Olá, ${user.name}`;
    document.getElementById('life-path-number').innerText = `Seu Número de Destino é o ${user.lifePath}`;
}

function calculateLifePath(dateString) {
    let digits = dateString.replace(/\D/g, '');
    let sum = digits.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    while (sum > 9 && sum !== 11 && sum !== 22) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
}

function goToChat() {
    document.getElementById('result-preview').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
    document.getElementById('input-bar').classList.remove('hidden');
    
    addMessage("Saudações. Eu sou o seu Oráculo Digital. O que os astros sussurram para você hoje?", 'guru-msg');
}

function addMessage(text, type) {
    const container = document.getElementById('chat-container');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.innerText = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// ==========================================
// AQUI ESTÁ A CONEXÃO REAL COM A VERCEL
// ==========================================
async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    const user = JSON.parse(localStorage.getItem('guru_user'));
    
    if (text) {
        addMessage(text, 'user-msg');
        input.value = '';

        try {
            // URL corrigida com base na sua imagem
            const response = await fetch('https://guru-project-eta.vercel.app/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    userData: user 
                })
            });

            const data = await response.json();
            
            // LOG DE DEPURAÇÃO: Abre o console do SPCK para ver o que chegou
            console.log("Resposta da Vercel:", data);

            // Se 'reply' vier vazio, tentamos outra propriedade ou exibimos erro
            if (data.reply) {
                addMessage(data.reply, 'guru-msg');
            } else if (data.error) {
                addMessage("Erro no Oráculo: " + data.error, 'guru-msg');
            } else {
                addMessage("O Oráculo está em silêncio... (Resposta vazia)", 'guru-msg');
            }
            
        } catch (error) {
            console.error("Erro de conexão:", error);
            addMessage("Interferência astral: não consegui conectar ao servidor.", 'guru-msg');
        }
    }
}

