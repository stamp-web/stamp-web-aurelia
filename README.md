# stamp-web-aurelia

stamp-web-aurelia is the web front-end for managing collections of stamps and leverages the REST interfaces of stamp-web-services.

<font color='red'>**Note** This project will require a stamp-web-services REST backend to correctly function. See Below for details.</font>

![Screen shot from Stamp-Web](http://i1178.photobucket.com/albums/x373/jadrake/stamp-web-aurelia_zpsp6rlurxt.png)

## Build Status

[![Build Status](http://drake-server.ddns.net:9000/jenkins/buildStatus/icon?job=stamp-aurelia)](http://drake-server.ddns.net:9000/jenkins/job/stamp-aurelia/)


## Demo Server

A demo server has been provided using the following credentials:

* username: demo
* password: demo
* address: http://drake-server.ddns.net:9008/stamp-aurelia/index.html


## Running The App

To run the app, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g jspm
  ```
**Note:** jspm queries GitHub to install semver packages, but GitHub has a rate limit on anonymous API requests. It is advised that you configure jspm with your GitHub credentials in order to avoid problems. You can do this by executing `jspm registry config github` and following the prompts.

5. Install the client-side dependencies with jspm:

  ```shell
  jspm install -y
  ```
**Note:** Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip` and then re-running `jspm install`.

6. To run the app, execute the following command:

  ```shell
  gulp watch
  ```
7. Browse to [localhost:9005](http://localhost:9005) to see the app. You can make changes in the code found under `src` and the browser should auto-refresh itself as you save files.

## Browser Support

This project is only going to support the latest browsers (Chrome/Firefox/IE11/Edge) and therefore polyfills for MutationObserver and support for IE9/IE10 is being dropped.


## Changing the theme

Bootswatch is no longer used as the theme provider, although it was used to create the initial stamp-web theme.  This theme is now located in the theme
folder and build using the command:

```
gulp generate-theme
```

Since the output is bootstrap.css and bootstrap-min.css in theory you could simply copy over a bootswatch theme and use this instead.
The bootstrap-overrides.less is used to override styles/classes used by the bootstrap primary theme.  This file was originally taken from the
custom folder of bootswatch and has since been modified further.  The variables.less defines the color and theme variables.

## Connecting to Webservices in Development

The REST Web Services are available from [stamp-webservices](https://github.com/stamp-web/stamp-webservices).  This project has detailed instructions on how to setup the environment and setup.  You will need MySQL and NodeJS to do so.

Stamp-Web now includes a reverse proxy in the serve target (also called from watch) that will automatically proxy calls to the stamp-webservices, meaning that nginx is no longer needed.


  ```shell
  gulp watch
  ```

You can access both the web-services and the application server through port 9005 (http://localhost:9005/#)

### Accessing the Demo Services

Another way to access the web-services is using the reverse proxy to the demo system located at http://drake-server.ddns.net/stamp-webservices.  You can change this setting via "webServices" variable in the file build/tasks/serve.js

If you take this later approach, please note that the performance will not be great since you will be reverse proxying to a remote data service.  Also note, this is a demo machine so I would appreciate it if you didn't completely corrupt the data (this is not my production data, but if I have to continually manage the system due to misuse I will close it down to outside connections)


## Running The Unit Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Install Aurelia libs for test visibility:

```shell
jspm install aurelia-framework
jspm install aurelia-http-client
jspm install aurelia-router
```
3. You can now run the tests with this command:

  ```shell
  gulp test
  ```

## Running The E2E Tests

**Note:** These tests are curently not present.  They may come into play after the APIs are stabilized with Aurelia and testing infrastructure becomes more clear.

Integration tests are performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your E2E-Tests into the folder ```test/e2e/src```
2. Install the necessary webdriver

  ```shell
  gulp webdriver_update
  ```

3. Configure the path to the webdriver by opening the file ```protractor.conf.js``` and adjusting the ```seleniumServerJar``` property. Typically its only needed to adjust the version number.

4. Make sure your app runs and is accessible

  ```shell
  gulp watch
  ```

5. In another console run the E2E-Tests

  ```shell
  gulp e2e
  ```
