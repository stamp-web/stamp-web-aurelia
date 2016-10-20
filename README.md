# stamp-web-aurelia

stamp-web-aurelia is the web front-end for managing collections of stamps and leverages the REST interfaces of stamp-web-services.

<font color='red'>**Note** This project will require a stamp-web-services REST backend to correctly function. See Below for details.</font>

## Stamp Screen Shots

*Browsing by a country*

![Screen shot from Stamp-Web](http://i1178.photobucket.com/albums/x373/jadrake/stamp-web_zpsomt92mvs.png)


*Creating a new stamp form*

![Screen shot showing Editing in Stamp-Web](http://i1178.photobucket.com/albums/x373/jadrake/stamp-web-edit_zps1wbvstmc.png)

## Build Status

[![Build Status](http://drake-server.ddns.net:9000/buildStatus/icon?job=stamp-aurelia)]


## Demo Server

A demo server has been provided using the following credentials:

* username: demo
* password: demo
* address: http://drake-server.ddns.net:9008/stamp-aurelia/index.html


## Running The App

To run the app, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.

2. Ensure that [Gulp](http://gulpjs.com/) and Aurelia CLI is installed globally. If you need to install it, use the following commands:

  ```shell
  npm install -g gulp
  ```
  ```shell
  npm install -g aurelia-cli
  ```

3. Install the client-side dependencies with npm:

  ```shell
  npm install
  ```

4. To run the app, execute the following command:

  ```shell
  au run --watch
  ```
5. Browse to [localhost:9000](http://localhost:9000) to see the app. You can make changes in the code found under `src` and the browser should auto-refresh itself as you save files.

## Browser Support

This project is only going to support the latest browsers (Chrome/Firefox/IE11/Edge) and therefore polyfills for MutationObserver and support for IE9/IE10 is being dropped.


## Connecting to Webservices in Development

The REST Web Services are available from [stamp-webservices](https://github.com/stamp-web/stamp-webservices).  This project has detailed instructions on how to setup the environment and setup.  You will need MySQL and NodeJS to do so.

Stamp-Web now includes a reverse proxy in the server (also called from watch) that will automatically proxy calls to the stamp-webservices, meaning that nginx is no longer needed.

You can access both the web-services and the application server through port 9000 (http://localhost:9000/#)

### Accessing the Demo Services

Another way to access the web-services is using the reverse proxy to the demo system located at http://drake-server.ddns.net:9080/stamp-webservices.  You can change this setting via "stamp-webservices" variable in the file aurelia_project/tasks/proxy.json

If you take this later approach, please note that the performance will not be great since you will be reverse proxying to a remote data service.  Also note, this is a demo machine so I would appreciate it if you didn't completely corrupt the data (this is not my production data, but if I have to continually manage the system due to misuse I will close it down to outside connections)


## Running The Unit Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. You can now run the tests with this command:

  ```shell
  au test
  ```

