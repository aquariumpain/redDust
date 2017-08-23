// Resource Class
class BoughtItems {
  constructor(data) {
    this.items = {
      solar: data.solar,
      battery: data.battery,
      farm: data.farm,
      lab: data.lab,
      pad: data.pad
    }
    this.upgrades = {
      battery: data.batteryUpgrade
    }
  }
}
