# Welcome to Manhunt

The client application is entirly based on react-native, hence you will need Node.js for it to work. The server side is based on Python, hence to run the server you will need Python installed as well.
## Getting Started
### Setup
To get started, first clone the repository. Then go into the repository folder and run this command.
```bash
npm install
```
This command installs all the necessary dependencies into your project.
<br>
The server code also has a few dependencies that you will need to install. To install them, run this command in the repository folder: 
```bash
pip install -r server/reqs.tx
```
or
```bash
cd server
pip install -r reqs.tx
cd ..
```
Now you are ready to edit the application.
### Editing Code
Create a new branch who's format is as such: `<year>-<objective>`. 
All of the application code is located in the `app` directory. The app is written with react-native and TypeScript. Knowledge of both is necessary to be successful.
<br>
All of the server code is located in the `server` directory. The server is written in python, and uses websockets to connect to the client.
### Testing Code
To test the client, run the following command: 
```bash
npx expo start --go
```
This command will only start the client though, to start the server, open another terminal window, make sure you are in the repository directory, and run the following command:
```bash
python server/server.py
```
## Things To Do
When you have all of the code ready to edit, there are a few things to do. Firstly you can work on the GUI, there is a [figma](https://www.figma.com/design/1UfBQpflktCacmjSU8lnPb/Manhunt-App?node-id=0-1&t=4zhiIRBHF6QuI0cs-1) that you can use. If you can edit it, that means that you are trusted with this project by the owner, and that you have an account. Otherwise, feel free to create the GUI as the figma shows. You can also edit the server code, although not advised. We have a strict plan on how to edit the code, so unless you are aware of the said plan, do not attempt to edit the server code.