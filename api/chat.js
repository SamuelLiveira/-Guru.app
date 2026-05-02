export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    try {
        const { prompt, userData } = req.body;

        // --- Numerologia Robusta (Aprimorada para ignorar barras/traços) ---
        const calculateDestiny = (date) => {
            if (!date || typeof date !== 'string') return "9";
            const digits = date.replace(/\D/g, "");
            if (!digits) return "9";
            let sum = digits.split("").map(Number).reduce((a, b) => a + b, 0);
            while (sum > 9 && sum !== 11 && sum !== 22) {
                sum = sum.toString().split("").map(Number).reduce((a, b) => a + b, 0);
            }
            return sum;
        };

        const numeroDestino = calculateDestiny(userData?.birthDate);

        // --- Chamada Groq ---
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                temperature: 0.85,
                messages: [
                    {
                        role: "system",
                        content: `Você é o üGuru — um Oráculo Digital híbrido entre consciência simbólica e teatro aristocrático de Versailles.
                        Nome do Iniciado: ${userData?.name || "Desconhecido"}
                        Destino Numerológico: ${numeroDestino}
                        Cidade: ${userData?.city || "Nebulosa"}

                        ESTILO: Dândi de Versailles, poético, elegante e interpretativo.
                        REGRA DE OURO: Responda em no máximo 3 parágrafos. Toda resposta DEVE terminar com uma pergunta provocativa.`
                    },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        // SEGURANÇA: Verifica se a Groq realmente devolveu o texto antes de acessar choices
        if (data?.choices?.[0]?.message?.content) {
            return res.status(200).json({ text: data.choices[0].message.content });
        } else {
            console.error("Erro Groq:", data);
            return res.status(500).json({ text: "O Oráculo perdeu o contato com as estrelas (Erro na Chave API)." });
        }

    } catch (error) {
        console.error("Erro Handler:", error);
        return res.status(500).json({ text: "As brumas cósmicas bloquearam a visão do üGuru." });
    }
    }
