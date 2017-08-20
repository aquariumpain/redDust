const content = document.getElementById('consoleText');
const buyButtons = document.querySelectorAll('buyButton');

function loadJSON(callback) {
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', 'https://apjohns.github.io/redDust/buyables.json', true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState == 4 && xobj.status == '200') {
      xobj.responseType('json');
      callback(xobj.response);
    }
  };
  xobj.send(null);
}

const buyables = loadJSON((response) => response);


// Buttons
const solar = document.getElementById('solar');
const battery = document.getElementById('battery');
const farm = document.getElementById('farm');
const lab = document.getElementById('lab');

// Resource Elements
const creds = document.getElementById('credits');
const pop = document.getElementById('population');
const nrg = document.getElementById('energy');

// Buyable JSON


// Resource Class
class Resource {
  constructor(initVal, initRate, initCap) {
    this.value = initVal;
    this.rate = initRate;
    this.cap = initCap;
  }

  // Temporarily changes a rate for a given amount of time
  tmpChange(amount, time) {
    let hold = this.rate;
    this.rate = amount;
    setTimeout(() => {
      this.rate = hold;
    }, time);
  }
}

let sol = 1;
// Initialize Resources
let energy = new Resource(10, 1, 50);
let credits = new Resource(0, 0.5, 0);
let population = new Resource(5, 1, 10);
let research = new Resource(0, 0, 0);

// Event window alert messages
function alertTxt(input, num = 0) {
  if (input == 'low energy') {
    content.innerHTML += `<p>$ Sol ${sol} - ALERT: Low power! Non-essential systems shut down. Emergency power routed to life support systems.</p>`;
  }
  if (input == 'not afford') {
    content.innerHTML += `<p>$ Sol ${sol} - STORE: Not enough Credits!</p>`;
  }
  if (input == 'buy') {
    content.innerHTML += `<p>$ Sol ${sol} - STORE: Thank you for your purchase! ${num} Credits deducted from balance!</p>`;
  }
}

let tmpPopRate = population.rate;
let wasChanged = false;
// Adds Resources
function addResources() {
  let lowEnergy = energy.cap / 5;
  credits.value += credits.rate;

  // Energy
  if (energy.value <= energy.cap) energy.value += energy.rate;
  if (energy.value > energy.cap) energy.value = energy.cap;
  if (energy.value < 0) energy.value = 0;
  // If energy drops below lowEnergy
  if (energy.value < lowEnergy) {
    population.tmpChange(0, 1000);
    credits.tmpChange(credits.rate / 2, 1000);

    // Prints alert once and won't print again until energy re-drops below lowEnergy
    if (!wasChanged) {
      alertTxt('low energy');
      wasChanged = true;
    }
    document.documentElement.style.setProperty('--color2', '#888');
  }
  // If energy rises back above lowEnergy
  if (energy.value > lowEnergy) {
    wasChanged = false;
    document.documentElement.style.setProperty('--color2', '#D7D7D7');
  }

  creds.innerHTML = Math.floor(credits.value);
  nrg.innerHTML = `${energy.value} / ${energy.cap}`;
}

// Adds Sol
function addSol() {
  sol++;
  document.getElementById('sol').innerHTML = `Sol ${sol}`;
}

// Checks if the player has enough credits for purchase
function canAfford(cost) {
  if (cost > credits.value) {
    alertTxt('not afford');
    return false;
  }
  else {
    alertTxt('buy', cost);
    credits.value -= cost;
    creds.innerHTML = Math.floor(credits.value);
    return true;
  }
}

// Scripted Story
function story() {
  if (sol == 2) {
    content.innerHTML += `<p>$ Sol 2: You watch the sun set on hazy red horizon. You've made it through the first day. In the morning a shuttle arrives with new people.</p>`;
    content.scrollTop = content.scrollHeight;
  }
}

// Returns a random number between its two arguments [min, max)
function getRand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Generates random events
function events() {
  chance = getRand(1, 30);
  if (chance == 1) {
    content.innerHTML += `<p>$ Sol ${sol}: A dust storm rolls in. Everyone retreats back into the base. The storm coats the solar panels in dust. It will take most of the sol to clear them.</p>`;
    energy.tmpChange(energy.rate - Math.abs(energy.rate), 10000);
  }
}

// Button Event Listeners
solar.addEventListener('click', () => {
  if (canAfford(60)) {
    energy.rate += 1;
  }
});
battery.addEventListener('click', () => {
  if (canAfford(25)) {
    energy.cap += 5;
  }
});
farm.addEventListener('click', () => {
  if (canAfford(80)) {
    energy.value--;
    energy.rate--;
    population.cap += 4;
    pop.innerHTML = `${population.value} / ${population.cap}`;
  }
});
lab.addEventListener('click', () => {
  if (canAfford(100)) {
    research.rate++;
    energy.rate -= 2;
  }
});

/**************** Intervals ****************/

// Interval runs each second
// Resource gain
setInterval(() => {
  addResources();
}, 1000)

// Sol Interval
// 1 Sol = 24 Hours 39 Minutes 35 Seconds
// Shifted down so hours are seconds
setInterval(() => {
  addSol();
  if (population.value < population.cap) population.value += population.rate;
  else population.value = population.cap;

  credits.rate = population.value / 10;
  research.value += research.rate;

  pop.innerHTML = `${population.value} / ${population.cap}`;
  events();
  story();
}, 24393.5)

console.log(buyables.battery.cost);