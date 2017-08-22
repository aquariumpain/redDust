const mars = document.getElementById('mars');

// Resource Elements
const showCredits = document.getElementById('credits');
const showPopulation = document.getElementById('population');
const showEnergy = document.getElementById('energy');
const showResearch = document.getElementById('research');

// Other Variables
let sol = 1;
let rise = 1;
let fall = -1;

function eventWrite(msg) {
  document.getElementById('consoleText').innerHTML += `<p>$ Sol ${sol}: ${msg}</p>`;
}

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

  showCredits.innerHTML = Math.floor(credits.value);
  showEnergy.innerHTML = `${energy.value} / ${energy.cap}`;
}

// Unlocks things when conditions are met
function unlock() {
  if (research.value >= upgradeBattery.unlock) {
    eventWrite('Your engineers have successfully figured out how to greatly improve the efficiency of our batteries! The energy loss rate over time for each battery has been reduced. We should be able to slow down our energy loss at night! We just need to fund their production now.');
    document.getElementById('upgradeBattery').parentNode.style.visibility = 'visible';
  }
}

function checkExists(property, isPercent = false) {
  if (isPercent)
    if (property == 1) return false;
  if (property != 0 && property != undefined) return true;
  else return false;
}

// Updates Tooltip Values
function buyTooltips(item) {
  let tip = document.getElementById(item.id);
  tip.innerHTML = `-${item.cost} Credits`;
  if (checkExists(item.rates.energy))
    tip.innerHTML += `<br>${item.rates.energy} Energy/s`;
  if (checkExists(item.rates.research))
    tip.innerHTML += `<br>${item.rates.research} Research/s`;
  if (checkExists(item.rates.population))
    tip.innerHTML += `<br>${item.rates.population} Pop/s`;
  if (checkExists(item.caps.energy))
    tip.innerHTML += `<br>${item.caps.energy} Total Energy`;
  if (checkExists(item.caps.population))
    tip.innerHTML += `<br>${item.caps.population} Total Pop`;
}

function upgradeTooltips(item) {
  let tip = document.getElementById(item.id);
  tip.innerHTML = `-${item.cost} Credits`;
  if (checkExists(item.effects.fall, true))
    tip.innerHTML += `<br>-${(1 - item.effects.fall) * 100}% Energy Fall Rate`;
  if (checkExists(item.effects.rise, true))
    tip.innerHTML += `<br>${(1 - item.effects.rise) * 100}% Energy Rise Rate`;
  if (checkExists(item.effects.research, true))
    tip.innerHTML += `<br>${(1 - item.effects.research) * 100}% Research Rate`;
  if (checkExists(item.effects.population, true))
    tip.innerHTML += `<br>${(1 - item.effects.population) * 100}% Population Rate`;
}

// Adjusts resources when purchase is made
function buy(item) {
  if (credits.value >= item.cost) {
    credits.value -= item.cost;

    if (item.rates.energy > 0) rise += item.rates.energy;
    else fall += item.rates.energy;
    research.rate += item.rates.research;
    population.rate += item.rates.population;

    energy.cap += item.caps.energy;
    population.cap += item.caps.population;

    showCredits.innerHTML = Math.floor(credits.value);
    showPopulation.innerHTML = `${population.value} / ${population.cap}`;
    showEnergy.innerHTML = `${energy.value} / ${energy.cap}`;

    buyTooltips(item);
    alertTxt('buy', item.cost);
  } else alertTxt('not afford');
}

function upgrade(item) {
  if (credits.value >= item.cost) {
    fall *= item.effects.fall;
    rise *= item.effetx.rise;
    research.rate *= item.effects.research;
    population.rate *= item.effects.population;

    showCredits.innerHTML = Math.floor(credits.value);
    showPopulation.innerHTML = `${population.value} / ${population.cap}`;
    showEnergy.innerHTML = `${energy.value} / ${energy.cap}`;

    upgradeTooltips(item);
    alertTxt('buy', item.cost);
  } else alertTxt('not afford');
}

// Button Event Listeners
document.getElementById('buySolar').addEventListener('click', () => buy(solarVals));
document.getElementById('buyBattery').addEventListener('click', () => buy(batteryVals));
document.getElementById('buyFarm').addEventListener('click', () => buy(farmVals));
document.getElementById('buyLab').addEventListener('click', () => buy(labVals));;
document.getElementById('buyPad').addEventListener('click', () => buy(padVals));;
document.getElementById('upgradeBattery').addEventListener('click', () => upgrade(upgradeBattery));

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
  sol++;
  document.getElementById('sol').innerHTML = `Sol ${sol}`;

  if (population.value < population.cap) population.value += population.rate;
  else population.value = population.cap;

  credits.rate = population.value / 10;
  research.value += research.rate;

  showPopulation.innerHTML = `${population.value} / ${population.cap}`;
  showResearch.innerHTML = research.value;
  unlock();
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

/**************** Initial Function Calls ****************/
buyTooltips(solarVals);
buyTooltips(batteryVals);
buyTooltips(farmVals);
buyTooltips(labVals);
buyTooltips(padVals);
upgradeTooltips(upgradeBattery);
showCredits.innerHTML = Math.floor(credits.value);
showResearch.innerHTML = research.value;
showEnergy.innerHTML = `${energy.value} / ${energy.cap}`;
showPopulation.innerHTML = `${population.value} / ${population.cap}`;