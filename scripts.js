const content = document.getElementById('consoleText');

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

  buy(cost, rate, cap) {
    if (credits.value >= cost) {
      credits.value -= cost;
      this.rate += rate;
      this.cap += cap;
      
      creds.innerHTML = credits.value;
    }
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
let tmpRate = 1;
let credits = new Currency(0, 1);
let population = new Resource(5, 1, 10);

// Initialize Resources
let energy = new Resource(10, 1, 50);

let tmpPopRate = population.rate;
let wasChanged = false;
// Adds Resources
function addResources() {
  if (credits.rate > 0) tmpRate = credits.rate;
  credits.value += credits.rate;
  if (energy.value <= energy.cap) energy.value += energy.rate;
  if (energy.value > energy.cap) energy.value = energy.cap;
  if (energy.value < 0) energy.value = 0;
  // If energy drops below 10
  if (energy.value < 10) {
    if (wasChanged == false) {
      tmpPopRate = population.rate;
      population.rate = 0;
      credits.rate /= 2;
    }
    wasChanged = true;
    document.documentElement.style.setProperty('--color2', '#888');
  }
  // If energy rises back above 10
  if (energy.value > 10) {
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

// Scripted Story
function story() {
  if (sol == 2) {
    content.innerHTML += '<p>$ You have made it through the first day!</p>';
    content.scrollTop = content.scrollHeight;
  }
}

// Button Event Listeners
solar.addEventListener('click', () => energy.buy(50, 1, 0));
battery.addEventListener('click', () => energy.buy(25, 0, 15));
farm.addEventListener('click', () => {
  energy.buy(5, -1, 0);
  energy.value--;
  credits.rate++;
  population.cap += 2;

  pop.innerHTML = `${population.value} / ${population.cap}`;
});

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

  pop.innerHTML = `${population.value} / ${population.cap}`;
  story();
}, 24393.5)