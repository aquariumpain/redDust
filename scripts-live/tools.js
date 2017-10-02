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

// Initialize Resources
var energy = new Resource({
  value: 15,
  rate: 1,
  cap: 50
});
var credits = new Resource({
  value: 0,
  rate: 0.5,
  cap: 0
});
var population = new Resource({
  value: 5,
  rate: 1,
  cap: 10
});
var research = new Resource({
  value: 0,
  rate: 0,
  cap: 0
});
// Initialize BoughtItems
var items = new BoughtItems({
  items: {
    solar: 0,
    battery: 0,
    farm: 0,
    lab: 0,
    pad: 0
  },
  upgrades: {
    batUp: 0
  }
});

// Save Data
function populateStorage() {
  localStorage.setItem('sol', sol);
  localStorage.setItem('rise', rise);
  localStorage.setItem('fall', fall);
  localStorage.setItem('next', next);
  localStorage.setItem('energy', JSON.stringify(energy));
  localStorage.setItem('credits', JSON.stringify(credits));
  localStorage.setItem('population', JSON.stringify(population));
  localStorage.setItem('research', JSON.stringify(research));
  localStorage.setItem('items', JSON.stringify(items));

  setValues();

  console.log('Saved');
}

function setValues() {
  sol = Number(localStorage.getItem('sol'));
  rise = Number(localStorage.getItem('rise'));
  fall = Number(localStorage.getItem('fall'));
  next = Number(localStorage.getItem('next'));
  energy = new Resource(JSON.parse(localStorage.getItem('energy')));
  credits = new Resource(JSON.parse(localStorage.getItem('credits')));
  population = new Resource(JSON.parse(localStorage.getItem('population')));
  research = new Resource(JSON.parse(localStorage.getItem('research')));
  items = new BoughtItems(JSON.parse(localStorage.getItem('items')));
}

function storageAvailable(type) {
  try {
    var storage = window[type],
        x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
    // everything except Firefox
    e.code === 22 ||
    // Firefox
    e.code === 1014 ||
    // test name field too, because code might not be present
    // everything except Firefox
    e.name === 'QuotaExceededError' ||
    // Firefox
    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
    // acknowledge QuotaExceededError only if there's something already stored
    storage.length !== 0;
  }
}

if (storageAvailable('localStorage')) {
  // Yippee! We can use localStorage awesomeness
  console.log('Can Save!');
  if (localStorage.length == 0) {
    populateStorage();
  } else {
    setValues();
  }
} else {
  // Too bad, no localStorage for us
  console.log('Can\'t Save!');
}

function flash(msg) {
  var flashMsg = document.getElementById('flash');
  flashMsg.innerHTML = msg;
  flashMsg.style.top = '15px';
  flashMsg.style.opacity = '1';
  setTimeout(function () {
    flashMsg.style.top = '-50px';
    flashMsg.style.opacity = '0';
  }, 3000);
}

// Writes to the event window
function eventWrite(msg) {
  document.getElementById('consoleText').innerHTML += '<p>$ Sol ' + sol + ': ' + msg + '</p>';
}

var wasChanged = false;
var holdPop = population.rate;
var holdRes = research.rate;
var holdCreds = credits.rate;
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
      holdPop = population.rate;
      holdRes = research.rate;
      holdCreds = credits.rate;
      research.rate = 0;
      population.rate = 0;
      credits.rate = holdCreds / 2;
      alertTxt('low energy');
      wasChanged = true;
    }
    document.documentElement.style.setProperty('--color2', '#888');
  }
  // If energy rises back above lowEnergy
  if (energy.value > lowEnergy) {
    if (wasChanged) {
      research.rate = holdRes;
      population.rate = holdPop;
      credits.rate = holdCreds;
    }
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
    document.getElementById('batUpNum').className += ' buyNum';
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
  var numTip = document.getElementById(item.id + 'Num');
  var numVal = items.items[item.id];
  numTip.innerHTML = 'You have ' + numVal;
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
  var numTip = document.getElementById(item.id + 'Num');
  var numVal = items.upgrades[item.id];
  numTip.innerHTML = 'You have ' + numVal;
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

    // Increment Buy Counter
    items.items[item.id]++;

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

    // Increment Upgrade Counter
    items.upgrades[item.id]++;

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

document.getElementById('save').addEventListener('click', function () {
  populateStorage();
  flash('Save Successful!');
});
document.getElementById('reset').addEventListener('click', function () {
  if (window.confirm('Are you sure you want to reset all values?')) {
    localStorage.clear();
    flash('Game Reset: Refresh page to start over!');
    window.location.reload();
  }
});

/**************** Intervals ****************/

// Interval runs each second
// Resource gain
setInterval(function () {
  addResources();
  resourceTips();
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
  populateStorage();
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
unlock();
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
document.getElementById('sol').innerHTML = 'Sol ' + sol;
