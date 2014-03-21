spawncamping
============

# Contact Information
Stephen Dixon 587-433-9487 sjdixon2@gmail.com

Jeremy Nauta 403-919-1408 jeremypnauta@gmail.com

Derek Partible 403-479-5003 dpartible92@gmail.com

Henry Rosvick 403-861-2712 hhrosvick@gmail.com


SENG513 Project
## Notes on Running Project:

# Database Configuration
- in order to deploy to your own database, you have to migrate the database.  On linux you can do this by running 'migrate.sh' in the base folder.

- the database settings are given in config/index.js

- the database settings can optionally be overriden in config/test.js, config/production.js, and config/development.js

# Running the Application

Ensure that the following dependencies are installed:

- [Node.js](http://nodejs.org/)
- [MySQL](http://www.mysql.com/)
- [grunt](http://gruntjs.com/)
- [Graphics Magick](http://www.graphicsmagick.org/)

Please also create the appropriate MySQL user as described in *config/index.js*.

After the prerequisites are met, run the development server from command line:

```
grunt
```

# Testing the Application

To run tests, use the following command:

```
grunt test
```

To run performance tests, make sure there is a local server running. Once that is complete, run the performance tests using:

```
grunt performance
```

The configuration of the performance tests can be altered in *config/index.js*.

# Other Configurations
- there are 3 modes: production, development, and test.  By default, "development" is active.
You can change this by changing the environmental NODE_ENV to 'test', 'development', or 'production'._
