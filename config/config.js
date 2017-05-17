module.exports = {
    env: "DEV",
    app: {
        ports: {
           DEV: 8090,
           TEST: 8090,
           PROD: 8090
        }
    },
    db: {
        mongo: {
            urls: {
                DEV: "mongodb://localhost:27017/nearby?maxPoolSize=10",
                TEST: "mongodb://localhost:27017/nearby?maxPoolSize=10",
                PROD: "mongodb://localhost:27017/nearby?maxPoolSize=10"
            } 
        }
    }
}
