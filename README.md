# <img src="https://www.google.co.in/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=0ahUKEwjK5c7S7IDUAhXJro8KHQjuCtgQjRwIBw&url=http%3A%2F%2Fwww.iconsdb.com%2Fred-icons%2Fmap-marker-2-icon.html&psig=AFQjCNFLgkN9yPxAPW-DDHLHLoyPh4EuFw&ust=1495451369739489"> NearBy
Web App that find the Restaurant nearby the given location.

### Server Setup 

`Install required Softwares(Ubuntu16.04 AWS)`
- Install [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)  
- Install [Nodejs](https://www.liquidweb.com/kb/how-to-install-nvm-node-version-manager-for-node-js-on-ubuntu-14-04-lts/)  

- Get The Application
    > git clone https://github.com/AkashBabu/NearBy.git ~/

<hr/>

### Production Deployment
`Get The libraries`
> cd ${WORKSPACE_ROOT}  
> npm run install-prod-dep  

Edit config/config.js and change env: "PROD"
> git pull origin master  
> npm run init-prod

`Continuous Integeration(CI)`  
*Steps followed here are w.r.t Git WebHooks. For a stronger CI, I would recommend to go with Jenkins or Docker build.*

* nano ${WORKSPACE_ROOT}/config/config.js
    * Edit deploy.webhook.secret to some confidential random String
    * Edit deploy.webhook.port to the required port (Open to public access)
    * Edit deploy.webhook.event to capture the required event (format event:reponame:ref)
* nano ${WORKSPACE_ROOT}/deploy/updateAndDeploy.sh
    * Add the WORKSPACE_ROOT folder in the first line
* Execute the following commands
    > cd ${WORKSPACE_ROOT}/deploy  
    > sudo chmod +x ./updateAndDeploy.sh  
    > node webHookServer.js
* Create a WebHook in github (Use the port and secret mentioned in config/config.js file)

`Startup Script`
> pm2 save  
> pm2 startup    

Then follow the instructions on the screen

<hr/>

### Development
`Get The libraries`
> cd ${WORKSPACE_ROOT}   
> npm run install-dep
> git pull origin master  
> npm run init

<hr/>

### Test 
`Get The libraries`
> cd ${WORKSPACE_ROOT}   
> npm run install-dep  

`Run Test Cases`
> npm test

<hr/>

### Technologies used
    - Server Side
        * Nodejs
        * MongoDB
        * JWT Token
    - Client Side
        * Angularjs
        * Angular-Material
        * Webpack(Build Tool)

### Website flow
    * Login/Register Page
    * After login, User sees a Map page
    * He/She then chooses his location on the Map using marker, and Map paralelly
    loads the NearBy Restaurants as and when the marker is moved.
    * User can move the Map to his Location and then click on `Place Marker on center` button which is at bottom-left position on the Map
    * On click of the restaurant marker, a infowindow pops up and Displays options for
    Get-Directions & Restaurant-Details
    * User can now either choose to view Restaurant-Details or Click on `NearBy Restaurants` button.
    * User is now navigated to Restaurants View, where He/She can see the Name, Address, 
    Rating(Google rating), Distance & time.
    * User can select any of the Restaurant to View/Express his experience of this Restaurant
    * User can decide to Navigate to that Restaurant by Clicking on the Marker Icon (next to Restaurant Name).

### Website Features
    * Responsive
    * User friendly flow
    * Manually Tested on IE10, Chrome, Firefox, Tablet and Phone

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
