var characters = [
  {
    name: 'Red Ranger',
    image: './assets/images/red.svg',
    health: 300,
    attack: 5,
    counter: 10,
  },
  {
    name: 'Blue Ranger',
    image: './assets/images/blue.svg',
    health: 100,
    attack: 7,
    counter: 9,
  },
  {
    name: 'Pink Ranger',
    image: './assets/images/pink.svg',
    health: 250,
    attack: 5,
    counter: 7,
  },
  {
    name: 'Yellow Ranger',
    image: './assets/images/yellow.svg',
    health: 225,
    attack: 6,
    counter: 8,
  },
  {
    name: 'Black Ranger',
    image: './assets/images/black.svg',
    health: 150,
    attack: 4,
    counter: 6,
  },
  {
    name: 'Green Ranger',
    image: './assets/images/green.svg',
    health: 350,
    attack: 10,
    counter: 20,
  },
];
var opponents;

var player = {
  character: '',
  level: 1,
  health: 100,
  maxHealth: 100,
  damage: 20,
  baseDamage: 20,
};
var opponent = {
  character: '',
  level: 1,
  health: 100,
  maxHealth: 100,
  damage: 5,
};

var characterList = $('.character-list');

function playerTurn() {
  $('.attack-btn').attr('disabled', false);
  $('.left').addClass('active');
  $('.right').removeClass('active');
  $('.attack-btn').removeClass('hidden');
}
function playerDead() {
  $('.player-image').addClass('dead');
  $('.end-round').removeClass('win');
  $('.end-round').removeClass('hidden');
  $('.end-round-title').text('You Lose!');
  $('.end-round-button').text('Try Again');
  $('.end-round-button').on('click', () => {
    clearAll();
    pickCharacter();
    $('.end-round-button').off('click');
  });
}
function opponentTurn() {
  $('.attack-btn').addClass('hidden');
  $('.right').addClass('active');
  $('.left').removeClass('active');
  setTimeout(function() {
    player.health -= opponent.damage;
    $('.opponent-image').addClass('attack');
    setTimeout(function() {
      $('.opponent-image').removeClass('attack');
    }, 500);
    $('.left .damage-display').text(-opponent.damage);
    $('.left .damage-display').addClass('hit');
    setTimeout(function() {
      $('.left .damage-display').removeClass('hit');
    }, 500);
    $('.player-health').animate(
      {
        width: `${(player.health / player.maxHealth) * 100}%`,
      },
      700,
      function() {
        if (player.health < 1) {
          playerDead();
        } else {
          playerTurn();
        }
      }
    );
  }, 700);
}

function listOpponents() {
  var opponentList = $(`.opponent-list`);
  $('.opponent-image').empty();
  $('.pick-opponent').removeClass('hidden');

  opponents.forEach((opp, i) => {
    var opponentListCard = $(`<div class="opponent-card"></div>`);
    var opponentListImage = $(`<img src="${opp.image}">`);
    var opponentListHealth = $(
      `<p><span>Health: </span><span>${opp.health}</span></p>`
    );
    var opponentListDamage = $(
      `<p><span>Damage: </span><span>${opp.counter}</span></p>`
    );
    opponentList.append(opponentListCard);
    opponentListCard.append(opponentListImage);
    opponentListCard.append(opponentListHealth);
    opponentListCard.append(opponentListDamage);
    opponentListCard.on('click', () => {
      $('.pick-opponent').addClass('hidden');
      $('.opponent-name').text(opp.name);
      $('.opponent-image').append($(`<img src="${opp.image}">`));
      opponent.character = i;
      opponent.health = opp.health;
      opponent.maxHealth = opp.health;
      opponent.damage = opp.counter;
      $('.opponent-health').animate({
        width: `${(opponent.health / opponent.maxHealth) * 100}%`,
      });

      playerTurn();
    });
  });
}

function opponentDead() {
  opponents = opponents.filter(function(character) {
    return character !== opponents[opponent.character];
  });
  $('.opponent-image').addClass('dead');
  $('.attack-btn').addClass('hidden');
  $('.end-round').addClass('win');
  $('.end-round').removeClass('hidden');
  if (opponents[0]) {
    $('.end-round-title').text('You Won!');
    $('.end-round-button').text('Pick Another Opponent');
    $('.end-round-button').on('click', () => {
      $('.end-round').addClass('hidden');
      $('.opponent-list').empty();
      $('.opponent-image').removeClass('dead');
      opponent.health = 100;
      $('.opponent-health').animate({
        width: `${(opponent.health / opponent.maxHealth) * 100}%`,
      });
      listOpponents();
      $('.end-round-button').off('click');
    });
  } else {
    $('.end-round-title').text('You Won the whole thing!');
    $('.end-round-button').text('Do it again!');
    $('.end-round-button').on('click', () => {
      console.log('why');
      clearAll();
      pickCharacter();
      $('.end-round-button').off('click');
    });
  }
}

$('.attack-btn').on('click', () => {
  $('.attack-btn').attr('disabled', true);
  opponent.health -= player.damage;

  $('.player-image').addClass('attack');
  setTimeout(function() {
    $('.player-image').removeClass('attack');
  }, 500);

  $('.right .damage-display').text(-player.damage);
  $('.right .damage-display').addClass('hit');
  setTimeout(function() {
    $('.right .damage-display').removeClass('hit');
  }, 500);
  $('.opponent-health').animate(
    {
      width: `${(opponent.health / opponent.maxHealth) * 100}%`,
    },
    700,
    function() {
      if (opponent.health < 1) {
        opponentDead();
      } else {
        opponentTurn();
      }
    }
  );
  player.damage += player.baseDamage;
});
function clearAll() {
  $(`.game`).addClass(`hidden`);
  $('.end-round').addClass('hidden');
  $(`.character-pick`).removeClass(`hidden`);
  $(`.opponent-image`).removeClass(`dead`);
  characterList.empty();
  $('.opponent-list').empty();
  opponents = [];
  $('.player-image')
    .empty()
    .removeClass('dead');
}
function pickCharacter() {
  $(`.game`).addClass(`hidden`);
  $('.end-round').addClass('hidden');
  $(`.character-pick`).removeClass(`hidden`);
  characterList.empty();
  characters.forEach((char, i) => {
    var characterCard = $(`<div class="character-card" data-id="${i}"></div>`);
    var characterImage = $(`<img src="${char.image}">`);
    var characterName = $(`<h3></h3>`).text(char.name);
    var characterHealth = $(
      `<p><span>Health: </span><span>${char.health}</span></p>`
    );
    var characterDamage = $(
      `<p><span>Damage: </span><span>${char.attack}</span></p>`
    );

    characterList.append(characterCard);
    characterCard.append(characterImage);
    characterCard.append(characterName);
    characterCard.append(characterHealth);
    characterCard.append(characterDamage);

    characterCard.click(() => {
      var playerImage = $(`<img src="${characters[i].image}">`);
      player.character = i;
      player.damage = characters[i].attack;
      player.baseDamage = characters[i].attack;
      player.health = characters[i].health;
      player.maxHealth = characters[i].health;
      opponents = characters.filter(function(playerChar) {
        return playerChar !== characters[player.character];
      });
      $(`.player-name`).text(characters[player.character].name);
      $(`.player-image`).append(playerImage);
      $(`.character-pick`).addClass(`hidden`);
      $(`.game`).removeClass(`hidden`);
      $('.player-health').animate({
        width: `${(player.health / player.maxHealth) * 100}%`,
      });
      $('.opponent-health').animate({
        width: `${(opponent.health / opponent.maxHealth) * 100}%`,
      });
      listOpponents();
    });
  });
}

pickCharacter();
