/**
 * Tarot du Pharaon - Moteur de tirage et données des cartes
 * D'après la notice du PDF fourni par l'utilisateur
 * Toutes les cartes sont basées sur les 22 Lames Majeures du Tarot du Pharaon
 */

// Stockage local pour la sauvegarde des tirages
const STORAGE_KEY = 'tarot_pharaon_draws';

export const getSavedDraws = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Erreur de lecture du localStorage', error);
    return [];
  }
};

export const saveDraw = (draw) => {
  try {
    const serializedState = [...getSavedDraws(), draw];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedState));
    return true;
  } catch (error) {
    console.error('Erreur de sauvegarde du localStorage', error);
    return false;
  }
};

// Mélange aléatoire de tableau (algorithme Fisher-Yates)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Les 22 Lames Majeures du Tarot du Pharaon (d'après le PDF)
export const MAJOR_ARCANA = [
  {
    id: 0,
    number: 0,
    name: 'Le Mat',
    meaning: 'Nouveau départ, innocence, spontanéité, le non-choix, le peut-être, l\'hésitation',
    meaningUpright: 'Liberté, nouveau commencement, confiance en l\'avenir, innocence',
    meaningReversed: 'Imprudence, manque de direction, folie, risque inconsidéré',
    symbol: 'Un personnage inexpérimenté qui manipule sans encore maîtriser les quatre éléments fondamentaux',
    color: '#8B4513',
    element: 'Air',
    planet: 'Uranus',
    pharaohNote: 'Plante le décor comme un avertissement, exige implicitement de celui qui désire se connaître de se voir tel qu\'il est réellement : un bout de chiffon entre les mains des Dieux.'
  },
  {
    id: 1,
    number: 1,
    name: 'Le Bateleur',
    meaning: 'Capacité, initiative, ressources, commencement, volonté, l\'initié',
    meaningUpright: 'Début d\'entreprise, habileté, créativité, maîtrise des éléments',
    meaningReversed: 'Tromperie, manipulation, manque de concentration, talents gaspillés',
    symbol: 'L\'initié autant que le consultant en première lame, maître des quatre éléments',
    color: '#FFD700',
    element: 'Air',
    planet: 'Mercure',
    pharaohNote: 'Première lame Majeure, personnage inexpérimenté qui manipule sans encore maîtriser les quatre éléments fondamentaux.'
  },
  {
    id: 2,
    number: 2,
    name: 'La Papesse',
    meaning: 'Intuition, connaissance secrète, mystère, sagesse intérieure, la Grande Prêtresse',
    meaningUpright: 'Intuition développée, secrets révélés, sagesse féminine, patience',
    meaningReversed: 'Secrets gardés, manque d\'intuition, superficialité, ragots',
    symbol: 'Entre les Sphinges noire et blanche, cette femme le visage à moitié voilé devant le mystère du temple aux colonnes hétéro-types',
    color: '#4B0082',
    element: 'Eau',
    planet: 'Lune',
    pharaohNote: 'Lame II, la déesse Isis. Si vous tirez la Papesse, le Tarot vous donne le feu vert pour concrétiser votre pensée, la réussite est au bout certaine puisque cet Arcane, du fond de son mystère, vous a répondu. Elle incarne le Oui.'
  },
  {
    id: 3,
    number: 3,
    name: 'L\'Impératrice',
    meaning: 'Fécondité, croissance, maternité, abondance, créativité, l\'essence féminine',
    meaningUpright: 'Abondance, fertilité, créativité, maternité, beauté, nature',
    meaningReversed: 'Stérilité, blocage créatif, dépendance, négligence',
    symbol: 'L\'essence, femme de l\'Empereur, complémentarité symbolique, force, autorité, douceur et bontés',
    color: '#FF69B4',
    element: 'Terre',
    planet: 'Vénus',
    pharaohNote: 'La complémentarité est symbolique, ils sont chacun la clé de l\'autre, la force, l\'autorité, la douceur et la bontés.'
  },
  {
    id: 4,
    number: 4,
    name: 'L\'Empereur',
    meaning: 'Autorité, structure, pouvoir, stabilité, paternité, le Pharaon',
    meaningUpright: 'Autorité légitime, structure, pouvoir, stabilité, protection',
    meaningReversed: 'Tyrannie, rigidité excessive, manque d\'autorité, chaos',
    symbol: 'Le Pharaon, assis sur son trône, corps tourné vers sa droite, clé de l\'autre',
    color: '#8B0000',
    element: 'Feu',
    planet: 'Mars',
    pharaohNote: 'L\'Empereur (bleu) et l\'Impératrice sont complémentaires. L\'Homme est duel, la représentation de celle-ci en est l\'essence.'
  },
  {
    id: 5,
    number: 5,
    name: 'Le Pape',
    meaning: 'Tradition, spiritualité, sagesse, guidance, enseignement, le Hiérophante',
    meaningUpright: 'Sagesse traditionnelle, guidance spirituelle, conseil, éducation',
    meaningReversed: 'Dogmatisme, rébellion, conseils douteux, non-conformisme',
    symbol: 'Incarne la tradition et l\'enseignement spirituel',
    color: '#FFFFFF',
    element: 'Terre',
    planet: 'Jupiter',
    pharaohNote: 'Cinquième lame, incarnant le principe de tradition et de transmission.'
  },
  {
    id: 6,
    number: 6,
    name: 'L\'Amoureux',
    meaning: 'Union, choix, connexion, harmonie, décision du cœur',
    meaningUpright: 'Amour, union, choix aligné, harmonie, valeurs partagées',
    meaningReversed: 'Désunion, mauvais choix, déséquilibre, indécision',
    symbol: 'Cet Arcane propose un choix, l\'aile de Éros ou de Cupidon, celle-là moins en vue, cachée',
    color: '#FF1493',
    element: 'Air',
    planet: 'Vénus',
    pharaohNote: 'Sixième lame, le choix, la décision, l\'amour et ses dualités.'
  },
  {
    id: 7,
    number: 7,
    name: 'Le Chariot',
    meaning: 'Détermination, victoire, contrôle, maîtrise, volonté agissante',
    meaningUpright: 'Victoire, détermination, contrôle, succès par la volonté',
    meaningReversed: 'Manque de direction, perte de contrôle, agressivité, échec',
    symbol: 'La volonté agissante, le char conduit par la maîtrise',
    color: '#000080',
    element: 'Eau',
    planet: 'Saturne',
    pharaohNote: 'VII > Gémeaux sous Mars. Cette lame est celle de la volonté agissante.'
  },
  {
    id: 8,
    number: 8,
    name: 'La Justice',
    meaning: 'Équilibre, loi, équité, vérité, karma, résurrection, renouveau',
    meaningUpright: 'Justice, équilibre, vérité, équité, cause et effet',
    meaningReversed: 'Injustice, partialité, déséquilibre, malhonnêteté',
    symbol: 'Représente le concept de résurrection, de renouveau, ce que le 4 double dans la pensée Dogon représente également',
    color: '#FFD700',
    element: 'Air',
    planet: 'Vénus',
    pharaohNote: 'Le chiffre 8 correspond dans le tarot à la lame Majeure la Justice, pour représenter le concept de résurrection, de renouveau.'
  },
  {
    id: 9,
    number: 9,
    name: 'L\'Ermite',
    meaning: 'Introspection, guidance, sagesse, solitude, recherche intérieure',
    meaningUpright: 'Sagesse, introspection, guidance, recherche de vérité',
    meaningReversed: 'Isolement excessif, fuite, refus de guidance, égarement',
    symbol: 'Costumes bouddhistes, l\'Ermite suggère le Divin, la sagesse intérieure',
    color: '#8B4513',
    element: 'Terre',
    planet: 'Saturne',
    pharaohNote: 'L\'introspection, la lanterne de la sagesse, le guide intérieur.'
  },
  {
    id: 10,
    number: 10,
    name: 'La Roue de Fortune',
    meaning: 'Cycles, destin, changements, karma, opportunités, la roue qui tourne',
    meaningUpright: 'Changement positif, destin favorable, cycles, opportunités',
    meaningReversed: 'Malchance, résistance au changement, cycles négatifs',
    symbol: 'La roue, Rota, Taro, Rota(s), Taro(t), Tora(h) - l\'anagramme éternelle',
    color: '#FFD700',
    element: 'Feu',
    planet: 'Jupiter',
    pharaohNote: 'Il existe derrière la phonétique de certaines lettres une correspondance avec les ères astrologiques du zodiaque. "Rota" et son anagramme "Taro" (Tarot).'
  },
  {
    id: 11,
    number: 11,
    name: 'La Force',
    meaning: 'Courage, puissance, douceur, maîtrise de soi, force intérieure',
    meaningUpright: 'Force intérieure, courage, compassion, maîtrise des instincts',
    meaningReversed: 'Faiblesse, manque de contrôle, brutalité, doute de soi',
    symbol: 'La force douce qui domine la bête, courage et compassion',
    color: '#FF4500',
    element: 'Feu',
    planet: 'Mars',
    pharaohNote: 'La force intérieure, la maîtrise par la douceur plutôt que par la contrainte.'
  },
  {
    id: 12,
    number: 12,
    name: 'Le Pendu',
    meaning: 'Sacrifice, perspective nouvelle, lâcher-prise, suspension, illumination',
    meaningUpright: 'Nouvelle perspective, sacrifice nécessaire, lâcher-prise, patience',
    meaningReversed: 'Stagnation, sacrifice vain, refus de voir autrement, martyre',
    symbol: 'La suspension volontaire pour voir sous un autre angle',
    color: '#4B0082',
    element: 'Eau',
    planet: 'Neptune',
    pharaohNote: 'Le sacrifice pour une vision supérieure, le changement de perspective.'
  },
  {
    id: 13,
    number: 13,
    name: 'La Mort',
    nameAlt: 'L\'Arcane 13',
    meaning: 'Transformation, fin, renaissance, changement radical, métamorphose',
    meaningUpright: 'Transformation profonde, fin nécessaire, renaissance, libération',
    meaningReversed: 'Résistance au changement, stagnation, deuil non résolu',
    symbol: 'Mort, transformation, renaissance - non la fin mais le passage',
    color: '#000000',
    element: 'Eau',
    planet: 'Pluton',
    pharaohNote: 'L\'Arcane 13, la treizième et dernière marche de ce cycle.'
  },
  {
    id: 14,
    number: 14,
    name: 'Tempérance',
    meaning: 'Équilibre, modération, patience, alchimie, harmonie, synthèse',
    meaningUpright: 'Équilibre, modération, alchimie intérieure, harmonie, patience',
    meaningReversed: 'Excès, déséquilibre, impatience, manque de modération',
    symbol: 'L\'alchimie des contraires, le mélange parfait, l\'ange qui verse l\'eau',
    color: '#00BFFF',
    element: 'Feu',
    planet: 'Sagittaire',
    pharaohNote: 'L\'équilibre par l\'alchimie, la synthèse des opposés, la patience.'
  },
  {
    id: 15,
    number: 15,
    name: 'Le Diable',
    meaning: 'Addiction, illusion, attachement, matérialisme, ombre, chaînes',
    meaningUpright: 'Confrontation à l\'ombre, addictions, attachements, matérialisme',
    meaningReversed: 'Libération, prise de conscience, briser les chaînes, éveil',
    symbol: 'En Occident représenté par le rouge, en Orient par le vert. Les chaînes de la matière',
    color: '#8B0000',
    element: 'Terre',
    planet: 'Capricorne',
    pharaohNote: 'Ex: Le Diable en Occident, représenté par le rouge, et en Orient par le vert. Deux cultures parfaitement opposées peuvent identifier une seule et même pensée avec deux couleurs opposées.'
  },
  {
    id: 16,
    number: 16,
    name: 'La Maison Dieu',
    nameAlt: 'La Tour',
    meaning: 'Choc, révélation, destruction, libération soudaine, éveil brutal',
    meaningUpright: 'Révélation soudaine, destruction des illusions, libération, éveil',
    meaningReversed: 'Évitement du changement, peur de la vérité, destruction lente',
    symbol: 'La tour frappée par la foudre, le choc qui libère',
    color: '#FF0000',
    element: 'Feu',
    planet: 'Mars',
    pharaohNote: 'Le choc, la révélation, la destruction des fausses certitudes.'
  },
  {
    id: 17,
    number: 17,
    name: 'L\'Étoile',
    meaning: 'Espoir, inspiration, guidance, guérison, foi, lumière dans l\'obscurité',
    meaningUpright: 'Espoir, inspiration, guérison, guidance divine, foi renouvelée',
    meaningReversed: 'Désespoir, manque de foi, déception, perte de direction',
    symbol: 'L\'étoile qui guide dans la nuit, l\'espérance, l\'eau qui coule',
    color: '#00BFFF',
    element: 'Air',
    planet: 'Verseau',
    pharaohNote: 'L\'espérance, la guidance, l\'étoile du berger dans la nuit.'
  },
  {
    id: 18,
    number: 18,
    name: 'La Lune',
    meaning: 'Illusion, intuition, cycle, inconscient, rêves, mystère, l\'Athanor',
    meaningUpright: 'Intuition, rêves, cycles, inconscient, imagination fertile',
    meaningReversed: 'Confusion, peurs, illusions, anxiété, tromperie de soi',
    symbol: 'Nocturne : Foncée, non expressive, mystérieuse et femelle T, symbole de la lueur de l\'Athanor des Alchimistes',
    color: '#C0C0C0',
    element: 'Eau',
    planet: 'Poissons',
    pharaohNote: 'Le rouge était avant tout une couleur féminine, intuitive, passionnelle, celle qui incarnait la femme. La Lune : nocturne, mystérieuse, féminine, l\'Athanor des Alchimistes.'
  },
  {
    id: 19,
    number: 19,
    name: 'Le Soleil',
    meaning: 'Joie, réussite, clarté, vitalité, vérité révélée, bonheur',
    meaningUpright: 'Joie, succès, clarté, vitalité, vérité, épanouissement',
    meaningReversed: 'Tristesse temporaire, manque de clarté, ego, orgueil',
    symbol: 'Diurne : Clair, éclatant, mâle, U, violent et représentatif de l\'interdiction et du danger. La couleur de l\'Or, du Soleil, de la Terre fertile',
    color: '#FFD700',
    element: 'Feu',
    planet: 'Soleil',
    pharaohNote: 'Diurne : Clair, éclatant, mâle, représentatif de l\'interdiction et du danger. Elle était la couleur de l\'Or, du Soleil, de la Terre fertile, la plus chaude des couleurs.'
  },
  {
    id: 20,
    number: 20,
    name: 'Le Jugement',
    nameAlt: 'La Judgement',
    meaning: 'Révélation, renaissance, jugement, appel intérieur, absolution',
    meaningUpright: 'Renaissance, jugement positif, appel intérieur, absolution',
    meaningReversed: 'Auto-critique, refus de l\'appel, culpabilité, stagnation',
    symbol: 'Le jugement final, la résurrection, l\'appel de la trompette',
    color: '#FFD700',
    element: 'Feu',
    planet: 'Pluton',
    pharaohNote: 'La révélation, le jugement, la renaissance par le feu.'
  },
  {
    id: 21,
    number: 21,
    name: 'Le Monde',
    meaning: 'Achèvement, succès, totalité, accomplissement, intégration, la danse',
    meaningUpright: 'Accomplissement, succès total, intégration, voyage achevé',
    meaningReversed: 'Inachèvement, retard, manque de clôture, dispersion',
    symbol: 'La danseuse au centre du monde, l\'accomplissement total, l\'Ouroboros',
    color: '#00FF7F',
    element: 'Terre',
    planet: 'Saturne',
    pharaohNote: 'L\'achèvement, la totalité, l\'accomplissement du voyage initiatique.'
  }
];

export const PHARAOH_COLORS = {
  blue: { name: 'Bleu', meaning: 'La couleur de la vie. Clair : fréquence du petit garçon et du Dieu Amon. Foncé : impalpable profondeur des éléments et de l\'homme. Spiritualité.', element: 'Eau', polarity: 'Froide' },
  yellow: { name: 'Jaune', meaning: 'La couleur de l\'Or, du Soleil, de la Terre fertile. Diurne : clair, éclatant, mâle. Nocturne : l\'Athanor des Alchimistes. La plus chaude des couleurs.', element: 'Feu', polarity: 'Chaude' },
  red: { meaning: 'Couleur féminine, intuitive, passionnelle, celle qui incarnait la femme. Diurne : interdiction et danger. Nocturne : lueur de l\'Athanor. Libidos, infidélité, orgie, ou le Divin selon l\'accentuation.', name: 'Rouge', element: 'Feu', polarity: 'Chaude' },
  green: { meaning: 'Entre le bleu et le jaune, la couleur de l\'Eau, de l\'espérance et du règne végétal. Idée du mystère, de l\'incertitude (derrière chaque plante se cache soit un poison soit un remède). Arrivée en premier pour donner naissance à toutes les autres fréquences.', name: 'Vert', element: 'Terre', polarity: 'Froide' }
};

// Méthodes de tirage disponibles
export const methods = [
  { id: 'planetary', title: 'Méthode Planétaire', description: '7 lames pour les 7 planètes', icon: '☉', color: '#FFD700' },
  { id: 'three', title: '3 Arcanes Majeurs', description: 'Passé, Présent, Futur', icon: '☽', color: '#C0C0C0' },
  { id: 'five', title: 'Méthode des 5 lames', description: 'Tirage détaillé en 5 positions', icon: '✦', color: '#FF6B6B' },
  { id: 'chance', title: 'Méthode du Hasard', description: '8 lames en triangle', icon: '✧', color: '#4ECDC4' },
];

// Méthode 1: Planétaire (7 lames pour les 7 planètes)
export const drawPlanetary = () => {
  const shuffled = shuffleArray([...MAJOR_ARCANA]);
  const planets = ['Lune', 'Mercure', 'Vénus', 'Soleil', 'Mars', 'Jupiter', 'Saturne'];
  return shuffled.slice(0, 7).map((card, index) => ({
    card,
    planet: planets[index],
    position: index + 1,
  }));
};

// Méthode 2: 3 Arcanes Majeurs (Passé, Présent, Futur)
export const drawThreeArcana = () => {
  const shuffled = shuffleArray([...MAJOR_ARCANA]);
  const positions = ['Passé', 'Présent', 'Futur'];
  return shuffled.slice(0, 3).map((card, index) => ({
    card,
    position: positions[index],
    symbol: ['☽', '☉', '✦'][index],
  }));
};

// Méthode 3: 5 lames (Le Vous, L'Environnement, L'Obstacle, Le Résultat, Le Conseil)
export const drawFiveCards = () => {
  const shuffled = shuffleArray([...MAJOR_ARCANA]);
  const positions = ['1. Le Vous', '2. L\'Environnement', '3. Le Obstacle', '4. Le Résultat', '5. Le Conseil'];
  return shuffled.slice(0, 5).map((card, index) => ({
    card,
    position: positions[index],
    symbol: ['◉', '◈', '⬡', '⟡', '✧'][index],
  }));
};

// Méthode 4: Hasard (8 lames en triangle)
export const drawChance = () => {
  const shuffled = shuffleArray([...MAJOR_ARCANA]);
  const positions = ['1. Fondation', '2. Appel', '3. Passé', '4. Présent', '5. Futur', '6. Obstacle', '7. Conseil', '8. Résultat'];
  return shuffled.slice(0, 8).map((card, index) => ({
    card,
    position: positions[index],
    symbol: ['◆', '◈', '⬡', '⬢', '⬣', '⬤', '⬥', '⬦'][index],
  }));
};