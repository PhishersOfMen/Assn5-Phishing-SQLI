import {setScale} from 'utils';

const sqlCommands="select|drop|create|alter|update|insert";
const sqlKeywords="AND|OR";
const MAXSCALE = 35;

function midQueryComment(query) {
    let commentRE = new RegExp(`--.*(${sqlCommands}|${sqlKeywords})`, "mgi");

}

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
                    return {"Assert True": true};
                }
            }
        }

        return {"Assert True": false};
    }
}

function illegal(query) { 
    let illegalInstance = query.search(/convert/i);

    if (illegalInstance != null) {
        return {convert: true};
    }
    else {
        return {convert: false};
    }
}

function union(query) {
    let unionInstance = query.search(/union select/i);

    if (unionInstance != null) {
        return {'UNION SELECT': true};
    }
    else {
        return {'UNION SELECT': false};
    }
}

function piggyback(query) {
    let piggybackRE = new RegExp(`;\s*(${sqlCommands})`, "igm");
    let piggybackInstance = query.match(piggybackRE);

    if (piggybackInstance != null) {
        return {piggyback: true};
    } else {
        return {piggyback: false};
    }
}

function inference(query) {
    // TODO: code this
}

function altEncoding(query) {
    let altEncodingRE = new RegExp(`((exec|char|ascii)\()|((0x)?[0-9a-f]+)`, "igm");
    let altEncodingInstance = query.match(altEncodingRE);

    if (altEncodingInstance != null) {
        return {altEncoding: true};
    } else {
        return {altEncoding: false};
    }
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
    let percentage = ((results.midQueryComment + results.tautology + results.illegal + results.union + results.piggyback + results.inference + results.altEncoding) / MAXSCALE) * 100; 
    let comment = "Not Found";
    let taut = "Not Found";
    let ill = "Not Found";
    let un = "Not Found";
    let piggy = "Not Found";
    let infer = "Not Found";
    let alt = "Not Found";
    
    if (results.midQueryComment > 0) comment = "Instance Found";
    if (results.tautology > 0) taut = "Instance Found";
    if (results.illegal > 0) ill = "Instance Found";
    if (results.union > 0) un = "Instance Found";
    if (results.piggyback > 0) piggy = "Instance Found";
    if (results.inference > 0) infer = "Instance Found";
    if (results.altEncoding > 0) alt = "Instance Found";

    let message = `Comment:\t\t${comment}
    Tautology:\t\t${taut}
    Illegal Query:\t\t${ill}
    Union Query:\t\t${un}
    Piggy-Backed Query:\t${piggy}
    Inference:\t\t${infer}
    Alternate Encoding:\t${alt}`


    
    setScale(percentage);
    // TODO: send to #results
}