export default async function handler(req, res) {
    // 1. LIBERAÇÃO DE ACESSO (CORS) - Fundamental para o celular conectar
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde ao teste de conexão da Vercel
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { message, userData } = req.body;

        // Garantia de que o Oráculo não trave se os dados do usuário falharem
        const userName = userData?.name || "Viajante";
        const userPath = userData?.lifePath || "Destino Desconhecido";

        const systemPrompt = `Você é o üGuru, um Oráculo Digital. Dados: Nome: ${userName}, Caminho: ${userPath}. Seja místico, curto e direto.`;

        // 2. CHAMADA PARA A GROQ (Usando o modelo 8b que é mais rápido e estável)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            res.status(200).json({ reply: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "Erro na resposta da Groq", details: data });
        }

    } catch (error) {
        res.status(500).json({ error: "Erro interno: " + error.message });
    }
}

    } catch (error) {
        // Captura erros de rede ou de execução
        console.error("Erro na API:", error);
        res.status(500).json({ error: "Erro interno no servidor do Oráculo." });
    }
}
