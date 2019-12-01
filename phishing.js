const SCALES = { URGENCY: 5, CONFRIM: 6 };
const TOTALSCALE = 20;
const THRESH = 0.33;

function emailCheck(email) {
  let scale = 0;
  let idx = email.lastIndexOf("@");
  id = email.slice(0, idx);
  dmn = email.slice(idx + 1);
  len1 = id.length;
  len2 = dmn.length;
  // Check Email ID for Number Count >= 3
  idNums = id.replace(/\D/g, "");
  if (idNums && idNums.length >= 3) scale += 2;
  // Check Email Domain for Number Count > 0
  dmnNums = dmn.replace(/\D/g, "");
  if (dmnNums && dmnNums.length > 0) scale += 2;
  // Check Email Domain for Common Domain
  let found = DOMAINS.find(d => d === dmn);
  if (!found) scale += 1;
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
  for (i = 0; i < 3; i++) {
    let found = GREETINGS.find(greet => greeting[i] === greet);
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
  body = body
    .replace(/[.,'\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\r?\n|\r/g, " "); // Remove special chars
  let words = body.split(" ");
  words = words.filter(w => Boolean(w)); //Remove falsey values
  let greeting = words.splice(0, 3);
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
  return { eScale, urlScale, grtScale, urgScale, cfmScale };
}
function onSubmit() {
  let email = document.getElementById("email").value.toLowerCase();
  let body = document.getElementById("email-body").value.toLowerCase();
  let phishScales = phishCheck(email, body);
  const { eScale, urlScale, grtScale, urgScale, cfmScale } = phishScales;
  let phishPercentage =
    (eScale + urlScale + grtScale + urgScale + cfmScale) / TOTALSCALE;

  // TODO:
  console.log("Phishing Percentage: ", phishPercentage);

  let percentageEl = document.getElementById("scale");
  percentageEl.innerHTML = spanify`Likelyhood of Phishing: ${phishPercentage * 100}%`;

  
  let results = '';
  let issuesEl = document.getElementById("issues");

  if (phishPercentage >= THRESH) {
    results += spanify`This email was flagged as a${percentage > 1-TOLERANCE? "lmost certainly a":" possible"} phishing attack based on the following criteria:${null}${"lead"}`;
    results += spanify`<strong>Uncommon Email:</strong> ${(eScale / TOTALSCALE) * 100}%`;
    results += spanify`<strong>Contains URLs:</strong> ${(urlScale / TOTALSCALE) * 100 }%`;
    results += spanify`<strong>Uncommon Greeting:</strong> ${(grtScale / TOTALSCALE) * 100}%`;
    results += spanify`<strong>Urgency Words:</strong> ${(urgScale / TOTALSCALE) * 100}%`;
    results += spanify`<strong>Confirmation/Personal Information Words:</strong> ${(cfmScale / TOTALSCALE) * 100}%`;
  }
  issuesEl.innerHTML = results;
  // Show result on Graph/Scale
  setScale(phishPercentage, THRESH);
}
