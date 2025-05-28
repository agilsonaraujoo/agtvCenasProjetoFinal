import React, { useState } from 'react';

const RecommendationEngine = () => {
  const [preference, setPreference] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // !!! IMPORTANTE: Use variáveis de ambiente para suas chaves de API.
  // Para produção, estas chaves devem ser seguras no servidor.
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

  const getRecommendations = async () => {
    setLoading(true);
    setError('');
    setRecommendations([]);

    if (!TMDB_API_KEY) {
      setError('A chave da API do TMDB não foi configurada. Verifique seu arquivo .env.');
      setLoading(false);
      return;
    }
    if (!geminiApiKey) {
      setError('A chave da API Gemini não foi configurada. Verifique seu arquivo .env.');
      setLoading(false);
      return;
    }

    try {
      // Chamada para a API Gemini
      let chatHistory = [];
      const prompt = `Dada a preferência do usuário: "${preference}", sugira 3-5 títulos de filmes ou séries que estariam disponíveis em um grande catálogo de IPTV. Para cada sugestão, forneça um 'title' (título), 'genre' (gênero) e uma 'shortDescription' (breve descrição). Responda apenas com um array JSON desses objetos.`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const geminiPayload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                "title": { "type": "STRING" },
                "genre": { "type": "STRING" },
                "shortDescription": { "type": "STRING" }
              },
              "propertyOrdering": ["title", "genre", "shortDescription"]
            }
          }
        }
      };

      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

      const geminiResponse = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      });

      const geminiResult = await geminiResponse.json();
      let parsedRecommendations = [];

      if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
          geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
          geminiResult.candidates[0].content.parts.length > 0) {
        const json = geminiResult.candidates[0].content.parts[0].text;
        parsedRecommendations = JSON.parse(json);
      } else {
        setError('Não foi possível obter recomendações de texto. Tente novamente.');
        console.error('Estrutura de resposta inesperada para texto:', geminiResult);
        setLoading(false);
        return;
      }

      // Chamada para a API TMDB para buscar imagens
      const recommendationsWithImages = await Promise.all(
        parsedRecommendations.map(async (rec) => {
          let imageUrl = `https://placehold.co/400x225/000000/FFFFFF?text=${encodeURIComponent(rec.title)}`;

          try {
            const tmdbSearchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(rec.title)}&language=pt-BR`;
            const tmdbResponse = await fetch(tmdbSearchUrl);
            const tmdbData = await tmdbResponse.json();

            if (tmdbData.results && tmdbData.results.length > 0) {
              const relevantResult = tmdbData.results.find(item =>
                item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv')
              );
              if (relevantResult && relevantResult.poster_path) {
                imageUrl = `https://image.tmdb.org/t/p/w500${relevantResult.poster_path}`;
              }
            }
          } catch (tmdbError) {
            console.error(`Erro ao buscar imagem TMDB para ${rec.title}:`, tmdbError);
          }

          return { ...rec, imageUrl };
        })
      );

      setRecommendations(recommendationsWithImages);

    } catch (err) {
      setError('Erro ao buscar recomendações. Verifique sua conexão ou tente mais tarde.');
      console.error('Erro na API Gemini ou TMDB:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="recomendacoes" className="bg-gray-800 text-white py-16 px-4">
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl mb-4">
          Recomendações Personalizadas ✨
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Descreva o que você gostaria de assistir e deixe a IA te surpreender!
        </p>

        <div className="max-w-2xl mx-auto mb-10">
          <textarea
            className="w-full p-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[100px]"
            placeholder="Ex: Quero um filme de ficção científica com muita ação e uma história envolvente..."
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
          ></textarea>
          <button
            onClick={getRecommendations}
            disabled={loading || !preference.trim()}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Gerando Recomendações...' : 'Obter Recomendações ✨'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-lg mb-4">{error}</p>
        )}

        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gray-900 rounded-lg shadow-xl p-6 text-left flex flex-col transform transition-transform hover:scale-105 duration-300">
                <img
                  src={rec.imageUrl}
                  alt={`Capa de ${rec.title}`}
                  className="w-full h-auto rounded-md mb-4 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x225/000000/FFFFFF?text=Imagem+Nao+Disponivel'; }}
                />
                <h3 className="text-2xl font-bold text-indigo-400 mb-2">{rec.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{rec.genre}</p>
                <p className="text-gray-300 flex-grow">{rec.shortDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendationEngine;
