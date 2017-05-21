module.exports = {
    "env": "TEST", // Options TEST/DEV/PROD (Case sensitive)
    "app": { // Main Server configurations
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