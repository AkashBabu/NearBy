### Application Structure
```
    -- folder, - file


    -- config/
        - config.js (General Configuration Settings)
        - config.mongo.js (MongoDB collection Names)
        - init.globals.js (Initializes global variables)
    -- deploy/
        - updateAndDeploy.sh (Script to update and restart the running application)
        - webHookServer.js (WebHook-Server that capture git-webhook events)
    -- lib/
        -- db/
            mongoConn.js (Creates and checks connection periodically and retries on connection failure)
        - logger.js (Different type of logging for Each environment. Optionally can also be turned OFF)
        - middleware.js (Middlewares for session creation and handling)
    -- public/
        -- css/ (All style.css files required for Web)
        -- img/ (All images required for Web)
        -- js/
            -- index/
                -- (*components*)/
                - app.es6 (main angular app file)
            -- login/ 
                - app.es6
    -- routers/
        -- routes/
            -- (*api*)/ (Below are the general implementation that would be followed)
                - index.js (main file)
                - create.js (Handle POST /)
                - get.js (Handle GET /:id)
                - list.js (Handle GET /)
                - update.js (Handle PUT /:id)
                - remove.js (Handle DELETE /:id)
        - api.js (Routes all requests on /api)
        - portal.js (Server html files for requests on /portal/)
    -- test/
        - (*component*).js
    -- views/
        - login.html
        - index.html
        - pageNotFound.html

    - server.js (Main Express Application file)
```