//No document.createElement here!
var generateISD = require('./isd').generateISD;
var fromXML = require('./doc').fromXML;


var errorHandler = {
    info: sendError.bind(null, "info"),
    warn: sendError.bind(null, "warn"),
    error: sendError.bind(null, "error"),
    // There is a fatal error handler – but it still throws exceptions.
    // We still want to try-catch other exceptions – so don't listen to "fatal",
    // Catch both deliberate fatal exceptions and unexpected ones and push them both to thrownFatal
    thrownFatal: sendError.bind(null, "thrownFatal")
}

function sendError(severity, message) {
    postMessage({
        error: {
            severity: severity,
            message: message
        }
    });

    return false;
}

onmessage = function(event) {
    const xmlStr = event.data.xmlStr;
    if (typeof xmlStr === "string") {
        try {
            const tt = fromXML(xmlStr, errorHandler);
            // We can't serialise functions, call the function now just in case this function
            // no longer returns.
            tt.mediaTimeEvents = tt.getMediaTimeEvents();

            postMessage({
                result: tt
            });
        } catch (e) {
            errorHandler.thrownFatal(e);
        }
    } else {
        errorHandler.thrownFatal("Invalid argument" + xmlStr);
    }
};
