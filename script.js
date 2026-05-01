const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Memória local do Iniciado
let dadosUsuario = JSON.parse(localStorage.getItem('dados_uguru')) || {
    nome: null,
    data: null,
    hora: null,
    local: null, // Cidade, Estado, País
    passo: 0 // Controle do Onboarding
};

// --- FUNÇÕES DE INTERAÇÃO ---

function adicionarMensagem(texto, autor) {
    const div = document.createElement('div');
    div.className = `message ${autor}-msg`;
    chatContainer.appendChild(div);
    
    if (autor === 'guru') {
        escreverLetraPorLetra(div, texto);
    } else {
        div.innerText = texto;
    }
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function escreverLetraPorLetra(elemento, texto) {
    let i = 0;
    const velocidade = 35; 
    const timer = setInterval(() => {
        if (i < texto.length) {
            elemento.innerHTML += texto.charAt(i);
            i++;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
            clearInterval(timer);
        }
    }, velocidade);
}

// --- LÓGICA DE COLETA (ONBOARDING) ---

const perguntas = [
    "Como este Oráculo deve chamá-lo, caro Iniciado?",
    "Em que dia, mês e ano as estrelas testemunharam seu surgimento? (Ex: 15/05/1995)",
    "E em que hora e minuto os céus se abriram? (Ex: 14:30)",
    "Por fim, diga ao üGuru: em qual Cidade, Estado e País você nasceu?"
];

async function processarFluxo() {
    const msg = userInput.value.trim();
    if (!msg) return;

    adicionarMensagem(msg, 'user');
    userInput.value = "";

    // Se o Onboarding ainda não terminou
    if (dadosUsuario.passo < 4) {
        if (dadosUsuario.passo === 0) dadosUsuario.nome = msg;
        else if (dadosUsuario.passo === 1) dadosUsuario.data = msg;
        else if (dadosUsuario.passo === 2) dadosUsuario.hora = msg;
        else if (dadosUsuario.passo === 3) dadosUsuario.local = msg;

        dadosUsuario.passo++;
        localStorage.setItem('dados_uguru', JSON.stringify(dadosUsuario));

        if (dadosUsuario.passo < 4) {
            setTimeout(() => adicionarMensagem(perguntas[dadosUsuario.passo], 'guru'), 1000);
        } else {
            setTimeout(() => adicionarMensagem(`Gratidão, Mon Cher ${dadosUsuario.nome}. Os astros de ${dadosUsuario.local} agora sussurram para o üGuru. O que deseja saber?`, 'guru'), 1000);
        }
    } else {
        // Chat livre com a API
        chamarOraculo(msg);
    }
}

// --- CONEXÃO COM A API (VERCEL) ---

async function chamarOraculo(pergunta) {
    const guruDiv = document.createElement('div');
    guruDiv.className = "message guru-msg";
    chatContainer.appendChild(guruDiv);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: pergunta,
                contexto: dadosUsuario
            })
        });

        const data = await response.json();
        escreverLetraPorLetra(guruDiv, data.text);

    } catch (error) {
        guruDiv.innerText = "As brumas do tempo impedem minha visão. Verifique sua conexão.";
    }
}

// --- EVENTOS ---

sendBtn.addEventListener('click', processarFluxo);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processarFluxo();
});

// Mensagem Inicial baseada no progresso
window.onload = () => {
    if (dadosUsuario.passo < 4) {
        adicionarMensagem(perguntas[dadosUsuario.passo], 'guru');
    } else {
        adicionarMensagem(`Bom reencontrá-lo, Iniciado ${dadosUsuario.nome}. O que os céus revelam hoje?`, 'guru');
    }
};
