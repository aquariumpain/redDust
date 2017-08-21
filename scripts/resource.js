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