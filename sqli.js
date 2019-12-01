const sqlCommands="select|drop|create|alter|update|insert";
const sqlKeywords="AND|OR";

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

        let or = sub1.matchAll(/or/i);
        
        if (or[0] != null) {
            for (let i = 0; i < or.length; i++) {
                let sub2 = sub1.substring(or[i] + 3);
                let test = sub2.indexOf("=");
                
                let lhs = sub2.substring(0,test);
                let rhs = sub2.substring(test+1,2*test+1);

                if (lhs == rhs) {
                    return 4;
                }
            }
        }

        return 0;
    }
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
    let piggybackRE = new RegExp(`;\s*(${sqlCommands})`, "igm");
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

    for (const match of falseInstance) {
        let [a,b] = match.split("=");
        if (a.match(/[a-z]+/img)[0].length == a.length) {
            continue;
        } else {
            falseInstanceScore = 3
        }  
    }

    return falseInstanceScore + waitforInstanceScore
}

function altEncoding(query) {
    let altEncodingRE = new RegExp(`exec|char|ascii`, "igm");
    let hexRE = new RegExp(`((0x)?[0-9a-f]+)`, "igm");
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
    // TODO: generate score
    let percentage;


    setScale(percentage);
    // TODO: send to #results
}