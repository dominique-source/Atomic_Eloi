export const ZONES = {
  MOVEMENT: { id: 'movement', label: 'ÉPIQUE',    rarity: 'ÉPIQUE',    color: '#9B5CFF', icon: 'run'   },
  NUTRITION: { id: 'nutrition', label: 'RARE',    rarity: 'RARE',      color: '#2BD9FF', icon: 'salad' },
  RECOVERY:  { id: 'recovery',  label: 'PEU COMMUN', rarity: 'PEU COMMUN', color: '#B4FF3A', icon: 'moon' },
  MINDSET:   { id: 'mindset',   label: 'LÉGENDAIRE', rarity: 'LÉGENDAIRE', color: '#FFC93C', icon: 'brain' },
  BOSS:      { id: 'boss',      label: 'MYTHIQUE', rarity: 'MYTHIQUE',  color: '#FF4D6D', icon: 'skull' },
}

export const CHALLENGES = [
  // MOUVEMENT — Épique (purple)
  {
    id: 'm1', zone: 'movement', xp: 150,
    title: 'DÉPLACEMENT VERS LA ZONE',
    mission: 'Marcher / bouger 30–60 min aujourd\'hui',
    flavor: 'La tempête se referme. Quitte le bus de combat et couvre la distance avant que la zone ne te rattrape.',
  },
  {
    id: 'm2', zone: 'movement', xp: 140,
    title: 'ENTRAÎNEMENT AU CHAMP DE TIR',
    mission: 'Squats, pompes et fentes aujourd\'hui',
    flavor: 'Améliore tes stats avant la prochaine partie. Le champ d\'entraînement t\'attend, joueur.',
  },
  {
    id: 'm3', zone: 'movement', xp: 120,
    title: 'PATROUILLE DES POINTS D\'INTÉRÊT',
    mission: '10 min de marche après chaque repas',
    flavor: 'Trois points d\'intérêt à scanner sur la carte. Patrouille après chaque repas.',
    reps: 3, repLabels: ['Après déjeuner', 'Après dîner', 'Après souper'],
  },
  {
    id: 'm4', zone: 'movement', xp: 160,
    title: 'FORGE DE L\'ARMURE',
    mission: 'Séance de musculation aujourd\'hui',
    flavor: 'L\'armure de combat ne s\'achète pas — elle se forge. Rejoins la salle d\'entraînement et renforce tes boucliers.',
  },
  {
    id: 'm5', zone: 'movement', xp: 100,
    title: 'ANTI-BUSH-CAMP',
    mission: 'Se lever et bouger toutes les 30 minutes',
    flavor: 'Camper détruit tes stats. Brise l\'immobilité, reste mobile. Les campers ne gagnent pas de Victory Royale.',
    reps: 6, repLabels: ['1re levée', '2e levée', '3e levée', '4e levée', '5e levée', '6e levée'],
  },
  {
    id: 'm6', zone: 'movement', xp: 130,
    title: 'TRAVERSÉE DE L\'ÎLE',
    mission: 'Faire du vélo ou nager aujourd\'hui',
    flavor: 'Utilise tous les biomes de l\'île. Vélo ou natation — choisis ton terrain et traverse la zone.',
  },

  // NUTRITION — Rare (blue)
  {
    id: 'n1', zone: 'nutrition', xp: 130,
    title: 'RATION DE COMBAT',
    mission: 'Protéines + légumes en premier à chaque repas',
    flavor: 'Le bon loot avant le combat. Charge protéines et légumes pour tenir toute la partie.',
    reps: 3, repLabels: ['Déjeuner', 'Dîner', 'Souper'],
  },
  {
    id: 'n2', zone: 'nutrition', xp: 130,
    title: 'PURGE DES POTIONS TOXIQUES',
    mission: 'Zéro boisson sucrée aujourd\'hui',
    flavor: 'Ces boissons sucrées sont des potions piégées. Jette-les hors de ton inventaire — elles drainent tes PV.',
  },
  {
    id: 'n3', zone: 'nutrition', xp: 140,
    title: 'POTION DE VIE COMPLÈTE',
    mission: 'Boire 2L d\'eau aujourd\'hui',
    flavor: 'Ton bouclier de combat se recharge avec l\'eau. 2L = bouclier à 100%. Hydrate-toi, joueur.',
    reps: 4, repLabels: ['Matin', 'Avant-midi', 'Après-midi', 'Soir'],
  },
  {
    id: 'n4', zone: 'nutrition', xp: 150,
    title: 'BUFF GLYCÉMIQUE',
    mission: 'Manger les légumes avant les glucides',
    flavor: 'Active le buff glycémique : légumes d\'abord. Les fibres ralentissent la montée du glucose — ton énergie dure plus longtemps.',
  },
  {
    id: 'n5', zone: 'nutrition', xp: 120,
    title: 'INVENTAIRE PROPRE',
    mission: 'Aucun aliment ultra-transformé aujourd\'hui',
    flavor: 'Nettoie ton inventaire. Les items ultra-transformés sont des loot de mauvaise qualité — jette-les.',
  },

  // RÉCUPÉRATION — Peu commun (lime)
  {
    id: 'r1', zone: 'recovery', xp: 170,
    title: 'RETOUR AU LOBBY',
    mission: 'Dormir 8–9 heures cette nuit',
    flavor: 'La partie est finie pour aujourd\'hui. Reconnecte-toi au lobby et recharge ton énergie à 100%.',
  },
  {
    id: 'r2', zone: 'recovery', xp: 150,
    title: 'SYNC DU RESPAWN',
    mission: 'Maintenir un horaire de sommeil constant',
    flavor: 'Le timer de respawn est verrouillé. Synchronise ton cycle pour maximiser ta récupération entre les parties.',
  },
  {
    id: 'r3', zone: 'recovery', xp: 130,
    title: 'DÉCONNEXION DES ÉCRANS',
    mission: 'Aucun écran 1h avant le coucher',
    flavor: 'Coupe le serveur 60 min avant le repos. Ton cerveau sort de la file d\'attente et se prépare à se reconstruire.',
  },
  {
    id: 'r4', zone: 'recovery', xp: 120,
    title: 'PROTOCOLE DE RÉCUP',
    mission: '10 min d\'étirements ou de yoga',
    flavor: 'Chaque pro-gamer a un protocole de récup. Étire les muscles fatigués — les gains se font pendant le repos.',
  },

  // MENTAL — Légendaire (gold)
  {
    id: 'x1', zone: 'mindset', xp: 120,
    title: 'ZONE DE CONCENTRATION',
    mission: '10 min de respiration / méditation',
    flavor: 'Trouve un coin calme de la carte. 10 minutes de silence débloquent le focus légendaire.',
  },
  {
    id: 'x2', zone: 'mindset', xp: 120,
    title: 'COFFRE DU SAVOIR',
    mission: 'Lire ou faire une activité créative aujourd\'hui',
    flavor: 'Un coffre légendaire est caché sur l\'île. Ouvre-le par la lecture ou la création.',
  },
  {
    id: 'x3', zone: 'mindset', xp: 110,
    title: 'ESCOUADE EN LIGNE',
    mission: 'Participer à une activité sociale positive',
    flavor: 'Les meilleures parties se jouent en escouade. Connecte-toi avec ton squad dans la vraie vie.',
  },
  {
    id: 'x4', zone: 'mindset', xp: 140,
    title: 'DÉBRIEF POST-PARTIE',
    mission: 'Écrire 3 choses positives de ta journée',
    flavor: 'Chaque pro-joueur fait un débrief après la partie. Identifie 3 victoires de la journée — petit ou grand.',
  },
  {
    id: 'x5', zone: 'mindset', xp: 130,
    title: 'NO-RAGE MODE',
    mission: 'Soirée calme, sans stress inutile',
    flavor: 'Le rage-quit détruit ton Mental. Active le mode no-rage : soirée détendue, cortisol sous contrôle.',
  },

  // BOSS — Mythique (red)
  {
    id: 'b1', zone: 'boss', xp: 300,
    title: 'VICTORY ROYALE',
    mission: 'Journée parfaite : 8h+ de sommeil, 3 repas équilibrés, 60 min de mouvement, 0 écran avant le lit',
    flavor: 'Le dernier cercle. Tous les systèmes alignés. Survis à la journée parfaite et décroche la VICTORY ROYALE.',
    isBoss: true,
  },
]

export const NON_BOSS = CHALLENGES.filter(c => !c.isBoss)
export const BOSS_CHALLENGE = CHALLENGES.find(c => c.isBoss)
