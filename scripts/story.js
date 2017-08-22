const content = document.getElementById('consoleText');

// Event window alert messages
function alertTxt(input, num = 0) {
  if (input == 'low energy') {
    eventWrite(`- ALERT - Low power! Non-essential systems shut down. Emergency power routed to life support systems`);
  }
  if (input == 'not afford') {
    eventWrite(`- STORE - Not enough Credits!`);
  }
  if (input == 'buy') {
    eventWrite(`- STORE - Thank you for your purchase! ${num} Credits deducted from balance!`);
  }
  content.scrollTop = content.scrollHeight;
}

// Scripted Story
function story() {
  if (sol == 2) {
    eventWrite(`You watch the sun rise on a hazy red horizon. You've made it through the first day. A shuttle arrives with new people.`);
    content.scrollTop = content.scrollHeight;
  }
  if (sol == 10) {
    eventWrite(`Systems United has decided to award you 500 credits as a starting bonus.`);
    credits.value += 500;
    content.scrollTop = content.scrollHeight;
  }
  if (sol == 549) {
    eventWrite(`Its been 549 sols since the colony started. Mars really feels like home now. How did Mark Watney survive here alone with so few resources for this long in 2037?`);
    content.scrollTop = content.scrollHeight;
  }
  if (sol == 668) {
    eventWrite(`Today is the one martian year anniversary of the colony! As a reward for making it this far, Systems United has gifted you 500,000 credits to spend as you please!`);
    credits.value += 500000;
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
    eventWrite(`A dust storm rolls in. Everyone retreats back into the base. The storm coats the solar panels in dust. It will take most of the sol to clear them.`);
    energy.tmpChange(0, 10000);
  }
  content.scrollTop = content.scrollHeight;
}