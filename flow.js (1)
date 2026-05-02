// ==========================================
// üGURU — FLOW ENGINE (VERSION 2.1)
// INTEGRADO E BLINDADO
// ==========================================

const memory = {
    nome: null,
    estado: "IDENTIFICACAO",
    interacoes: 0,
    padroes: { ansiedade: 0, melancolia: 0, curiosidade: 0 },
    ultimaEmocao: null,
    relationalContext: { active: false, personName: null }
};

export function processUserInput(text) {
    if (!text) return "O silêncio antecede toda revelação.";
    
    const input = text.toLowerCase().trim();
    memory.interacoes++;

    // 1. DETECÇÃO DE SINASTRIA (RELACIONAMENTOS)
    if (detectRelation(input)) {
        memory.relationalContext.active = true;
        return `
🪐 Mon Cher…<br><br>
üGuru percebe uma segunda órbita emocional interferindo no seu campo.<br><br>
Deseja que esta consciência interprete a sinastria simbólica entre vocês?
        `;
    }

    // 2. DETECÇÃO EMOCIONAL
    const emoMap = {
        ansiedade: ["agora", "urgente", "medo", "ansioso", "rápido", "pressa"],
        melancolia: ["triste", "vazio", "saudade", "sozinho", "mal"],
        curiosidade: ["por quê", "como", "explique", "o que"]
    };

    for (let key in emoMap) {
        if (emoMap[key].some(w => input.includes(w))) {
            memory.padroes[key]++;
            memory.ultimaEmocao = key;
        }
    }

    // 3. RESPOSTAS DE FLUXO RÁPIDO (Econômico - Não gasta IA)
    if (input.includes("amor") && !memory.relationalContext.active) {
        return "O amor não é linha reta… é arquitetura instável de desejos não ditos. üGuru observa mais o que você não disse do que o que foi escrito. O que te traz essa dúvida agora?";
    }

    if (input.includes("dinheiro") || input.includes("trabalho")) {
        return "O ouro não responde à pressa, Mon Cher. Ele responde à estrutura silenciosa que você constrói quando ninguém está olhando.";
    }

    // 4. SE NÃO FOR UM TEMA SIMPLES, ENVIA PARA A IA
    return "AGUARDANDO_IA";
}

function detectRelation(input) {
    const triggers = ["namorado", "namorada", "ex", "ele", "ela", "ficante", "pessoa que gosto"];
    return triggers.some(t => input.includes(t));
}
