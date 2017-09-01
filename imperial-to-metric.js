// region utils
String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

function format_length(str, meters) {
    // mm
    if (meters < 0.1) {
        return "{0} ({1} {2})".format(str, Math.round(meters * 1000), "mm");
    }
    // cm
    else if (meters < 0) {
        return "{0} ({1} {2})".format(str, Math.round(meters * 100), "cm");
    }
    // km
    else if (meters > 10000) {
        return "{0} ({1} {2})".format(str, Math.round(meters / 1000), "km");
    }
    // m
    else {
        return "{0} ({1} {2})".format(str, Math.round(meters), "m");
    }
}
// endregion

// region conversions
function inches_to_meters(inch) {
    return inch * 0.0254;
}
function foot_to_meters(foot) {
    return foot * 0.3048;
}
function yard_foot_to_meters(yard){
    return yard * 0.9144;
}
function miles_to_meters(miles) {
    return miles * 1609.3;
}
// endregion

// region regexps
var feet_matches = [
    "\\d+.?feet",
    "\\d+\\.\\d+.?feet",
    "\\d+\\.\\d+.?foot",
    "\\d+.?foot",
    "\\d+\\.\\d+.?ft",
    "\\d+.?ft"
];
var feet_regexp = new RegExp(feet_matches.join('|'), "gi");

var miles_matches = [
    "\\d+\\.\\d+.?miles",
    "\\d+,\\d+.?miles",
    "\\d+.?miles",
    "\\d+\\.\\d+.?mile",
    "\\d+,\\d+.?mile",
    "\\d+.?mile"
]
var miles_regexp = new RegExp(miles_matches.join('|'), "gi");
// endregion

function replace(node) {
    // feet
    node.nodeValue = node.nodeValue.replace(feet_regexp, function(str) {
        var val = str.match(/\d+\.\d+|\d+/g);
        var meters = foot_to_meters(val[0]);
        return format_length(str, meters);
    })
    // miles
    node.nodeValue = node.nodeValue.replace(miles_regexp, function(str) {
        var escaped_str = str.replace(',', '');
        var val = escaped_str.match(/\d+\.\d+|\d+/g);
        var meters = miles_to_meters(val[0]);
        return format_length(str, meters);
    })

    // mph
    node.nodeValue = node.nodeValue.replace(/\d+.?mph/gi, function(str) {
        var val = str.match(/\d+/g);
        var meters = miles_to_meters(val[0]);
        return "{0} ({1} {2})".format(str, Math.round(meters / 1000), "km/h");
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

