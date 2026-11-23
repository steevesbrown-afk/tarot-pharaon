import React, { useState, useEffect } from 'react';
import {
  MAJOR_ARCANA,
  methods,
  drawPlanetary,
  drawThreeArcana,
  drawFiveCards,
  drawChance,
  getSavedDraws,
  saveDraw,
  shuffleArray
} from './utils/tarotDeck';

export default function App() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cards, setCards] = useState([]);
  const [screen, setScreen] = useState('home'); // 'home', 'result'
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Charger l'historique au démarrage
  useEffect(() => {
    const saved = getSavedDraws();
    setHistory(saved);
  }, []);

  const handleSelect = (method) => {
    setSelectedMethod(method);
    setShowHistory(false);
  };

  const startDrawing = () => {
    if (!selectedMethod) return;

    setIsDrawing(true);

    // Animation de tirage
    setTimeout(() => {
      let result;
      switch (selectedMethod.id) {
        case 'planetary':
          result = drawPlanetary();
          break;
        case 'three':
          result = drawThreeArcana();
          break;
        case 'five':
          result = drawFiveCards();
          break;
        case 'chance':
          result = drawChance();
          break;
        default:
          result = [];
      }

      // Sauvegarder le tirage
      const newDraw = {
        id: Date.now(),
        method: selectedMethod.id,
        methodTitle: selectedMethod.title,
        cards: result,
        timestamp: new Date().toISOString(),
      };

      saveDraw(newDraw);
      setHistory(prev => [newDraw, ...prev]);

      setCards(result);
      setScreen('result');
      setIsDrawing(false);
    }, 1000);
  };

  const reset = () => {
    setSelectedMethod(null);
    setCards([]);
    setScreen('home');
    setShowHistory(false);
  };

  const handleViewHistory = () => {
    setShowHistory(!showHistory);
    if (showHistory) {
      setSelectedMethod(null);
      setScreen('home');
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="app">
      <header className="header">
        <h1 className="title">TAROT DU PHARAON</h1>
        <p className="subtitle">Les 22 Lames Majeures d'Égypte</p>
        <div className="rule"></div>
      </header>

      {showHistory ? (
        <section className="history">
          <div className="history-header">
            <h2>Historique des tirages</h2>
            <button className="btn btn-ghost" onClick={handleViewHistory}>Fermer</button>
          </div>
          {history.length === 0 ? (
            <p className="empty">Aucun tirage sauvegardé</p>
          ) : (
            <div className="history-list">
              {history.map((draw) => (
                <div key={draw.id} className="history-item">
                  <div>
                    <strong>{draw.methodTitle}</strong>
                    <span className="history-date">{formatDate(draw.timestamp)}</span>
                  </div>
                  <span className="history-count">{draw.cards.length} cartes</span>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {screen === 'result' && selectedMethod ? (
            <section className="cards">
              {cards.map((card, index) => (
                <article key={index} className="card">
                  <div className="card-head">
                    <h2 className="card-name">{card.card?.name || 'Carte inconnue'}</h2>
                    <span className="card-pos">{card.position}</span>
                  </div>
                  <p className="card-meaning">{card.card?.meaning}</p>
                  {card.symbol && <p className="card-symbol">{card.symbol}</p>}
                </article>
              ))}
              {!cards.length && <p className="empty">Aucune carte tirée</p>}
            </section>
          ) : (
            <section className="methods">
              {methods.map((method) => (
                <div
                  key={method.id}
                  className={`method ${selectedMethod?.id === method.id && 'active'}`}
                  onClick={() => handleSelect(method)}
                  role="button"
                  aria-pressed={selectedMethod?.id === method.id}
                  aria-label={`Sélectionner la méthode ${method.title}`}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <h3 className="method-title">{method.title}</h3>
                    <p className="method-desc">{method.description}</p>
                  </div>
                  {selectedMethod?.id === method.id && <span className="method-check">✓</span>}
                </div>
              ))}
            </section>
          )}

          {selectedMethod && screen !== 'result' && (
            <div className="actions">
              <button
                className="btn btn-primary"
                onClick={startDrawing}
                disabled={isDrawing}
              >
                {isDrawing ? 'Tirage en cours...' : 'Commencer le tirage'}
              </button>
              <button className="btn btn-ghost" onClick={reset}>Annuler</button>
            </div>
          )}

          {screen === 'result' && cards.length > 0 && (
            <div className="synthesis">
              <h2 className="synthesis-title">Synthèse du tirage</h2>
              <div className="synthesis-text">
                {cards.map((card, index) => (
                  <p key={index} className="neg">
                    Carte {index + 1}: {card.card?.name} ({card.position}) - {card.card?.meaning}.
                    <br />
                    Position {index % 2 === 0 ? 'Droit' : 'Gauche'} ({index % 2 === 0 ? 'Passion' : 'Raison'}) - Énergie {card.card?.color || 'inconnue'}.
                  </p>
                ))}
              </div>
            </div>
          )}

          {screen === 'result' && cards.length > 0 && (
            <button className="btn btn-primary" onClick={reset}>
              Nouveau tirage
            </button>
          )}

          <div className="actions">
            <button className="btn btn-ghost" onClick={handleViewHistory}>
              {showHistory ? 'Fermer l\'historique' : 'Voir l\'historique'}
            </button>
          </div>
        </>
      )}

      <section className="shop">
        <h3>Acheter le jeu physique</h3>
        <p>
          Le Tarot du Pharaon est un jeu créé par l'artiste STEEVES-J-BROWN,
          peint à l'huile en 1992, imprimé par FRANCE CARTES (100% français).
        </p>
        <a href="https://steeves-j-brown.com/?product=tarot-du-pharaon" target="_blank" rel="noopener noreferrer">
          Voir sur le site officiel
        </a>
      </section>

      <footer className="footer">
        <p>
          © 2026 Tarot du Pharaon &nbsp;•&nbsp; Méthode Planétaire • 3 Arcanes • 5 Lames • Hasard
        </p>
        <p>
          Application inspirée de la notice du Tarot du Pharaon
        </p>
      </footer>
    </main>
  );
}