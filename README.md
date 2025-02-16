# Communities: A Simple CRUD Mobile Application.
#### Video Demo:  https://youtu.be/3KFsWGGkZJE
#### Description:

Communities is a cross platfrom mobile application. 
It is built with React Native on the front end and connect with a Django Rest API that runs on a backend server.

To run this application;:
1.  The device running the local and development needs to have a static local IP of 192.168.0.4
2.  Download and Install Expo and llow it access to the local network
3.  Navigate to the cs50 folder and create a python virtual environment by running:
    `python -m venv <nameenv>`
    nameenv can be replaced with a name of your choosing
4.  Activate the virtual environment:
        1.  Windows: `<nameenv>/scripts/activate`
        2.  Linux: `source nameenv/bin/activate`
5.  Install the requirements:
        `pip install -r requirements.txt`
6.  Start up django development server at 192.168.0.4
        `python manage.py runserver 192.168.0.4:8000`
7.  Navigate to Ccs50Expo
8.  Start up expo development server
        `npx expo start -c`
9.  Scan the barcode with your mobile phone or visit local url specified in expo app.
10. Sign in.

## Back end
Our backend server runs Django rest frame work. It consists of 2 applications. 
    *   base
    *   chat

### Base:
    The base app runs all of communities except the core chat finctionalities. It has a 
    .   model.py file that keeps track of our database schema
    .   admin.py file that programs what models are allowed to be edited in the admin panel.
        apps.py file to connect our app to the main project
    .   serializer.py converts data to json format for safe exporting
    .   urls.py for routing
    .   views.py for calculations.

### Chat:
    The chat app handles private chats, community chats and the websockets that keep communities async. 
    .   model.py file that keeps track of the chat database schema
    .   admin.py file that programs what models are allowed to be edited in the admin panel.
    .   apps.py file to connect our app to the main project
    .   consumers.py to create classes and functions called consumers. Using consumers we can create asychronous functionalities using **Django-channels** and **Daphne**
    .   routing.py handles web socket routing
    .   serializer.py converts data to json format for safe exporting
    .   urls.py for routing
    .   views.py for calculations.

### Other important components

#### cs50
    The cs50 folder contains the main core of our projects. It tells all parts of our project had to interact with each other


    .   asgi.py configures out asycnhronous gateway
    .   settings.py contains core settings, dabase connection, security settings, media and static file settings etc. It is the module that runs the project
    .   urls.py maps the apps to the project. ALl other routings would be subroutes of the routes listed here
    .   wsgi.py for sync gateway which we would not be using here

####   media
    When we receive media from out users, we store them here. The models on *base/models.py* and *chat/models.py* have image fields with an *upload_to* parameter that tells the program what subfilder in media that file should be stored. It also helps in retriving the file.

####    db.sqlite3
    This is the development test database. You can delete this and repply migrations. 
    **Note**: Some models are dependent on eahc other, you create the, first before others can be created. Check migrations to understand how db was built before doing this.

####    manage.py
    using `python manage.py command`, we can do most things from out command prompt such as run a server, change password or even open a shell to interact with the database.

#### requirements.txt
    All dependecies needed to run communities are listed here



## Front End



