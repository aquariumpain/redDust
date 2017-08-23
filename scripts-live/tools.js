'use strict';

var mars = document.getElementById('mars');

// Resource Elements
var showCredits = document.getElementById('credits');
var showPopulation = document.getElementById('population');
var showEnergy = document.getElementById('energy');
var showResearch = document.getElementById('research');

// Other Variables
var sol = 1;
var rise = 1;
var fall = -1;
var next = 0; // Used in unlocks function

function eventWrite(msg) {
  document.getElementById('consoleText').innerHTML += '<p>$ Sol ' + sol + ': ' + msg + '</p>';
}

var wasChanged = false;
// Adds Resources
function addResources() {
  var lowEnergy = energy.cap / 10;
  credits.value += credits.rate;

  // Energy
  if (energy.value <= energy.cap) energy.value += energy.rate;
  if (energy.value > energy.cap) energy.value = energy.cap;
  if (energy.value < 0) energy.value = 0;
  // If energy drops below lowEnergy
  if (energy.value < lowEnergy) {
    // Prints alert once and won't print again until energy re-drops below lowEnergy
    if (!wasChanged) {
      research.tmpChange(0, 1000);
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
  showEnergy.innerHTML = Math.floor(energy.value) + ' / ' + energy.cap;
}

// Unlocks things when conditions are met
function unlock() {
  if (research.value >= upgradeBattery.unlock && next == 0) {
    eventWrite('Your engineers have successfully figured out how to greatly improve the efficiency of our batteries! The energy loss rate over time for each battery has been reduced. We should be able to slow down our energy loss at night! We just need to fund their production now.');
    document.getElementById('upgradeBattery').parentNode.style.visibility = 'visible';
    next++;
  }
}

function checkExists(property) {
  var isPercent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (isPercent) if (property == 1) return false;
  if (property != 0 && property != undefined) return true;else return false;
}

function resourceTips() {
  document.getElementById('credTip').innerHTML = credits.rate.toFixed(2) + ' / s';
  document.getElementById('resTip').innerHTML = research.rate.toFixed(2) + ' / Sol';
  document.getElementById('energyTip').innerHTML = '<strong>Day:</strong> ' + rise.toFixed(2) + ' / s<br><strong>Night:</strong> ' + fall.toFixed(2) + ' / s';
  document.getElementById('popTip').innerHTML = population.rate.toFixed(2) + ' / Sol';
}

// Updates Tooltip Values
function buyTooltips(item) {
  var tip = document.getElementById(item.id);
  tip.innerHTML = '-' + item.cost + ' Credits';
  if (checkExists(item.rates.energy)) tip.innerHTML += '<br>' + item.rates.energy + ' Energy/s';
  if (checkExists(item.rates.research)) tip.innerHTML += '<br>' + item.rates.research + ' Research/s';
  if (checkExists(item.rates.population)) tip.innerHTML += '<br>' + item.rates.population + ' Pop/s';
  if (checkExists(item.caps.energy)) tip.innerHTML += '<br>' + item.caps.energy + ' Total Energy';
  if (checkExists(item.caps.population)) tip.innerHTML += '<br>' + item.caps.population + ' Total Pop';
  resourceTips();
}

function upgradeTooltips(item) {
  var tip = document.getElementById(item.id);
  tip.innerHTML = '-' + item.cost + ' Credits';
  if (checkExists(item.effects.fall, true)) tip.innerHTML += '<br>-' + (1 - item.effects.fall) * 100 + '% Energy Fall Rate';
  if (checkExists(item.effects.rise, true)) tip.innerHTML += '<br>' + (1 - item.effects.rise) * 100 + '% Energy Rise Rate';
  if (checkExists(item.effects.research, true)) tip.innerHTML += '<br>' + (1 - item.effects.research) * 100 + '% Research Rate';
  if (checkExists(item.effects.population, true)) tip.innerHTML += '<br>' + (1 - item.effects.population) * 100 + '% Population Rate';
  resourceTips();
}

// Adjusts resources when purchase is made
function buy(item) {
  if (credits.value >= item.cost) {
    credits.value -= item.cost;

    if (item.rates.energy > 0) rise += item.rates.energy;else fall += item.rates.energy;
    research.rate += item.rates.research;
    population.rate += item.rates.population;

    energy.cap += item.caps.energy;
    population.cap += item.caps.population;

    showCredits.innerHTML = Math.floor(credits.value);
    showPopulation.innerHTML = population.value + ' / ' + population.cap;
    showEnergy.innerHTML = Math.floor(energy.value) + ' / ' + energy.cap;

    buyTooltips(item);
    alertTxt('buy', item.cost);
  } else alertTxt('not afford');
}

function upgrade(item) {
  if (credits.value >= item.cost) {
    credits.value -= item.cost;
    fall *= item.effects.fall;
    rise *= item.effects.rise;
    research.rate *= item.effects.research;
    population.rate *= item.effects.population;

    showCredits.innerHTML = Math.floor(credits.value);
    showPopulation.innerHTML = population.value + ' / ' + population.cap;
    showEnergy.innerHTML = Math.floor(energy.value) + ' / ' + energy.cap;

    upgradeTooltips(item);
    alertTxt('buy', item.cost);
  } else alertTxt('not afford');
}

// Button Event Listeners
document.getElementById('buySolar').addEventListener('click', function () {
  return buy(solarVals);
});
document.getElementById('buyBattery').addEventListener('click', function () {
  return buy(batteryVals);
});
document.getElementById('buyFarm').addEventListener('click', function () {
  return buy(farmVals);
});
document.getElementById('buyLab').addEventListener('click', function () {
  return buy(labVals);
});;
document.getElementById('buyPad').addEventListener('click', function () {
  return buy(padVals);
});;
document.getElementById('upgradeBattery').addEventListener('click', function () {
  return upgrade(upgradeBattery);
});

/**************** Intervals ****************/

// Interval runs each second
// Resource gain
setInterval(function () {
  addResources();
}, 1000);

// Sol Interval
// 1 Sol = 24 Hours 39 Minutes 35 Seconds
// Shifted down so hours are seconds
setInterval(function () {
  sol++;
  document.getElementById('sol').innerHTML = 'Sol ' + sol;

  if (population.value + population.rate < population.cap) population.value += population.rate;else population.value = population.cap;

  credits.rate = population.value / 10;
  research.value += research.rate;

  showPopulation.innerHTML = population.value + ' / ' + population.cap;
  showResearch.innerHTML = research.value;
  unlock();
  events();
  story();
  resourceTips();
}, 24393.5);

var day = false;
setInterval(function () {
  if (day) {
    energy.rate = rise;
    mars.style.filter = "brightness(100%)";
  } else {
    energy.rate = fall;
    mars.style.filter = "brightness(25%)";
  }
  day = !day;
}, 12196.75);

/**************** Initial Function Calls ****************/
resourceTips();
buyTooltips(solarVals);
buyTooltips(batteryVals);
buyTooltips(farmVals);
buyTooltips(labVals);
buyTooltips(padVals);
upgradeTooltips(upgradeBattery);
showCredits.innerHTML = Math.floor(credits.value);
showResearch.innerHTML = research.value;
showEnergy.innerHTML = Math.floor(energy.value) + ' / ' + energy.cap;
showPopulation.innerHTML = population.value + ' / ' + population.cap;