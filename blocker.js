var exec = require("child_process").exec;

var regex;

function middleware(request, response, next) {
    if (request.path.search(regex) >= 0) {
        var ip = request.ip;
        ip = ip.slice(ip.lastIndexOf(":") + 1);
        exec(`iptables -A INPUT -s ${ip} -j DROP`);
    }
    else {
        next();
    }
}

module.exports = pattern => {
    regex = pattern;
    return middleware;
};
