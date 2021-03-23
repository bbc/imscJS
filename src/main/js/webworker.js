//No document.createElement here!
var generateISD = require('./isd').generateISD;
var fromXML = require('./doc').fromXML;


onmessage = function(event) {
    const xmlStr = event.data.xmlStr;
    if (typeof xmlStr === "string") {
        const tt = fromXML(xmlStr, errorHandler);
        // We can't serialise functions, call the function now just in case this function
        // no longer returns.
        tt.mediaTimeEvents = tt.getMediaTimeEvents();

        postMessage({
            result: tt
        });
    } else {
        postMessage({
            error: "Invalid argument" + xmlStr
        });
    }
};

function errorHandler(err) {
    console.error(err);
    postMessage({
        error: err
    });
}
