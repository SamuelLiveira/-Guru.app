export default async function handler(req, res) {
    // 1. Configurações de Segurança (CORS)
    // Permite que o seu app se comunique com a API sem bloqueios
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

    try {
        const { prompt, contexto } = req.body;

        // 2. Chamada para a Groq API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // O modelo mais potente e rápido
                temperature: 0.85,                // Criatividade na medida certa
                max_tokens: 1000,
                messages: [
                    { 
                        role: "system", 
                        content: `Você é o üGuru, uma inteligência mística com a estética Dandy de Versailles.
                        Personalidade: Erudito, sofisticado, misterioso e acolhedor.
                        Regra de Ouro: Fale SEMPRE na terceira pessoa. Use termos como 'Iniciado' ou 'Mon Cher'.
                        Contexto do Usuário: ${JSON.stringify(contexto)}.
                        Objetivo: Transmutar dados astronômicos e numerológicos em conselhos de elite.` 
                    },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        // 3. Retorno da Resposta
        return res.status(200).json({
            text: data?.choices?.[0]?.message?.content || "O Oráculo mergulhou em silêncio profundo..."
        });

    } catch (error) {
        console.error("Erro na API:", error);
        return res.status(500).json({ error: "As estrelas se alinharam de forma confusa. Tente novamente." });
    }
}
