let deck1 = [];
let dealerHand = [];
let playerHand = [];
let gameOver = false;

// Cached element references
let dealerCardsEl = document.querySelector('#dealer-cards');
let playerCardsEl = document.querySelector('#player-cards');
let dealerScoreEl = document.querySelector('#dealer-score');
let playerScoreEl = document.querySelector('#player-score');
let messageEl = document.querySelector('#message');
let dealBtn = document.querySelector('#deal-btn');
let hitBtn = document.querySelector('#hit-btn');
let standBtn = document.querySelector('#stand-btn');

// Functions
const init = () => {
  deck1 = [
    "dA", "dQ", "dK", "dJ", "d10", "d09", "d08", "d07", "d06", "d05", "d04", "d03", "d02",
    "hA", "hQ", "hK", "hJ", "h10", "h09", "h08", "h07", "h06", "h05", "h04", "h03", "h02",
    "cA", "cQ", "cK", "cJ", "c10", "c09", "c08", "c07", "c06", "c05", "c04", "c03", "c02",
    "sA", "sQ", "sK", "sJ", "s10", "s09", "s08", "s07", "s06", "s05", "s04", "s03", "s02"
  ];
};

const drawCard = () => {
  let randomIdx = Math.floor(Math.random() * deck1.length);
  return deck1.splice(randomIdx, 1)[0];
};

const dealInitialCards = () => {
  dealerHand = [];
  playerHand = [];
  gameOver = false;
  messageEl.textContent = '';

  // Drawing random cards for dealer and player
  dealerHand.push(drawCard());
  playerHand.push(drawCard());

  renderCards();

  setTimeout(() => {
    dealerHand.push(drawCard());
    playerHand.push(drawCard());
    updateScores();
    renderCards();
    checkInitialBlackjack();
  }, 2100);
};

const calculateScore = (hand) => {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    let value = card.slice(1);
    if (value === 'A') {
      aces++;
      score += 11;
    } else if (['K', 'Q', 'J'].includes(value)) {
      score += 10;
    } else {
      score += parseInt(value);
    }
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
};

const updateScores = () => {
  let dealerScore = calculateScore(dealerHand);
  let playerScore = calculateScore(playerHand);
  playerScoreEl.textContent = playerScore;
  dealerScoreEl.textContent = calculateScore([dealerHand[1]]);
};

const renderCards = () => {
  dealerCardsEl.innerHTML = '';
  playerCardsEl.innerHTML = '';
  dealerHand.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${index === 0 && !gameOver ? 'back' : card}`;
    dealerCardsEl.appendChild(cardEl);
  });
  playerHand.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card}`;
    playerCardsEl.appendChild(cardEl);
  });
};

const checkInitialBlackjack = () => {
  let playerScore = calculateScore(playerHand);
  let dealerScore = calculateScore(dealerHand);
  if (playerScore === 21 && dealerScore === 21) {
    endGame("Both have Blackjack! It's a tie!");
  } else if (playerScore === 21) {
    endGame("Blackjack! You win!");
  } else if (dealerScore === 21) {
    hitBtn.disabled = false;
    standBtn.disabled = false;
    messageEl.textContent = "Dealer has a potential Blackjack. Make your move.";
  } else {
    hitBtn.disabled = false;
    standBtn.disabled = false;
  }
};

const playerHit = () => {
  playerHand.push(drawCard());
  updateScores();
  renderCards();
  if (calculateScore(playerHand) > 21) {
    endGame('Bust! You lose!');
  }
};

const dealerTurn = () => {
  gameOver = true;
  renderCards(); // Flip the dealer's hidden card
  let dealerScore = calculateScore(dealerHand);
  dealerScoreEl.textContent = dealerScore; // Show full dealer score

  if (dealerScore === 21) {
    checkWinner();
    return;
  }

  while (dealerScore < 17) {
    dealerHand.push(drawCard());
    dealerScore = calculateScore(dealerHand);
    dealerScoreEl.textContent = dealerScore;
    renderCards();
  }
  checkWinner();
};

const checkWinner = () => {
  let dealerScore = calculateScore(dealerHand);
  let playerScore = calculateScore(playerHand);
  if (dealerScore > 21) {
    endGame('Dealer busts! You win!');
  } else if (dealerScore > playerScore) {
    endGame('Dealer wins!');
  } else if (dealerScore < playerScore) {
    endGame('You win!');
  } else {
    endGame('It\'s a tie!');
  }
};

const endGame = (message) => {
  gameOver = true;
  messageEl.textContent = message;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealBtn.disabled = false;
  renderCards();
  dealerScoreEl.textContent = calculateScore(dealerHand); // Show full dealer score
};



document.addEventListener('DOMContentLoaded', () => {
  const introSection = document.getElementById('intro-section');
  const rulesSection = document.getElementById('rules-section');
  const gameSection = document.getElementById('game-section');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const continueBtn = document.getElementById('continue-btn');

  const rules = [
      "The goal of blackjack is to beat the dealer's hand without going over 21.",
      "Face cards are worth 10. Aces are worth 1 or 11, whichever makes a better hand.",
      "Each player starts with two cards, one of the dealer's cards is hidden until the end.",
      "To 'Hit' is to ask for another card. To 'Stand' is to hold your total and end your turn.",
      "If you go over 21 you bust, and the dealer wins regardless of the dealer's hand.",
      "If you are dealt 21 from the start (Ace & 10), you got a blackjack.",
      "Blackjack usually means you win 1.5 the amount of your bet. Depends on the casino.",
      "Dealer will hit until their cards total 17 or higher.",
      "Doubling is like a hit, only the bet is doubled and you only get one more card.",
      "Split can be done when you have two of the same card - the pair is split into two hands.",
      "Splitting also doubles the bet, because each new hand is worth the original bet.",
      "You can only double/split on the first move, or first move of a hand created by a split.",
      "You cannot play on two aces after they are split.",
      "You can double on a hand resulting from a split, tripling or quadrupling you bet.",
      "To play press 'Deal'"
  ];

  yesBtn.addEventListener('click', () => {
      introSection.style.display = 'none';
      rulesSection.style.display = 'block';
      
      rules.forEach(rule => {
          const p = document.createElement('p');
          p.textContent = rule;
          rulesSection.insertBefore(p, continueBtn);
      });
  });

  noBtn.addEventListener('click', () => {
      introSection.style.display = 'none';
      gameSection.style.display = 'block';
      init();
  });

  continueBtn.addEventListener('click', () => {
      rulesSection.style.display = 'none';
      gameSection.style.display = 'block';
      init();
  });
});


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  dealBtn.addEventListener('click', () => {
    init();
    dealInitialCards();
    dealBtn.disabled = true;
  });
  hitBtn.addEventListener('click', playerHit);
  standBtn.addEventListener('click', () => {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealerTurn();
  });
  init();
});

