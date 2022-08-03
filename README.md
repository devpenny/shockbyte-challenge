<p align="center">
  <a href="https://shockbyte.com" target="blank"><img src="https://shockbyte.com/branding/logos/shockbyte_logo.png" width="300" alt="Nest Logo" /></a>
</p>

You have been tasked with creating an API to handle node statistics (for game servers). You have full control over
the design of the API and additional technologies used, using NestJS as we utilise this heavily across Shockbyte.

You may decide any additional data to include in a node’s entry, but you must include:
- Unique ID **(integer)**
- System uptime **(timestamp)**
- Total RAM **(integer: bytes)**
- Allocated RAM **(integer: bytes)**
- Total Disk **(integer: bytes)**
- Allocated Disk **(integer: bytes)**

Your project must meet the following requirements:
- Your thought process must be documented in this readme, or a linked document in this repository.
- Data must be stored in a database, using an ORM to interact.
- The API must feature full CRUD (create, read, update, delete) functionality.
- The API must be able to prune old information.
  - Note statistical data may be stored in the API as frequently as every minute, however any data older than 24 hours should be hourly.
- Your application must be configured to deploy locally (whilst supporting external deployment, although an external instance is not required) through either Docker or Kubernetes.
- The API must be fully documented using best practises.
- The API must be authenticated using JWT Tokens.
- All code written is readable, secure and using best practises.

We are also looking out to see that the following considerations have been made:
- Pagination: the API may grow to hold a lot of data, try to return this in the most efficient
  way possible.
- Scalability: how will your application scale?

Good luck, we look forward to seeing how you approach the project and implement the technologies required!

### Thought Process

  

So, the first thing I did was create a checklist with every step I'll have to make. This way the challenge can be broke into smaller tasks resulting in smaller commits to the repo.

Then, by the time I finish each task, they'll be ellaborated further.

The checklist turned out to be as follows:

- [x] Initialize the NestJs API
- [x] Create the database and API Docker image/Container
- [x] Create database migration and data entity
- [x] Add Create API interface/method
- [X] Add Read API interface/method
- [X] Add Update API interface/method
- [x] Add Delete API interface/method
- [x] Finish CRUD
- [x] Add JWT Token authentication
- [x] Implement Pruning function
- [x] Schedule hourly pruning execution
- [x] Tackle Pagination
- [x] Tackle Scalability
  
##### Initialize the NestJs API
Since the API has already been initialized beforehand, there was no need to run the NestJs CLI to get the initial files.

##### Create the database and API Docker image/Container
In order to deploy locally a **Dockerfile** and a **docker-compose.yml** file were created to build not only a **node** container but also a **database** container.

Also managed to find a Dockerfile boilerplate that focus on optimization. It can not only setup for a local development but also helps on containerized deployment for production.

The boilerplate can be found here:
https://www.tomray.dev/nestjs-docker-production

##### Create database migration and data entity
So now I want to setup the database to receive the statistic data. I decided to use the **TypeORM** library to model my database in the API (it is supported by **NestJs**). I chose the **Postgres** because I'm familiar with it and I know it's a widely used database with a large community and, consequently, much support.

The next steps I made were:

* Create the connection between the **API** and the **Database**;
	* This was made using the **TypeOrmModule** from the **@nestjs/typeorm** library and importing it into the **App Module**;
* Created the **Data Entity**;
	* Created the first version of the Data Entity I am going to store in my database;
	* Also used **bigint** because I want to be able to support nodes with a large disk for space dependant use cases;
	* I've used integer for **id** as requested but I think an **UUID** approach would be better for both scalability and security, the use of an incremental integer could be considered a security problem, so migrating to UUID could improve security by obscurity;
	* Added **created_at** and **updated_at** columns to the database table migration;
* Created the **Database first Migration** with the table to store the data;
	* Here I faced a few challenges because the NestJs framework doesn't directly support the TypeORM migrations and so a few compatibility problems appeared;
	* Since I couldn't manage to make the migrations work using only the TypeOrmModule, the solution found was to create a separate file called **ormconfig-migrations.ts** to serve as the **DataSource** for the TypeORM migration CLI;
	* Then the created the script to auto find the DataSource file while creating the migrations was created.

##### Add Create API interface/method
So now the setup is done for programming the API methods, starting with the **Create** method.

For this method I wanted to create an **Anti-Corruption Layer** so that the data received are always treated the way intended. For that a **Data Model** was built with all the info needed to use in my domain and used the **controller** layer for the data treatment, this way I could detach the provider from my domain and keep the code clean.

I also realized another anti-corruption layer was needed in between my service and my repository since the type of data I'm using is a custom model and the repository works with entities. By adding that layer I could hopefully change the repository provider with more ease in a future where it is needed.

So I created a **Data Access Adapter** file that will handle the repository operations and will pass the data in the **data model** format to my **data service**. Also created an interface as a contract for the data repository so I could keep track of what methods I needed in the adapter.

The final **Create** structure used the typeorm repository **.save** async method and returned the created object by the route Adapter>Service>Controller>Response.

##### Add Read API interface/method
For the **Read** HTTP method I decided to implement two services, the **findAll** and the **findById**, following the same detached structure from the create method (that will serve as default for all CRUD).

##### Add Update API interface/method
On the update method I used a 'manual' query to find the data by id and update it based on the data model received, then treated the data and returned the same type of data model object with the updated data from the Data Access Adapter.

The reason for the use of query instead of the typeorm/postgres duo method .save or .update was because it diverged a little from other frameworks and the code got longer than expected. However, all this trouble is covered by the anti-corruption layer and my domain is isolated from any logic referring to the repository or framework, thus dividing the layer responsabilities accordingly.

##### Add Delete API interface/method

A straightforward **Delete** with **.delete** repository method, **NotFoundException** throwing when the data is not found and status code 204 response when success.

##### Finish CRUD
To finish the CRUD I implemented some **unit tests** for all the layers (data controller, data service, data access adapter) to make sure the application stay working even if I change the code.

Also wanted to implement the test for scalability purposes, they are very important when working on a team environment and also allow the app to grow in a healthy way.

##### Add JWT Token authentication
Now, the application responsability is to accept or reject an specific JWT since it is supposed to work with logs.

However, I created a simple login simulation at the **/login** route where one needs to pass an object with a username and a password. The reason for that was since there is no user database avaiable, I wanted to simulate and exemplify how a login would affect the API and how the authenticated jwt token would be generated.

So an admin account that is authorized was created by storing a specific username and password in the environment file, and when this user is verified, it should return an access token (JWT) encrypted with a secret that is also in the environment file.

Then used the **JwtAuthGuard** with **JwtStrategy** to put all the data.controller methods behind a verify and authenticate wall.

##### Implement Pruning function
To implement the Pruning function I used a simple **query** to identify which data needs to be deleted based on the difference between the present and the created data. **If said difference is greater than 24 hours it will keep only the data of the first minute of each hour.**

A few considerations:

* Thought about creating a **security system** in case someone change the code to prevent it from accidentally deleting unwanted data:
	* **Creating a select first**, returning the amount of data-to-be-deleted and comparing it with the amount of data it should be deleting was an idea, but what if the data provider delays? What if the pruning service has to go under maintenance? All of these factors would imply a different amount of data-to-be-deleted and consequently it doesn't seem to be a reliable method;
	* What about creating a **temporary table** that stores all the data for a time to have a backup if anything is deleted by mistake? That would work but it would need an extra amount of disk and memory usage that I'm not sure it's avaiable;

So I came to the conclusion that I would **keep it simple**, since I don't have the maturity to find the best solution for this **yet**.

##### Schedule hourly pruning execution
To make the scheduled pruning execution I created a **PruneService** file and called the **ScheduleModule.forRoot()** method on the root module (app) to make its methods avaiable through all the application. 

Then implemented the pruning function with a **@Cron** decorator, this way it was able to run the query hourly and execute the database cleaning.

Also created a **dummy-data-generator** to generate random data each second and used a simulation of the pruning method using a minute basis as a proof of concept to check if it works.

##### Tackle Pagination
So, to retrieve the data the best way possible I created a pagination that consists in receiving a **page** and a **limit** params from the request via query params passing the info down from the controller to the service and further to the adapter. Note that I only implemented the pagination in the **findAll** method, because it is the only method in my application that returns multiple data, however, it should serve as an example for other methods that could have been implemented such as a **findByDate** method or any other that return a lot of data.

The following query was used in the repository in the place of the previous **.find()**:

**await  this.dataRepository
.createQueryBuilder('data')
.orderBy('data.created_at', 'ASC')
.skip(paginationConfig.page  *  paginationConfig.limit)
.take(paginationConfig.limit)
.getMany();**

This query successfully returns a pagination by getting the query params and using them to create blocks of data, in this case ordered by the 'age' of the data.

##### Tackle Scalability
How will my application scale? Well, the answer enters two different scopes:

* What is already in the application
* What could be done as a good strategy

And I would like to tackle both answers separately, first, the tools that are in the application already, such as:

* **Unit Testing**
	* Unit tests can allow the application to grow with a solid foundation, ensuring that all code meets quality standards before it's deployed. It can also can be very helpful in a team environment for the same reasons and for reducing the fear of deploying.
* **Migrations**
	* Migrations are very important to achieve database scalability. It can improve the overrall performance and security of the application by making changes in the database while in production possible, for example. Can also help to assert the database version and structure across differents developers in a team, working like a code versioning but for databases.
* **Anti-Corruption-Layers**
	* Based on clean architectures fundamentals, anti-corruption-layers created for the application can help the scalability of the same by detaching the data from a provider from the app domain. This way if someday the provider changes the way the data is provided, the maintenance points are restricted to external interfaces.
* **Interfaces and models** 
	* By making use of interfaces and models, one can better divide the layers responsabilities and make the code more easier to work with and also more safe.
* **Containerization**
	* The use of Docker Containers can allow the local deploy and setup for a production deploy with more ease, ensuring that every machine runs the application in the same environment.
* **TypeScript**
	* The use of TypeScript as a static type checking is very helpful when working in a team. It allows for better readability and more safety because of early detection of errors at compile time.

Now, for the things that are not in the application but would be a nice addition:

* **Cloud Services**
	* The database cloud server from Amazon for example, could help the application to have a production deploy with a safer and more stable database structure.
* **Caching**
	* Storing the first 24 hours data from the application in cache could improve its performance and speed. The data should be stored in cache until it meet its parameters for the database saving.
* **Kubernetes**
	* The use of Kubernetes in production allows the orchestration of docker containers, and so, controlling the flow of the server loads, ensuring that no server container would overloads.

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```