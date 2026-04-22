const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
