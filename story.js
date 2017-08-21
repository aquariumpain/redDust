// Event window alert messages
function alertTxt(input, num = 0) {
  if (input == 'low energy') {
    content.innerHTML += `<p>$ Sol ${sol} - ALERT: Low power! Non-essential systems shut down. Emergency power routed to life support systems.</p>`;
  }
  if (input == 'not afford') {
    content.innerHTML += `<p>$ Sol ${sol} - STORE: Not enough Credits!</p>`;
  }
  if (input == 'buy') {
    content.innerHTML += `<p>$ Sol ${sol} - STORE: Thank you for your purchase! ${num} Credits deducted from balance!</p>`;
  }
  content.scrollTop = content.scrollHeight;
}

// Scripted Story
function story() {
  if (sol == 2) {
    content.innerHTML += `<p>$ Sol 2: You watch the sun rise on a hazy red horizon. You've made it through the first day. A shuttle arrives with new people.</p>`;
    content.scrollTop = content.scrollHeight;
  }
}

// Returns a random number between its two arguments [min, max)
function getRand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Generates random events
function events() {
  chance = getRand(1, 30);
  if (chance == 1) {
    content.innerHTML += `<p>$ Sol ${sol}: A dust storm rolls in. Everyone retreats back into the base. The storm coats the solar panels in dust. It will take most of the sol to clear them.</p>`;
    energy.tmpChange(energy.rate - Math.abs(energy.rate), 10000);
  }
  content.scrollTop = content.scrollHeight;
}