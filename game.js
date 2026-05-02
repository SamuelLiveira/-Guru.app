// ==========================================
// üGURU — GAME ENGINE (MOTOR PRINCIPAL - REVISADO)
// ==========================================
import { processUserInput } from "./flow.js";
import { loadMemory, updateOnboarding, getProfile } from "./memory.js";

const chatContainer = document.getElementById("chat-container");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const perguntas = [
    "Como este Oráculo deve chamá-lo, caro Iniciado?",
    "Em que dia, mês e ano as estrelas testemunharam seu surgimento? (Ex: 15/05/1995)",
    "E em que hora e minuto os céus se abriram? (Ex: 14:30)",
    "Por fim, diga ao üGuru: em qual Cidade, Estado e País você nasceu?"
];

// Inicia o sistema
init();

function init() {
    if (!chatContainer || !input || !sendBtn) return;
    
    const memory = loadMemory();
    
    setTimeout(() => {
        // Correção: Garantir que pegamos o nome certo da memória
        if (memory.passoOnboarding < 4) {
            addGuruMessage(perguntas[memory.passoOnboarding]);
        } else {
            addGuruMessage(`Bom reencontrá-lo, Iniciado ${memory.nome || "Mon Cher"}. O que os céus revelam hoje?`);
        }
    }, 800);

    sendBtn.addEventListener("click", handleSend);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });
    input.focus();
}

async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = "";

    // Recarrega a memória a cada envio para manter sincronia
    let memory = loadMemory();

    // 1. FASE DE ONBOARDING
    if (memory.passoOnboarding < 4) {
        const fields = ["nome", "dataNascimento", "horaNascimento", "localNascimento"];
        const currentField = fields[memory.passoOnboarding];
        
        // Salva e atualiza o estado
        memory = updateOnboarding(currentField, text);

        setTimeout(() => {
            if (memory.passoOnboarding < 4) {
                addGuruMessage(perguntas[memory.passoOnboarding]);
            } else {
                addGuruMessage(`Gratidão, Mon Cher ${memory.nome}. Os astros agora sussurram para o üGuru. O que deseja saber?`);
            }
        }, 1000);
        return;
    }

    // 2. FASE DE CHAT (FLOW + IA)
    const flowResponse = processUserInput(text);

    if (flowResponse === "AGUARDANDO_IA") {
        addTyping();
        try {
            const profile = getProfile();
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    prompt: text, 
                    userData: profile // Integrado com o getProfile do memory.js
                })
            });
            
            if (!res.ok) throw new Error("Falha na conexão astral");
            
            const data = await res.json();
            removeTyping();
            addGuruMessage(data.text);
        } catch (err) {
            removeTyping();
            addGuruMessage("As brumas do silêncio falharam… verifique sua conexão com o além.");
        }
    } else {
        setTimeout(() => addGuruMessage(flowResponse), 600);
    }
}

// =========================
// UI HELPERS
// =========================
function addGuruMessage(text) {
    const div = document.createElement("div");
    div.className = "message guru-msg";
    chatContainer.appendChild(div);
    
    let i = 0;
    // Removido o scroll de dentro do loop para performance, 
    // ele acontece agora apenas quando necessário.
    const timer = setInterval(() => {
        if (i < text.length) {
            div.innerHTML += text.charAt(i);
            i++;
            // Scroll suave a cada letra
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
            clearInterval(timer);
        }
    }, 20); // Um pouco mais rápido para não cansar o usuário
}

function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "message user-msg";
    div.textContent = text;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addTyping() {
    // Evita duplicar o indicador de digitação
    if (document.getElementById("typing")) return;

    const div = document.createElement("div");
    div.id = "typing";
    div.className = "message guru-msg typing-indicator";
    div.innerHTML = "<span></span><span></span><span></span>"; 
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById("typing");
    if (el) el.remove();
}
