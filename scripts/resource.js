// Resource Class
class Resource {
  constructor(data) {
    this.value = data.value;
    this.rate = data.rate;
    this.cap = data.cap;
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