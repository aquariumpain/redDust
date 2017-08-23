'use strict';

// Initialize Resources
var energy = new Resource(15, 1, 50);
var credits = new Resource(0, 0.5, 0);
var population = new Resource(5, 1, 10);
var research = new Resource(0, 0, 0);

// Buy Values
var solarVals = {
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
};

var batteryVals = {
  id: 'battery',
  cost: 90,
  rates: {
    energy: 0,
    research: 0,
    population: 0
  },
  caps: {
    energy: 5,
    population: 0
  }
};

var farmVals = {
  id: 'farm',
  cost: 100,
  rates: {
    energy: -1,
    research: 0,
    population: 0
  },
  caps: {
    energy: 0,
    population: 2
  }
};

var labVals = {
  id: 'lab',
  cost: 150,
  rates: {
    energy: -2,
    research: 1,
    population: 0
  },
  caps: {
    energy: 0,
    population: 0
  }
};

var padVals = {
  id: 'pad',
  cost: 400,
  rates: {
    energy: -5,
    research: 0,
    population: 2
  },
  caps: {
    energy: 0,
    population: 0
  }

  // Upgrade Values
};var upgradeBattery = {
  id: 'batUp',
  cost: 500,
  unlock: 25,
  effects: { // Percent Of
    fall: 0.75,
    rise: 1,
    research: 1,
    population: 1
  }
};