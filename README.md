# <img src="https://www.google.co.in/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=0ahUKEwjK5c7S7IDUAhXJro8KHQjuCtgQjRwIBw&url=http%3A%2F%2Fwww.iconsdb.com%2Fred-icons%2Fmap-marker-2-icon.html&psig=AFQjCNFLgkN9yPxAPW-DDHLHLoyPh4EuFw&ust=1495451369739489"> NearBy
Web App that find the Restaurant nearby the given location.
Live [Demo](http://52.39.13.152/)

For Production Deployment Click [here](https://github.com/AkashBabu/NearBy/wiki/Deployment)

For Application Structure [Visit](https://github.com/AkashBabu/NearBy/blob/master/AppStructure.md)

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


