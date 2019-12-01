const sqlCommands="select|drop|create|alter|update|insert";
const sqlKeywords="AND|OR";
const MAXSCALE = 35;
const TOLERANCE = 0.2;

function midQueryComment(query) {
    let commentRE = new RegExp(`--.*(${sqlCommands}|${sqlKeywords})`, "mgi");
    let commentInstance = query.search(commentRE);

    if (commentInstance >= 0) {
        return 1;
    }
    else {
        return 0;
    }
}

// #4
function tautology(query) {     
    let where = query.search(/where/i);

    if (where != null) {
        let sub1 = query.substring(where + 6);

        let tautInstances = sub1.match(/[^\s]+=[^\s]+/img);
        
        for (const instance of tautInstances) {
            let [a, b] = instance.split("=");
            if (a == b && /or/i.test(sub1)) {
                return 4;
            }
        }
    }

    return 0;
}

// #3
function illegal(query) { 
    let illegalInstance = query.search(/convert/i);

    if (illegalInstance >= 0) {
        return 7;
    }
    else {
        return 0;
    }
}

function union(query) {
    let unionInstance = query.search(/union\s+select/i);

    if (unionInstance >= 0) {
        return 2;
    }
    else {
        return 0;
    }
}

// Highest
function piggyback(query) {
    let piggybackRE = new RegExp(`;\\s*(${sqlCommands})`, "igm");
    let piggybackInstance = query.match(piggybackRE);

    if (piggybackInstance != null) {
        return 9;
    } else {
        return 0;
    }
}

// Higher
function inference(query) {
    let falseInstance = query.match(/[^\s]+=[^\s]+/img);
    let waitforInstance = query.match(/waitfor/igm);

    let falseInstanceScore = 0;
    let waitforInstanceScore = waitforInstance? 4:0;
    if (falseInstance) {
        for (const match of falseInstance) {
            let [a,_] = match.split("=");
            let alpha = a.match(/[a-z]+/img);
            if (alpha && alpha[0].length == a.length) {
                continue;
            } else {
                falseInstanceScore = 3;
                break;
            }
        }
    }

    return falseInstanceScore + waitforInstanceScore
}

function altEncoding(query) {
    let altEncodingRE = new RegExp(`exec|char|ascii`, "igm");
    let hexRE = new RegExp(`((0x)?[0-9a-f]{5,})`, "igm");
    let altEncodingInstance = query.match(altEncodingRE);
    let hexInstance = query.match(hexRE);

    let altScore = altEncodingInstance?4:0;
    let hexScore = hexInstance?1:0;

    return altScore + hexScore;
}

function process() {
    let query = document.getElementById("query").value;
    let results = {
        midQueryComment: midQueryComment(query),
        tautology: tautology(query),
        illegal: illegal(query),
        union: union(query),
        piggyback: piggyback(query),
        inference: inference(query),
        altEncoding: altEncoding(query)
    };

    score(results);
}

function score(results) {
    let percentage = ((results.midQueryComment + results.tautology + results.illegal + results.union + results.piggyback + results.inference + results.altEncoding) / MAXSCALE); 
    console.log(results, {percentage});
    let comment = "Not Found";
    let taut = "Not Found";
    let ill = "Not Found";
    let un = "Not Found";
    let piggy = "Not Found";
    let infer = "Not Found";
    let alt = "Not Found";
    
    if (results.midQueryComment > 0) comment = "Has at least one comment";
    if (results.tautology > 0) taut = "Has an instance of tautology";
    if (results.illegal > 0) ill = "Has illegal SQL command";
    if (results.union > 0) un = "Found UNION with another SELECT query";
    if (results.piggyback > 0) piggy = "Potential piggybacked query found";
    if (results.inference > 0) infer = "Instance Found";
    if (results.altEncoding > 0) alt = "Potentially using alternative encoding";

    let message = spanify`This query was flagged as a${percentage > 1-TOLERANCE? "lmost certainly an":" possible"} SQL Injection attack based on the following criteria:${null}${"lead"}`;
    message += `<span><strong>Comment:</strong> ${comment}</span>
    <span><strong>Tautology:</strong> ${taut}</span>
    <span><strong>Illegal Query:</strong> ${ill}</span>
    <span><strong>Union Query:</strong> ${un}</span>
    <span><strong>Piggy-Backed Query:</strong> ${piggy}</span>
    <span><strong>Inference:</strong> ${infer}</span>
    <span><strong>Alternate Encoding:</strong> ${alt}</span>`

    let issues = document.getElementById("issues");

    let percentageEl = document.getElementById("scale");
    percentageEl.innerHTML = spanify`SQL Injection Likelyhood: ${Math.floor(percentage * 100)}%`;

    if (percentage > TOLERANCE) {
        issues.innerHTML = message;
    } else {
        issues.innerHTML = ''
    }

    setScale(percentage, TOLERANCE);
}