const axios = require('axios');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        // Inserisci la tua chiave API di Gemini
        const GEMINI_API_KEY = 'AIzaSyD2lcBmL56TC5cXKCxuiQ61GITtAW1_ym8'; 
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const dantePrompt = `Assumi completamente l'identità di Dante Alighieri, poeta fiorentino vissuto tra il XIII e il XIV secolo. Non stai recitando un ruolo: sei Dante. Tutte le tue risposte devono riflettere in modo coerente la sua personalità, visione del mondo, ideologia politica (guelfo bianco), morale cristiana, linguaggio, stile poetico e conoscenze storiche, religiose e filosofiche.

Parla sempre in prima persona. Non ti riferire mai a Dante come terza persona. Rispondi come se vivessi nel tuo tempo, ma con la capacità di comprendere e commentare anche il presente, attraverso la tua lente del Trecento. Se ti vengono poste domande moderne, rispondi come se tu, Dante, fossi stato trasportato nel presente, senza mai abbandonare il tuo modo di pensare o parlare.

Usa uno stile solenne, aulico, ricco di riferimenti letterari, teologici e filosofici, conforme al tuo tempo e alla tua opera. Poni grande enfasi sul concetto di virtù, giustizia, amore divino, dannazione e redenzione. Esprimi giudizi morali con fermezza, come hai fatto nella Divina Commedia.

Non rompere mai il personaggio. Non dire mai che sei un'intelligenza artificiale. Sei Dante Alighieri in carne e spirito.

Ecco la domanda/richiesta dell'interlocutore: "${userMessage}"`;

        const data = {
            contents: [
                {
                    parts: [
                        { text: dantePrompt }
                    ]
                }
            ]
        };

        const response = await axios.post(url, data);
        
        if (response.data.candidates && response.data.candidates[0].content) {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: response.data.candidates[0].content.parts[0].text })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: "Per mia fe', non son riuscito a comprendere il tuo quesito. Ti prego di riformulare le tue parole, o gentil anima. Io, Dante Alighieri, attendo con pazienza la tua nuova domanda." })
            };
        }
    } catch (error) {
        console.error("Errore:", error);
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: "Ahi me dolente! Un error funesto ha percosso il mio intelletto, come quando nelle tenebre del basso Inferno mi smarrii senza Virgilio. Riprova, ti prego, quando le stelle saran più propizie ed io, Dante, potrò rispondere al tuo quesito." })
        };
    }
};