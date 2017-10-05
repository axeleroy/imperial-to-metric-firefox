// region regexps
var regex_template = function(units) {
    return new RegExp("(-?\\d+(?:,?\\d+)*(?:\\.?\\d+)?[\\s−]?(?:" + units + "))", "gi");
};
var num_regex = new RegExp(/(-?\d+(?:,?\d+)*(?:\.?\d+)?)/gi);

var inch_regexp = regex_template("inches|inch|in\\b");
var feet_regexp = regex_template("feet|foot|fts|ft\\b");
var yard_regexp = regex_template("yards|yard|yds|yd\\b");
var miles_regexp = regex_template("miles|mile|mi\\b");
var ounce_regexp = regex_template("ounces|ounce|oz\\b");
var pound_regexp = regex_template("pounds|pound|lbs|lb\\b");
var ton_regexp = regex_template("tons|ton\\b|t\\b");
var mph_regexp = regex_template("mph");
var fahrenheit_regexp = regex_template("°F");
// endregion

// region utils
String.prototype.format = function() {
  var a = this;
  for (var k in arguments) {
    a = a.replace("{" + k + "}", arguments[k]);
  }
  return a;
};

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

function getValue(str) {
    return str.match(num_regex)[0].replace(',', '');
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

// region replaceFunctions
// inches
function replaceInches(str) {
    var meters = inches_to_meters(getValue(str));
    return format_length(str, meters);
}
// feet
function replaceFeet(str) {
    var meters = foot_to_meters(getValue(str));
    return format_length(str, meters);
}
// yard
function replaceYard(str) {
    var meters = yard_to_meters(getValue(str));
    return format_length(str, meters);
}
// miles
function replaceMiles(str) {
    var meters = miles_to_meters(getValue(str));
    return format_length(str, meters);
}
// mph
function replaceMph(str) {
    var meters = miles_to_meters(getValue(str));
    return "{0} ({1} {2})".format(str, Math.round(meters / 1000), "km/h");
}
// °F
function replaceFahrenheit(str) {
    var escaped_str = str.replace('−', '-').replace(',', '');
    var val = escaped_str.match(num_regex);
    var celsius = (val[0] - 32) * (5 / 9);
    return "{0} ({1} {2})".format(str, Math.round(celsius), "°C");
}
// ounce
function replaceOunce(str) {
    var grams = ounce_to_gram(getValue(str));
    return format_weight(str, grams);
}
// pound
function replacePound(str) {
    var grams = pound_to_gram(getValue(str));
    return format_weight(str, grams);
}
// ton
function replaceTon(str) {
    var grams = ton_to_gram(getValue(str));
    return format_weight(str, grams);
}
// endregion

function replace(node) {
    // inches
    node.nodeValue = inch_regexp[Symbol.replace](node.nodeValue, replaceInches);
    // feet
    node.nodeValue = feet_regexp[Symbol.replace](node.nodeValue, replaceFeet);
    // yard
    node.nodeValue = yard_regexp[Symbol.replace](node.nodeValue, replaceYard);
    // miles
    node.nodeValue = miles_regexp[Symbol.replace](node.nodeValue, replaceMiles);
    // mph
    node.nodeValue = mph_regexp[Symbol.replace](node.nodeValue, replaceMph);
    // °F
    node.nodeValue = fahrenheit_regexp[Symbol.replace](node.nodeValue, replaceFahrenheit);
    // ounce
    node.nodeValue = ounce_regexp[Symbol.replace](node.nodeValue, replaceOunce);
    // pound
    node.nodeValue = pound_regexp[Symbol.replace](node.nodeValue, replacePound);
    // ton
    node.nodeValue = ton_regexp[Symbol.replace](node.nodeValue, replaceTon);
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