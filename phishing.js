const SCALES = {
  EMAIL: 5,
  URGENCY: 5,
  SPELL: 1,
  GREET: 2,
  PERSONAL: 5,
  URLS: 3
};

const THRESH = 15;

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

function spellCheck(word) {}

function greetingCheck(greeting) {}

function urgencyCheck(word) {}

function confirmCheck(word) {}

function dictionaryCheck(body) {
  let words = body.split(" ");
  words = words.filter(w => Boolean(w)); //Remove Newlines and Returns
  let greeting = words.splice(0, 5);

  let greetVal = greetingCheck(greeting); // Check Greeting
  let urgVal = 0;
  let spellVal = 0;
  let confirmVal = 0;

  /**
   *  For each word in body check:
   *  1. Urgency words
   *  2. Spelling
   *  3. Confirm Words
   * */

  words.forEach(word => {
    urgVal += urgencyCheck(word);
    spellVal += spellCheck(word);
    confirmVal += confirmCheck(word);
  });

  // RESCALE VALUES FIRST!
  // return greetVal + urgVal + spellVal + confirmVal;
}
function phishCheck(email, body) {
  let val1 = emailCheck(email);
  let val2 = dictionaryCheck(body);
  let result = 0;
  scaleValues.forEach(val => (result += val));
  return result;
}

function onSubmit() {
  let email = document.getElementById("email").value.toLowerCase();
  let body = document
    .getElementById("email-body")
    .value.toLowerCase()
    .replace(/[.,'\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove Puntuation
    .replace(/\r?\n|\r/g, " "); // Remove Newlines and Returns

  // let result = phishCheck(email, body);
  // console.log(result)
  // Show result on Graph/Scale
}
