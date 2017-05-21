var path = require("path");
module.exports = {
    "env": "PROD", // Options TEST/DEV/PROD (Case sensitive)
    "app": { // Main Server configurations
        "viewsDir": path.resolve('views'),
        "ports": {
            "TEST": 8090,
            "DEV": 8090,
            "PROD": 8090
        },
        "token": { // JWT Token configurations (Mobile App Compatible)
            "secret": "aK789BJknjhIU88Hbdsj9o", // JWT encode/decode secret
            "validity": 1, // In Days
            "cookie": { // Compatibilty for Web
                "secret": "7jkkjUIa90hjYUb2nbk"
            }
        }
    },
    "deploy": {
        "webhook": {
            "port": 9100, // GIT webhook Port
            "secret": "asdfASDF@1234", // GIT WebHook Secret
            "event": "push:NearBy:refs/heads/master"
        }
    },
    "db": { // DB configurations
        "mongo": {
            "urls": {
                "TEST": "mongodb://127.0.0.1:27017/nearBy_test?maxPoolSize=5",
                "DEV": "mongodb://127.0.0.1:27017/nearBy?maxPoolSize=5",
                "PROD": "mongodb://127.0.0.1:27017/nearBy_prod?maxPoolSize=5"
            }
        }
    }
}