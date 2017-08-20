const content = document.getElementById('consoleText');
const buyButtons = document.querySelectorAll('buyButton');

// Buttons
const solar = document.getElementById('solar');
const battery = document.getElementById('battery');
const farm = document.getElementById('farm');

// Resource Elements
const creds = document.getElementById('credits');
const pop = document.getElementById('population');
const nrg = document.getElementById('energy');

class Resource {
  constructor(initVal, initRate, initCap) {
    this.value = initVal;
    this.rate = initRate;
    this.cap = initCap;
  }
}

class Currency {
  constructor(initVal, initRate) {
    this.value = initVal;
    this.rate = initRate;
  }
}

// Set Starting Values
let sol = 1;
let credits = new Currency(0, 0.5);
let population = new Resource(5, 1, 10);

// Initialize Resources
let energy = new Resource(10, 1, 50);

// Event window alert messages
function alertTxt(input) {
  if (input == 'low energy') {
    content.innerHTML += '<p>$ ALERT: Low power! Non-essential systems shut down. Emergency power routed to life support systems.</p>';
  }
}


let tmpPopRate = population.rate;
let wasChanged = false;
// Adds Resources
function addResources() {
  let lowEnergy = energy.cap / 5;
  credits.value += credits.rate;

  if (energy.value <= energy.cap) energy.value += energy.rate;
  if (energy.value > energy.cap) energy.value = energy.cap;
  if (energy.value < 0) energy.value = 0;
  // If energy drops below lowEnergy
  if (energy.value < lowEnergy) {
    if (wasChanged == false) {
      tmpPopRate = population.rate;
      population.rate = 0;
      credits.rate /= 2;
      alertTxt('low energy');
    }
    wasChanged = true;
    document.documentElement.style.setProperty('--color2', '#888');
  }
  // If energy rises back above lowEnergy
  if (energy.value > lowEnergy) {
    if (wasChanged == true) {
      population.rate = tmpPopRate;
      credits.rate *= 2;
    }
    document.documentElement.style.setProperty('--color2', '#D7D7D7');
    wasChanged = false;
  }

  creds.innerHTML = Math.floor(credits.value);
  nrg.innerHTML = `${energy.value} / ${energy.cap}`;
}

// Adds Sol
function addSol() {
  sol++;
  document.getElementById('sol').innerHTML = `Sol ${sol}`;
}

function canAfford(cost) {
  if (cost > credits.value) return false;
  else {
    credits.value -= cost;
    creds.innerHTML = Math.floor(credits.value);
    return true;
  }
}

// Scripted Story
function story() {
  if (sol == 2) {
    content.innerHTML += '<p>$ You have made it through the first day!</p>';
    content.scrollTop = content.scrollHeight;
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
    population.cap += 10;
    pop.innerHTML = `${population.value} / ${population.cap}`;
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

  pop.innerHTML = `${population.value} / ${population.cap}`;
  story();
}, 24393.5)