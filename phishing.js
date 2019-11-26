const SCALES = {
  EMAIL: 5,
  URGENCY: 5,
  SPELL: 1,
  GREET: 2,
  PERSONAL: 5,
  URLS: 3
};
const THRESH = 15;
const DOMAINS = [
  "yahoo.com",
  "hotmail.com",
  "gmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com"
];
function emailCheck(email) {
  let scale = 0;
  let idx = email.lastIndexOf("@");
  id = email.slice(0, idx);
  dmn = email.slice(idx + 1);
  len1 = id.length();
  len2 = email.length();
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
  DOMAINS.forEach(d => {
    if (d === dmn) {
      scale += 1;
      break;
    }
  });
  return scale;
}

function dictionaryCheck(body) {
  let words = body.split(" ");
  let greet = words.splice(0, 5);
  // greetingCheck(greet);

  words.forEach(word => {
    /**
     * Call a function for each of the following:
     *
     * Check Urgency
     * Check Mispelling
     * Check Warning/Personal Info (social sec. etc.)
     */
  });
}
function phishCheck(email, body) {
  let val1 = emailCheck(email);
  let val2 = dictionaryCheck(body);
  let result = 0;
  scaleValues.forEach(val => (result += val));
  return result;
}

function onSubmit() {
  let email = document
    .getElementById("email")
    .innerText()
    .toLowerCase();
  let body = document
    .getElementById("email-body")
    .innerText()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  let result = phishCheck(email, body);
  // console.log(result)
  // Show result on Graph/Scale
}
