function midQueryComment(query) {
    // TODO: code this
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
    // TODO: code this
}

function inference(query) {
    // TODO: code this
}

function altEncoding(query) {
    // TODO: code this
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
    // TODO: send to #results
}