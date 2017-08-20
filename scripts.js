const content = document.getElementById('consoleText');

// Buttons
const solar = document.getElementById('solar');
const battery = document.getElementById('battery');

// Resource Elements
const credits = document.getElementById('credits');
const population = document.getElementById('population');
const nrg = document.getElementById('energy');

class Resource {
  constructor(initVal, initCap, initRate, cost) {
    this.value = initVal;
    this.cap = initCap;
    this.rate = initRate;
    this.cost = cost;
  }

  buy(rate, cap) {
    if (cred >= this.cost) {
      cred -= this.cost;
      this.rate += rate;
      this.cap += cap;
    }
  }
}

// Set starting values
let sol = 1;
let energy = new Resource(0, 50, 1, 15);
let cred = 0;
let pop = 50;

//Set starting rates and caps
let credRate = 1;


// Adds resources
function addResources() {
  cred += credRate;
  if (energy.value < energy.cap) energy.value += energy.rate;
  if (energy.value > energy.cap) energy.value = energy.cap;

  credits.innerHTML = cred;
  nrg.innerHTML = `${energy.value} / ${energy.cap}`;
}

// Adds Sol
function addSol() {
  sol++;
  document.getElementById('sol').innerHTML = sol;
}

function story() {
  if (sol == 2) {
    content.innerHTML += '<p>$ You have made it through the first day!</p>';
    content.scrollTop = content.scrollHeight;
  }
}

// Button Event Listeners
solar.addEventListener('click', () => energy.buy(1, 0));
battery.addEventListener('click', () => energy.buy(0, 15))

// Interval runs each second
// Resource gain
setInterval(() => {
  addResources();
  console.log(energy.rate);
}, 1000)

// Sol Interval
// 1 Sol = 24 Hours 39 Minutes 35 Seconds
// Shifted down so hours are seconds
setInterval(() => {
  addSol();
  story();
}, 24393.5)