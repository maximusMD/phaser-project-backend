# Users and Leaderboards API for game project

 
Link to the hosted version
https://wavy-project-gang-api.onrender.com/api/users
This project involves building a robust API to provide user data for the game. 
Technologies
Node.js, MongoDB, Express.js, Bcrypt Other libraries and frameworks
Installation To get started with this project, follow these steps:
Clone the Repository:
https://github.com/maximusMD/phaser-project-backend
Clone the project repository from GitHub using the following command: 
$git clone <repository_url>
Navigate to the project folder using $cd project-name
Install the project dependencies using npm: $npm install
dependencies requirements
"bcrypt": "^5.1.1", "cors": "^2.8.5", "dotenv": "^16.3.1", "express": "^4.18.2", "mongodb": "^6.2.0"


Seeding the Local Database
Setting up Environment Variables
This project requires environment variables to connect to the databases.
- Create .env.test file and assign URI and database name from MongoDB to environment variables e.g MONGO_URI_TEST="your MongoDB uri" and DB_NAME_TEST="your DB name"

- Follow the step above for the .env.development file but assign production URI and database to environment variables

- Run the following commands to setup the project
    - “npm install”
    - "npm run test" for test and for dev "npm run start"
 
Add the variable with the correct database name for each environment. Ensure these .env files are listed in .gitignore.
To test you should install Jest. To install it you can find more information below: https://jestjs.io/docs/getting-started
To run the test use: $npm test
