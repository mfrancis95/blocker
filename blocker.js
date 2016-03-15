var exec = require("child_process").exec;

function blocker(logger) {
    return request => {
        if (logger) {
            logger(request);
        }
        var ip = request.ip;
        exec(`iptables -A INPUT -s ${ip.slice(ip.lastIndexOf(":") + 1)} -j DROP`);
    };
}

module.exports = logger => blocker(logger);
module.exports.logger = request => console.log(`Blocking ${request.ip} for ${request.path}`);
