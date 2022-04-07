# News API

This API is a solo project created by myself as part of the NorthCoders Bootcamp course. It is designed to be the API for a news website hosting articles that users can comment on. There are various endpoints used to make requests to the server, details of these and how to use them can be found under:
```
GET/api
```

## <u>**Hosting**</u>

A hosted version of this API can be found at: https://tanisnewsapi.herokuapp.com


## <u>**Instructions**</u>

### **Initial Setup**

You can clone the project from the GitHub page at: https://github.com/tantan628/newsAPI

Once cloned, you will need to initiate npm and install dependencies, this can be done using the follwong commands from the root directory:

```

npm install
```

You will then need to set up and seed the local database using:

```
npm run setup-dbs

npm run seed
```
Next, please create the required files to create the test and development variables as seen below.


### **Required Files**

To use the API, you will need to add your own .env files for both the development and test databases. These will need to be named: ``.env.development`` and ``.env.test``, and they must be created in the root directory.

In each of these, add 
```
PGDATABASE=<database_name_here>
```

The database names are: ``nc_news`` and ``nc_news_test``

You may also need to add your PGPASSFILE to access the database through psql.


### **Minimum Versions**

The following minimum versions of `Node.js` and `Postgres` are required to run the API:

Node.js: 10.19.0
Postgres: 8.7.3


## <u>**Testing**</u>

There are two tesing suites, one for the utility functions, and one for app.js. To run both you can use the command:

```
npm run test
```

If you wish to only run one suite, you can use either of the commands:

```
npm run test ./__tests__/app.test.js

npm run test ./__tests__/utils.test.js
```