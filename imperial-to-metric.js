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
    else if (meters < 1) {
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

function format_weight(str, gram) {
    // tonne
    if (gram > 1000000) {
        return "{0} ({1} {2})".format(str, Math.round(gram / 100000) / 10, "tonne");
    }
    // kilogram
    if (gram > 1000) {
        return "{0} ({1} {2})".format(str, Math.round(gram / 100) / 10, "kg");
    }
    else {
        return "{0} ({1} {2})".format(str, Math.round(gram), "g");
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
function yard_to_meters(yard){
    return yard * 0.9144;
}
function miles_to_meters(miles) {
    return miles * 1609.3;
}

function ounce_to_gram(ounce) {
    return ounce * 28.349523125;
}
function pound_to_gram(pound) {
    return pound * 453.59237;
}
function ton_to_gram(ton) {
    return ton * 1016046.9088;
}
// endregion

// region regexps
var inch_matches = [
    "\\d+[\\s|-]?inches",
    "\\d+\\.\\d+[\\s|-]?inches",
    "\\d+\\.\\d+[\\s|-]?inch",
    "\\d+[\\s|-]?inch",
    "\\d+\\.\\d+[\\s|-]?in",
    "\\d+[\\s|-]?in\\b"
];
var inch_regexp = new RegExp(inch_matches.join('|'), "gi");

var feet_matches = [
    "\\d+[\\s|-]?feet",
    "\\d+\\.\\d+[\\s|-]?feet",
    "\\d+\\.\\d+[\\s|-]?foot",
    "\\d+[\\s|-]?foot",
    "\\d+\\.\\d+[\\s|-]?ft",
    "\\d+[\\s|-]?ft"
];
var feet_regexp = new RegExp(feet_matches.join('|'), "gi");

var yard_matches = [
    "\\d+[\\s|-]?yards",
    "\\d+\\.\\d+[\\s|-]?yards",
    "\\d+\\.\\d+[\\s|-]?yard",
    "\\d+[\\s|-]?yard",
    "\\d+\\.\\d+[\\s|-]?yds",
    "\\d+[\\s|-]?yds",
    "\\d+\\.\\d+[\\s|-]?yd",
    "\\d+[\\s|-]?yd"
];
var yard_regexp = new RegExp(yard_matches.join('|'), "gi");

var miles_matches = [
    "\\d+\\.\\d+[\\s|-]?miles",
    "\\d+,\\d+[\\s|-]?miles",
    "\\d+[\\s|-]?miles",
    "\\d+\\.\\d+[\\s|-]?mile",
    "\\d+,\\d+[\\s|-]?mile",
    "\\d+[\\s|-]?mile",
    "\\d+\\.\\d+[\\s|-]?ml",
    "\\d+[\\s|-]?ml"
]
var miles_regexp = new RegExp(miles_matches.join('|'), "gi");

var fahrenheit_matches = [
    "-?\\d+[\\s|-]?°F",
    "-?\\d+\\.\\d+[\\s|-]?°F",
    "−?\\d+[\\s|-]?°F",
    "−?\\d+\\.\\d+[\\s|-]?°F"
];
fahrenheit_regexp = new RegExp(fahrenheit_matches.join('|'), "gi");

var ounce_matches = [
    "\\d+\\.\\d+[\\s|-]?ounces",
    "\\d+[\\s|-]?ounces",
    "\\d+\\.\\d+[\\s|-]?ounce",
    "\\d+[\\s|-]?ounce",
    "\\d+\\.\\d+[\\s|-]?oz\\b",
    "\\d+[\\s|-]?oz\\b"
];
ounce_regexp = new RegExp(ounce_matches.join('|'), "gi");

var pound_matches = [
    "\\d+\\.\\d+[\\s|-]?pounds",
    "\\d+[\\s|-]?pounds",
    "\\d+,\\d+[\\s|-]?pounds",
    "\\d+\\.\\d+[\\s|-]?pound",
    "\\d+[\\s|-]?pound",
    "\\d+,\\d+[\\s|-]?pound",
    "\\d+\\.\\d+[\\s|-]?lbs",
    "\\d+[\\s|-]?lbs",
    "\\d+,\\d+[\\s|-]?lbs",
    "\\d+\\.\\d+[\\s|-]?lb",
    "\\d+[\\s|-]?lb"
];
pound_regexp = new RegExp(pound_matches.join('|'), "gi");

var ton_matches = [
    "\\d+\\.\\d+[\\s|-]?tons",
    "\\d+[\\s|-]?tons",
    "\\d+\\.\\d+[\\s|-]?ton\\b",
    "\\d+[\\s|-]?ton\\b",
    "\\d+\\.\\d+[\\s|-]?t\\b",
    "\\d+[\\s|-]?t\\b"
];
ton_regexp = new RegExp(ton_matches.join('|'), "gi");
// endregion

function replace(node) {
    // inches
    node.nodeValue = node.nodeValue.replace(inch_regexp, function(str) {
            var val = str.match(/\d+\.\d+|\d+/g);
            var meters = inches_to_meters(val[0]);
            return format_length(str, meters);
    })
    // feet
    node.nodeValue = node.nodeValue.replace(feet_regexp, function(str) {
        var val = str.match(/\d+\.\d+|\d+/g);
        var meters = foot_to_meters(val[0]);
        return format_length(str, meters);
    })
    // yard
    node.nodeValue = node.nodeValue.replace(yard_regexp, function(str) {
        var val = str.match(/\d+\.\d+|\d+/g);
        var meters = yard_to_meters(val[0]);
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
    node.nodeValue = node.nodeValue.replace(/\d+[\\s|-]?mph/gi, function(str) {
        var val = str.match(/\d+/g);
        var meters = miles_to_meters(val[0]);
        return "{0} ({1} {2})".format(str, Math.round(meters / 1000), "km/h");
    })

    // °F
    node.nodeValue = node.nodeValue.replace(fahrenheit_regexp, function(str) {
        var escaped_str = str.replace('−', '-');
        var val = escaped_str.match(/-?\d+|-?\d+.\d/g);
        var celsius = (val[0] - 32) * (5 / 9);
        return "{0} ({1} {2})".format(str, Math.round(celsius), "°C");
    })

    // ounce
    node.nodeValue = node.nodeValue.replace(ounce_regexp, function(str) {
        var escaped_str = str.replace(',', '');
        var val = escaped_str.match(/\d+\.\d+|\d+/g);
        var grams = ounce_to_gram(val[0]);
        return format_weight(str, grams);
    })
    // pound
    node.nodeValue = node.nodeValue.replace(pound_regexp, function(str) {
        var escaped_str = str.replace(',', '');
        var val = escaped_str.match(/\d+\.\d+|\d+/g);
        var grams = pound_to_gram(val[0]);
        return format_weight(str, grams);
    })
    // ton
    node.nodeValue = node.nodeValue.replace(ton_regexp, function(str) {
        var escaped_str = str.replace(',', '');
        var val = escaped_str.match(/\d+\.\d+|\d+/g);
        var grams = ton_to_gram(val[0]);
        return format_weight(str, grams);
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