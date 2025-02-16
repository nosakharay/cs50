# Communities: A Simple CRUD Mobile Application.
#### Video Demo:  https://youtu.be/3KFsWGGkZJE
#### Description:

Communities is a cross platfrom mobile application. 
It is built with React Native on the front end and connect with a Django Rest API that runs on a backend server.

To run this application;:
1.  The device running the local and development needs to have a static local IP of 192.168.0.4
2.  Download and Install Expo and llow it access to the local network
3.  Navigate to the cs50 folder and create a python virtual environment by running:
    `python venv -m <nameenv>`
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


