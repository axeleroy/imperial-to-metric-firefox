// region conversions
function miles_to_km(miles) {
    return miles * 1.609344;
}
function foot_to_meters(feet) {
    return feet * 0.348;
}
// endregion

// region regexps
var feet_matches = [
    "\\d+ feet",
    "\\d+\\.\\d+ feet",
    "\\d+\\.\\d+ foot",
    "\\d+ foot",
    "\\d+\\.\\d+ ft",
    "\\d+ ft"
];
var feet_regexp = new RegExp(feet_matches.join('|'), "gi");

var miles_matches = [
    "\\d+\\.\\d+ mile",
    "\\d+ mile",
    "\\d+,\\d+ miles"
]
var miles_regexp = new RegExp(miles_matches.join('|'), "gi");
// endregion

function replace(node) {
    // feet -> m
    node.nodeValue = node.nodeValue.replace(feet_regexp, function(str) {
        var val = str.match(/\d+\.\d+|\d+/g);
        var meters = foot_to_meters(val[0]);
        if (meters < 1) {
            return meters + "m";
        }
        else return Math.round(meters) + " m";
    })
    // miles -> km
    node.nodeValue = node.nodeValue.replace(miles_regexp, function(str) {
        str = str.replace(',', '');
        var val = str.match(/\d+\.\d+|\d+/g);
        var kilometers = miles_to_km(val[0]);
        if (kilometers < 2) {
            return Math.round(kilometers * 1000) + " m";
        }
        else return Math.round(kilometers) + "km";
    })
    // mph -> km/h
    node.nodeValue = node.nodeValue.replace(/\d+ mph/gi, function(str) {
        var val = str.match(/\d+/g);
        return Math.round(miles_to_km(val[0])) + " km/h";
    })
}

function replacePattern(node) {
    if(node.nodeType === Node.TEXT_NODE) {
        replace(node);
    } else if(node.nodeType === Node.ELEMENT_NODE) {
        for(var i = 0, num = node.childNodes.length; i < num; ++i) {
            replacePattern(node.childNodes[i]);
        }
    }
}

replacePattern(document.body);

// TODO: inches -> cm, °F -> °C

