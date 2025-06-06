# stamp-web-aurelia

stamp-web-aurelia is the web front-end for managing collections of stamps and leverages the REST interfaces of stamp-web-services.

<font color='red'>**Note** This project will require a stamp-web-services REST backend to correctly function. See Below for details.</font>

## Stamp Screen Shots

*Browsing by a country*

![Screen shot from Stamp-Web](https://i.imgur.com/RP8hyHh.png)


*Creating a new stamp form*

![Screen shot showing Editing in Stamp-Web](https://i.imgur.com/1f8SF9h.png)


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

This project is only going to support the latest browsers (Chrome/Firefox/Edge).


## Connecting to Webservices in Development

The REST Web Services are available from [stamp-webservices](https://github.com/stamp-web/stamp-webservices).  This project has detailed instructions on how to setup the environment and setup.  You will need MySQL and NodeJS to do so.

Stamp-Web now includes a reverse proxy in the server (also called from watch) that will automatically proxy calls to the stamp-webservices, meaning that nginx is no longer needed.

You can access both the web-services and the application server through port 9000 (http://localhost:9000/#)

### Accessing the Demo Services

Another way to access the web-services is using the reverse proxy to the demo system located at http://drake-server.ddns.net:9008/stamp-webservices.  You can change this setting via "stamp-webservices" variable in the file aurelia_project/tasks/proxy.json

If you take this later approach, please note that the performance will not be great since you will be reverse proxying to a remote data service.  Also note, this is a demo machine so I would appreciate it if you didn't completely corrupt the data (this is not my production data, but if I have to continually manage the system due to misuse I will close it down to outside connections)


## Running The Unit Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. You can now run the tests with this command:

  ```shell
   au test
  ```
  
## Running the Integration Tests

Webdriver for NodeJS is used for the integration tests. This project has been moved to [stamp-web-selenium](https://github.com/stamp-web/stamp-web-selenium)


## Test Statistics

The following is a list of test statistics for the project by date and commit

| Date       | Commit                                                                                                    | Number of Tests | Code Coverage |
|------------|-----------------------------------------------------------------------------------------------------------|-----------------|--------------|
| 2022-01-15 | [8ac447f](https://github.com/stamp-web/stamp-web-aurelia/commit/8ac447f580f29d1f0f8dd23e284c6f25448cf1d7) | 83              | 12.05%       |
| 2022-01-15 | [081fe3f](https://github.com/stamp-web/stamp-web-aurelia/commit/081fe3f31d5962c10777f4017e2c7a5dbe26e12e) | 86              | 12.20%       |
| 2022-01-15 | [38899a3](https://github.com/stamp-web/stamp-web-aurelia/commit/38899a32d69cd5c62ade7341a83708d4a8e1e726) | 94              | 13.29%       |
| 2022-01-25 | [c17f067](https://github.com/stamp-web/stamp-web-aurelia/commit/c17f06784332adff83e0a2594a705de26285d30a) | 98              | 18.35%       |
| 2022-06-08 | [a798ac3](https://github.com/stamp-web/stamp-web-aurelia/commit/a798ac36ac61a06258729173d8fa5cacf6a0ff24) | 102             | 18.41%       |
| 2022-06-08 | [e64d964](https://github.com/stamp-web/stamp-web-aurelia/commit/e64d964202e6b9930dda0712837682a71ad0d1db) | 104             | 18.59%       |
| 2023-01-04 | [359948b](https://github.com/stamp-web/stamp-web-aurelia/commit/359948b689f088ec8c8554044cab96c24ffe1a77) | 107             | 18.80%       | 
| 2023-09-21 | [4412730](https://github.com/stamp-web/stamp-web-aurelia/commit/441273055dc1af57257aba29f929923799563325) | 123             | 20.27%       |
| 2023-10-08 | [054cb00](https://github.com/stamp-web/stamp-web-aurelia/commit/054cb004b15133867f98c10276397a1f2a1f88be) | 134             | 20.68%       |
| 2023-11-01 | [fd3f25d](https://github.com/stamp-web/stamp-web-aurelia/commit/fd3f25d17f387d9624ab20501d836710a18f1ed0) | 160 | 22.38%       |
| 2025-06-06 | [89f7dee](https://github.com/stamp-web/stamp-web-aurelia/commit/89f7deed81e3236045a9c148d5ba654dc963567f) | 160 | 22.49% |


## Optimizing for Browsers

To optimize the build for the latest browsers the command

   ```shell
   npx browserslist@latest --update-db
   ```

Should be run periodically to refresh the browser DB and allow for optimized compiles.
