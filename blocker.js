var exec = require("child_process").exec;

var predicate, callback;

function middleware(request, response, next) {
    if (predicate(request)) {
        if (callback) {
            callback(request);
        }
        var ip = request.ip;
        exec(`iptables -A INPUT -s ${ip.slice(ip.lastIndexOf(":") + 1)} -j DROP`);
    }
    else {
        next();
    }
}

function regexToPredicate(regex) {
    return request => request.path.search(regex) >= 0;
}

module.exports = (blockPredicate, blockCallback) => {
    if (blockPredicate instanceof RegExp) {
        blockPredicate = regexToPredicate(blockPredicate);
    }
    predicate = blockPredicate;
    callback = blockCallback;
    return middleware;
};
module.exports.logger = request => console.log(`Blocking ${request.ip} for ${request.path}`);
