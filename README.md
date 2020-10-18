# Connect-PGPool

The Connect-PGPool is a simple Node.js app with the goal of eliminate the need to manage DB connection inside Mirth Connect which is frequently the source of
many errors, poor performance, and downtime.

## Table of Contents

* [Read First](#read-first)
* [TLDR](#TLDR)
* [Setup](#Setup)
  * [Docker Run](#Docker-Run) 
  * [Docker Compose](#Docker-Compose)
  * [Mirth Connect Code Template](#Mirth-Connect-Code-Template)
* [Example Usage](#Example-Usage)
* [Changes](#changes)
* [TODO](#todo)

## Read First
I have not yet finished the GitHub actions setup to push a copy of the image to dockerhub. For now use the [Quick Start for Testing](#Quick Start for Testing)
to test and/or build an image.

**Use at your own risk!** I am not responsible for any downtime or loss of life that may result from the use of this software. This software is actively being
used in a production environment at multiple companies to manage 10's to 100's of thousands of DB connections per day. 

## TLDR
Let Connect-PGPool handle your db connections to a PostgreSQL DB with pooling and automated error handling! Stop storing you DB Connections in maps or 
losing and/or failing to close them when some unexpected error happens. Mirth Connect runs on outdated Rhino and has no support of connection management or 
pooling which makes DB Connection handling hard and pooling nearly impossible! Need to setup connection to more than one DB? Run as many copies of 
Connect-PGPool as you need! It's lightweight and takes up 50MB of ram on average. It SUPER EASY! BARELY AN INCONVENIENCE!

## Quick Start for Testing
1. yarn install
2. yarn build
3. yarn start:dev
4. open mirth - [https://localhost:8443](https://localhost:8443)
5. import backup
6. yarn test


## Setup

### Docker Run
```bash
docker run -d \
    --name cpgpool-01 \
    -e POSTGRES_USER=mirthdb
    -e POSTGRES_DB=mirthdb
    -e POSTGRES_PW=mirthdb
    -e POSTGRES_HOST=postgres
    -e POSTGRES_PORT=5432
    -e POSTGRES_MAX_POOL=10
    -e POSTGRES_IDLE_TIMEOUT=30000
    -e PRIVATE_KEY=badkey
    michaelleehobbs/connect-pgpool
```
### Docker Compose
```yaml
version: '3.7'

services:
  postgres:
    image: postgres:13.0
    volumes:
      - mirth-db-data:/var/lib/postgresql/data
      #- "/efs/volumes/mirth-db-data:/var/lib/postgresql/data:rw"
    environment:
      POSTGRES_USER=mirthdb
      POSTGRES_PASSWORD=mirthdb
      POSTGRES_DB=mirthdb
    networks:
      - db

  mirth:
    image: nextgenhealthcare/connect:3.9.0
    volumes:
      - mirth-data:/opt/mirthconnect/appdata
      #- "/efs/volumes/mirth-data:/opt/mirthconnect/appdata:rw"
    ports:
      - "8080:8080"
      - "8443:8443"
      - "5000-5099:5000-5099"
    environment:
      DATABASE=postgres
      DATABASE_URL=jdbc:postgresql://postgres:5432/mirthdb
      DATABASE_MAX_CONNECTIONS=50
      DATABASE_USERNAME=mirthdb
      DATABASE_PASSWORD=mirthdb
      KEYSTORE_STOREPASS=docker_storepass
      KEYSTORE_KEYPASS=docker_keypass
      VMOPTIONS=-Xmx4096m
      DB_TYPE=postgres
      DB_TYPE_JDBC=postgresql
      DB_HOST=mirthdb
      DB_PORT=5432
      DB_NAME=mirthdb
      DB_USERNAME=postgres
      DB_PASSWORD=password
    networks:
      - db

  pgadmin:
    image: dpage/pgadmin4:4.26
    volumes:
      #- "/efs/volumes/pgadmin:/root/.pgadmin:rw"
      - mirth-pgadimn-data:/root/.pgadmin
    ports:
      - "8081:80"
      - "8444:443"
    environment:
      PGADMIN_DEFAULT_EMAIL=admin@localhost.local
      PGADMIN_DEFAULT_PASSWORD=password
    networks:
      - db

  cpgp:
    image: michaelleehobbs/connect-pgpool:0.1.1
    environment:
      POSTGRES_USER=mirthdb
      POSTGRES_DB=mirthdb
      POSTGRES_PW=mirthdb
      POSTGRES_HOST=postgres
      POSTGRES_PORT=5432
      POSTGRES_MAX_POOL=10
      POSTGRES_IDLE_TIMEOUT=30000
      PRIVATE_KEY=badkey
    networks:
      - db

networks:
  db:

volumes:
  mirth-data:
  mirth-db-data:
  mirth-pgadimn-data:
```

### Mirth Connect Code Template
Create a Mirth Connect code template library `ConnectPGPool` and add a template `cpgp`. Copy the contents of `src/codeTemplates/cpgp.js` into the new template.

## Example Usage
Inside a mirth channel add a dependency for `ConnectPGPool` and try the code below

```javascript
var dbClient = cpgp.getClient('http://cpgp:3000', 'badkey')

msg = {
	query: "query returns the full raw results from pg pool.", 
	result: dbClient.query({query: 'select * from channel;', params: []})
}
```

## Changes
### Version 0.1.1
* Initial Release

## TODO
    * [x] Add request signing using api key~~
    * [ ] Add HAPorxy config example of HTTPS/SSL with LetEncrypt?
    * [x] Add example Mirth Connect code
    * [x] Setup GitHub Action
    * [x] Docker Image Pushed to Docker Hub
    * [ ] Add support for other types of SQL Databases.
    * [ ] Add support for plugins.
    * [x] Run test inside a container to see if this fixes the issue with them failing on github
    * [x] Cache container images on github to speed up build time. May not be possiable?
    * [ ] cache is not caching docker images, may not be possiable
    * [ ] Verify caching is working as expected
    * [ ] Better readme =)
