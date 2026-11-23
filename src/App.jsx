import React, { useState, useEffect } from 'react';

const methods = [
  { id: 'planetary', title: 'Méthode Planétaire', description: '7 lames pour les 7 planètes', icon: '☉', color: '#FFD700' },
  { id: 'three', title: '3 Arcanes Majeurs', description: 'Passé, Présent, Futur', icon: '☽', color: '#C0C0C0' },
  { id: 'five', title: 'Méthode des 5 lames', description: 'Tirage détaillé en 5 positions', icon: '✦', color: '#FF6B6B' },
  { id: 'chance', title: 'Méthode du Hasard', description: '8 lames en triangle', icon: '✧', color: '#4ECDC4' },
];

export default function App() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cards, setCards] = useState([]);
  const [screen, setScreen] = useState('home');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tarot_pharaon_draws') || '[]');
    setHistory(saved);
  }, []);

  const handleSelect = (method) => {
    setSelectedMethod(method);
    setShowHistory(false);
  };

  const startDrawing = () => {
    if (!selectedMethod) return;
    setIsDrawing(true);

    let result;
    switch (selectedMethod.id) {
      case 'planetary':
        result = [
          { card: MAJOR_ARCANA[0], position: '1', symbol: '☽' },
          { card: MAJOR_ARCANA[1], position: '2', symbol: '☉' },
          { card: MAJOR_ARCANA[2], position: '3', symbol: '☽' },
          { card: MAJOR_ARCANA[3], position: '4', symbol: '☉' },
          { card: MAJOR_ARCANA[4], position: '5', symbol: '☽' },
          { card: MAJOR_ARCANA[5], position: '6', symbol: '☉' },
          { card: MAJOR_ARCANA[6], position: '7', symbol: '☽' },
        ];
        break;
      case 'three':
        result = [
          { card: MAJOR_ARCANA[7], position: 'Passé', symbol: '☽' },
          { card: MAJOR_ARCANA[8], position: 'Présent', symbol: '☉' },
          { card: MAJOR_ARCANA[9], position: 'Futur', symbol: '☽' },
        ];
        break;
      case 'five':
        result = [
          { card: MAJOR_ARCANA[10], position: '1. Le Vous', symbol: '◉' },
          { card: MAJOR_ARCANA[11], position: '2. L\'Environnement', symbol: '◈' },
          { card: MAJOR_ARCANA[12], position: '3. Le Obstacle', symbol: '⬡' },
          { card: MAJOR_ARCANA[13], position: '4. Le Résultat', symbol: '⟡' },
          { card: MAJOR_ARCANA[14], position: '5. Le Conseil', symbol: '✧' },
        ];
        break;
      case 'chance':
        result = [
          { card: MAJOR_ARCANA[15], position: '1. Fondation', symbol: '◆' },
          { card: MAJOR_ARCANA[16], position: '2. Appel', symbol: '◈' },
          { card: MAJOR_ARCANA[17], position: '3. Passé', symbol: '⬡' },
          { card: MAJOR_ARCANA[18], position: '4. Présent', symbol: '⬢' },
          { card: MAJOR_ARCANA[19], position: '5. Futur', symbol: '⬣' },
          { card: MAJOR_ARCANA[20], position: '6. Obstacle', symbol: '⬤' },
          { card: MAJOR_ARCANA[21], position: '7. Conseil', symbol: '⬥' },
          { card: MAJOR_ARCANA[0], position: '8. Résultat', symbol: '⬦' },
        ];
        break;
      default:
        result = [];
    }

    const newDraw = {
      id: Date.now(),
      method: selectedMethod.id,
      methodTitle: selectedMethod.title,
      cards: result,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('tarot_pharaon_draws', JSON.stringify([newDraw, ...JSON.parse(localStorage.getItem('tarot_pharaon_draws') || '[]')]));
    setHistory(prev => [newDraw, ...prev]);
    setCards(result);
    setScreen('result');
    setIsDrawing(false);
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
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const cardImage = (card) => {
    if (!card || card.number === undefined) return null;
    const n = String(card.number + 1).padStart(2, '0');
    return <img src={`/images/${n}.jpg`} alt={card.name} className="card-image" loading="lazy" />;
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
                  {cardImage(card.card)}
                  <p className="card-meaning">{card.card?.meaning}</p>
                  {card.symbol && <p className="card-symbol">{card.symbol}</p>}
                </article>
              ))}
              {!cards.length && <p className="empty">Aucune carte tirée</p>}
            </section>

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

            <button className="btn btn-primary" onClick={reset}>
              Nouveau tirage
            </button>
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

const MAJOR_ARCANA = [
  { id: 0, number: 0, name: 'Le Mat', meaning: 'Nouveau départ, innocence, spontanéité', color: '#8B4513' },
  { id: 1, number: 1, name: 'Le Bateleur', meaning: 'Capacité, initiative, ressources', color: '#FFD700' },
  { id: 2, number: 2, name: 'La Papesse', meaning: 'Intuition, connaissance secrète, mystère', color: '#4B0082' },
  { id: 3, number: 3, name: 'L\'Impératrice', meaning: 'Fécondité, croissance, maternité', color: '#FF69B4' },
  { id: 4, number: 4, name: 'L\'Empereur', meaning: 'Autorité, structure, pouvoir', color: '#8B0000' },
  { id: 5, number: 5, name: 'Le Pape', meaning: 'Tradition, spiritualité, sagesse', color: '#FFFFFF' },
  { id: 6, number: 6, name: 'L\'Amoureux', meaning: 'Union, choix, connexion', color: '#FF1493' },
  { id: 7, number: 7, name: 'Le Chariot', meaning: 'Détermination, victoire, contrôle', color: '#000080' },
  { id: 8, number: 8, name: 'La Justice', meaning: 'Équilibre, loi, équité', color: '#FFD700' },
  { id: 9, number: 9, name: 'L\'Ermite', meaning: 'Introspection, guidance, sagesse', color: '#8B4513' },
  { id: 10, number: 10, name: 'La Roue de Fortune', meaning: 'Cycles, destin, changements', color: '#FFD700' },
  { id: 11, number: 11, name: 'La Force', meaning: 'Courage, puissance, douceur', color: '#FF4500' },
  { id: 12, number: 12, name: 'Le Pendu', meaning: 'Sacrifice, perspective nouvelle', color: '#4B0082' },
  { id: 13, number: 13, name: 'La Mort', meaning: 'Transformation, fin, renaissance', color: '#000000' },
  { id: 14, number: 14, name: 'Tempérance', meaning: 'Équilibre, modération, patience', color: '#00BFFF' },
  { id: 15, number: 15, name: 'Le Diable', meaning: 'Addiction, illusion, attachement', color: '#8B0000' },
  { id: 16, number: 16, name: 'La Maison Dieu', meaning: 'Choc, révélation, destruction', color: '#FF0000' },
  { id: 17, number: 17, name: 'L\'Étoile', meaning: 'Espoir, inspiration, guidance', color: '#00BFFF' },
  { id: 18, number: 18, name: 'La Lune', meaning: 'Illusion, intuition, cycle', color: '#C0C0C0' },
  { id: 19, number: 19, name: 'Le Soleil', meaning: 'Joie, réussite, clarté', color: '#FFD700' },
  { id: 20, number: 20, name: 'Le Jugement', meaning: 'Révélation, renaissance, jugement', color: '#FFD700' },
  { id: 21, number: 21, name: 'Le Monde', meaning: 'Achèvement, succès, totalité', color: '#00FF7F' },
];