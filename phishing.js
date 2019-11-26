const SCALES = {
  URGENCY: 5,
  CONFRIM: 6
};
const TOTALSCALE = 20;
const THRESH = 7;

function emailCheck(email) {
  let scale = 0;
  let idx = email.lastIndexOf("@");
  id = email.slice(0, idx);
  dmn = email.slice(idx + 1);
  len1 = id.length();
  len2 = dmn.length();

  // Check Email ID for Number Count >= 3
  numCount = 0;
  for (i = 0; i < len1; i++) {
    if (typeof id[i] === "number") numCount++;
    if (numCount >= 3) {
      scale += 2;
      break;
    }
  }

  // Check Email Domain for Number Count >= 1
  numCount = 0;
  for (i = 0; i < len2; i++) {
    if (typeof dmn[i] === "number") numCount++;
    if (numCount >= 1) {
      scale += 2;
      break;
    }
  }

  // Check Email Domain for Common Domain
  let isCommon = false;
  DOMAINS.forEach(d => {
    if (d === dmn) {
      isCommon = true;
      break;
    }
  });
  if (!isCommon) scale += 1;

  return scale;
}

function URLcheck(body) {
  url = body.match(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  );
  if (url) return 2;
  return 0;
}

function greetingCheck(greeting) {
  let scale = 0;
  for (i = 0; i < 5; i++) {
    let found = GREETINGS.find(greet => {
      greeting[i] === greet;
    });
    if (found) scale += 1;
    if (scale > 1) return 2;
  }
  return scale;
}

function urgencyCheck(word) {
  let found = URGENCY_WORDS.find(w => w === word);
  if (found) return 5 / 3;
  return 0;
}

function confirmCheck(word) {
  let found = CONFIRMING_WORDS.find(w => w === word);
  if (found) return 2;
  return 0;
}

function dictionaryCheck(body) {
  body.replace(/[.,'\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\r?\n|\r/g, " "); // Remove special chars
  let words = body.split(" ");
  words = words.filter(w => Boolean(w)); //Remove falsey values
  let greeting = words.splice(0, 5);
  let grtScale = greetingCheck(greeting);
  let urgScale = 0;
  let cfmScale = 0;
  words.forEach(word => {
    if (urgScale < SCALES.URGENCY) urgScale += urgencyCheck(word);
    if (cfmScale < SCALES.CONFRIM) cfmScale += confirmCheck(word);
  });
  return { grtScale, urgScale, cfmScale };
}

function phishCheck(email, body) {
  let eScale = emailCheck(email);
  let urlScale = URLcheck(body);
  let dictScale = dictionaryCheck(body);
  let { grtScale, urgScale, cfmScale } = dictScale;
  console.log(
    "email:",
    eScale,
    "URL",
    urlScale,
    "greet:",
    grtScale,
    "urgency",
    urgScale,
    "confirm",
    cfmScale
  );
  let result =
    (eScale + urlScale + dictScale + grtScale + urgScale + cfmScale) /
    TOTALSCALE;
  return result;
}
function onSubmit() {
  let email = document.getElementById("email").value.toLowerCase();
  let body = document.getElementById("email-body").value.toLowerCase();
  let phishPercentage = phishCheck(email, body);
  console.log(phishPercentage);
  // Show result on Graph/Scale
}
