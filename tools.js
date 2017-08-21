const content = document.getElementById('consoleText');
const tooltips = document.querySelectorAll('.tooltipText');
const mars = document.getElementById('mars');

// Buttons
const buySolar = document.getElementById('buySolar');
const buyBattery = document.getElementById('buyBattery');
const buyFarm = document.getElementById('buyFarm');
const buyLab = document.getElementById('buyLab');

const upgradeBattery = document.getElementById('batteryUpButton');

//Tooltip Text
const solar = document.getElementById('solar');
const battery = document.getElementById('battery');
const farm = document.getElementById('farm');
const lab = document.getElementById('lab');

const batUp = document.getElementById('batUp');

// Resource Elements
const creds = document.getElementById('credits');
const pop = document.getElementById('population');
const nrg = document.getElementById('energy');
const res = document.getElementById('research');

// Other Variables
let sol = 1;
let rise = 1;
let fall = -1;

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

// Buyable Class
class Buyable {
  constructor(name, cost, rates, caps) {
    this.name = name;
    this.cost = cost;
    this.rates = rates; // [credits, energy, research, population]
    this.caps = caps; // [energy, population]
  }

  buy() {
    if (credits.value >= this.cost) {
      credits.value -= this.cost;

      credits.rate += this.rates[0];
      if (this.rates[1] < 0) fall += this.rates[1]
        else rise += this.rates[1];
      research.rate += this.rates[2];
      population.rate += this.rates[3];

      energy.cap += this.caps[0];
      population.cap += this.caps[1];

      alertTxt('buy', this.cost);
      creds.innerHTML = Math.floor(credits.value);
      pop.innerHTML = `${population.value} / ${population.cap}`;
      nrg.innerHTML = `${energy.value} / ${energy.cap}`;
    } else alertTxt('not afford');
  }
}

// Initialize Buyable Objects
let objSolar = new Buyable('solar', 70,
  [0, 1, 0, 0],
  [0, 0]
);
let objBattery = new Buyable('battery', 90,
  [0, 0, 0, 0],
  [5, 0]
);
let objFarm = new Buyable('farm', 100,
  [0, -1, 0, 0],
  [0, 2]
);
let objLab = new Buyable('lab', 150,
  [0, -2, 1, 0],
  [0, 0]
);

// Initialize Resources
let energy = new Resource(15, 1, 50);
let credits = new Resource(0, 0.5, 0);
let population = new Resource(5, 1, 10);
let research = new Resource(0, 0, 0);

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
    // Prints alert once and won't print again until energy re-drops below lowEnergy
    if (!wasChanged) {
      population.tmpChange(0, 1000);
      credits.tmpChange(credits.rate / 2, 1000);
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

// Updates the values in the tooltips
function updateTips(obj) {
  const outputRates = [
    'Credits<br>',
    'Energy/s<br>',
    'Research/s<br>',
    'Pop/s<br>'
  ];
  const outputCaps = [
    'Energy Cap<br>',
    'Pop Cap<br>'
  ];
  let values = `-${obj.cost} Credits<br>`;
  for (let i = 0; i < obj.rates.length; i++) {
    if (obj.rates[i] != 0) {
      values += `${obj.rates[i]} ${outputRates[i]}`;
    }
  }
  for (let i = 0; i < obj.caps.length; i++) {
    if (obj.caps[i] != 0) {
      values += `${obj.caps[i]} ${outputCaps[i]}`;
    }
  }
  document.getElementById(obj.name).innerHTML = values;
}

solarVals = {
  id: 'solar',
  cost: 70,
  rates: {
    energy: 1,
    research: 0,
    population: 0
  },
  caps: {
    energy: 0,
    population: 0
  }
}

function updateTooltips(item) {
  let tip = document.getElementById(item.id);
  tip.innerHTML = `-${item.cost} Credits`;
  if (item.rates.energy != 0) tip.innerHTML += `<br>${item.rates.energy} Energy/s`;
  if (item.rates.research != 0) tip.innerHTML += `<br>${item.rates.reseaarch} Research/s`;
  if (item.rates.population != 0) tip.innerHTML += `<br>${item.rates.population} Pop/s`;
  if (item.caps.energy != 0) tip.innerHTML += `<br>${item.caps.energy} Total Energy`;
  if (item.caps.population != 0) tip.innerHTML += `<br>${item.rates.population} Total Pop`;
}

function buy(item) {
  if (credits.value >= item.cost) {
    credits.value -= item.cost;

    if (item.rates.energy > 0) rise += item.rates.energy;
    else fall += item.rates.energy;
    research.rate += item.rates.research;
    population.rate += item.rates.population;

    energy.cap += item.caps.energy;
    population.cap += item.caps.population;

    updateTooltips(item);
    alertTxt('buy', item.cost);
  } else alertTxt('not afford');
}

// Button Event Listeners
buySolar.addEventListener('click', () => buy(solarVals));
buyBattery.addEventListener('click', () => objBattery.buy());
buyFarm.addEventListener('click', () => objFarm.buy());
buyLab.addEventListener('click', () => objLab.buy());

/**************** Initial Function Calls ****************/
updateTooltips(solarVals);
updateTips(objBattery);
updateTips(objFarm);
updateTips(objLab);
creds.innerHTML = Math.floor(credits.value);
res.innerHTML = research.value;
nrg.innerHTML = `${energy.value} / ${energy.cap}`;
pop.innerHTML = `${population.value} / ${population.cap}`;

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
  res.innerHTML = research.value;
  events();
  story();
}, 24393.5);

let day = false;
setInterval(() => {
  if (day) {
    energy.rate = rise;
    mars.style.filter = "brightness(100%)";
  }
  else {
    energy.rate = fall;
    mars.style.filter = "brightness(25%)";
  }
  day = !day;
}, 12196.75);