// ==========================================
// üGURU — MEMORY CORE (MAPA ASTRAL)
// ==========================================

const MEMORY_KEY = "uguru_memory_v1";

export function loadMemory() {
    try {
        const data = localStorage.getItem(MEMORY_KEY);
        if (!data) return createEmptyMemory();
        return JSON.parse(data);
    } catch (e) {
        return createEmptyMemory();
    }
}

function createEmptyMemory() {
    return {
        nome: null,
        dataNascimento: null,
        horaNascimento: null,
        localNascimento: null,
        passoOnboarding: 0,
        interacoes: 0,
        emocaoPredominante: null,
        nivelVinculo: 0
    };
}

export function saveMemory(memory) {
    try {
        localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
    } catch (e) {
        console.error("Erro ao salvar mistério:", e);
    }
}

export function updateOnboarding(field, value) {
    const memory = loadMemory();
    memory[field] = value;
    memory.passoOnboarding += 1;
    saveMemory(memory);
    return memory;
}

export function getProfile() {
    const m = loadMemory();
    // Ajuste cirúrgico: Garante que nunca envie valores nulos para a API
    return {
        name: m.nome || "Iniciado",
        birthDate: m.dataNascimento || "01/01/2000",
        city: m.localNascimento || "Desconhecida",
        step: m.passoOnboarding || 0
    };
}

export function resetMemory() {
    localStorage.removeItem(MEMORY_KEY);
    location.reload();
}
