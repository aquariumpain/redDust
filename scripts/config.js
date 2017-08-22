// Initialize Resources
const energy = new Resource(15, 1, 50);
const credits = new Resource(0, 0.5, 0);
const population = new Resource(5, 1, 10);
const research = new Resource(0, 0, 0);

// Buy Values
const solarVals = {
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

const batteryVals = {
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
}

const farmVals = {
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
}

const labVals = {
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
}

const padVals = {
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
}

// Upgrade Values
const upgradeBattery = {
  id: 'batUp',
  cost: 500,
  unlock: 25,
  effects: { // Percent Of
    fall: 0.75,
    rise: 1,
    research: 1,
    population: 1
  }
}