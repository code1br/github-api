<h1 align='center'>🔗 Github API 🔗</h1> 

## 💻 Description

The project is a simple challenge to test my skills in consuming APIs, the Github Restfull API was used as an example in this project.

## 📃 Requirements

- [X] All API responses must be in JSON format.
- [X] It must have 2 endpoints that allows the user to follow/unfollow another user.
- [X] Unit testing must be implemented
- [X] The project must have a documentation
- [ ] Endpoint to list all the repositories of the authenticated user
- [ ] Endpoint to get all the stars of the authenticated user
- [ ] Endpoint to get the number of commits in the current year and total commits of the authenticated user
- [ ] Endpoint to get the number of pull requests in the current year and total commits of the authenticated user
- [ ] Endpoint to get the most used languages of the authenticated user

* These requirements will be updated during the project development.

## 📜 Documentation

The project documentation was done using Swagger and can be accessed on the route: <kbd>/api-docs</kbd>

## ⚙️ Installation
1. Clone the repository
1. Change to the repository directory
1. Install the dependencies by running the following command
   ```shell
    npm i
    ```
1. Create a <kbd>.env</kbd> file on the root directory following the <kbd>.env.example</kbd> file.

1. In the following line, a brief explanation of each environment variable will be presented.

```shell
PORT = <The port where your application will be run>
SERVER_HOST = <The ip address where your application will be run>
```

## ⚒ Testing

1. After following the steps above, run the following command
   ```shell
    npm test
    ```
1. The test nutshell will be visible on the command line but it can also be accessed on the <kbd>coverage/lcov-report/index.html</kbd> file that will be created on the repository root diretory. Open it on your browser

## 🚀 Running the server in a Development Environment

1. Run the following command
	```shell
	npm run dev
	```

## 🚀 Running the server in a Production Environment

1. Run the following command to compile the TypeScript code
	```shell
	npm run build
	```
2. Run the server JavaScript compiled version
   	```shell
	npm start
	```
