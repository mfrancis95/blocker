var exec = require("child_process").exec;

var regex, callback;

function logger(request) {
    console.log(`Blocking ${request.ip} for ${request.path}`);
}

function middleware(request, response, next) {
    if (request.path.search(regex) >= 0) {
        var ip = request.ip;
        ip = ip.slice(ip.lastIndexOf(":") + 1);
        if (callback) {
            callback(request);
        }
        exec(`iptables -A INPUT -s ${ip} -j DROP`);
    }
    else {
        next();
    }
}

module.exports = (pattern, blockCallback) => {
    regex = pattern;
    callback = blockCallback;
    return middleware;
};
module.exports.logger = logger;
