
# ⛑️ ResQme
ResQme is an Application that serves as your safeguard in times of need. It is a platform for victims of natural accidents to recieve the help they need as soon as possible and provide them with information that is key for their survival.

### Background 
ResQme was born due to the devastating earthquakes in Turkey and Syria of February 6, 2023. Victims of this horrifc accident, were using social media to send out their call for help. Luckly a considerable amount of these victims managed to survive. Eventhough this method of calling for help works, we found it to be inefficient.

### Features
We built ResQme to serve as a bridge between the victims and Search and Rescue Teams, as well as anyone around who is up to help. Users stuck under rubble can easily share their location and vital information to Rescue teams. In addition to this, Victims can make their phone ring with a high pitched sound so that Rescue teams can easily detect where they are. This also has the added benefit of keeping the Victim from shouting as that could cause them to inhale dangerous amounts of dust and toxic material. 

This aggregated data inturn provides Search and Rescue Teams With heat/density maps of sruviving victims and help them organize and deliver help where it's urgently needed. 

During the above mentioned earthquake were unavailable due to high amount of callers. Our Application is Built on top of Firebase, to guarantee high availabilty as user traffic increases.

# Tech Stack

* React Native with Expo (Frontend)
* Firebase as the main backend
* Google Maps as well as the geocoding api
* Google Cloud functions

# Installation

⚠️ This Project is built with the Android operating system in mind, and might not work properly on IOS devices. 

* There is an APK. file provided in the root directory for easy installation.

### Local setup

Make sure to have a firebase project started and have a valid maps api key

* Install Expo-cli `npm install expo`
* Install dependencies `npm install`
* Install `direnv` and setup environment variables with the following keys before starting the development server
    - prepend all firebase config keys with `FIREBASE_`, so apiKey would be `FIREBASE_apikey`
    - save maps api key under `GOOGLE_MAP_KEY`

* run local server `npx expo start` or `npm run start`
    - `npm run cache-clear-start` to start server with clean cache
    - `npm run start-tunnel` to start server with Ngrok for use over the internet

After starting the development server

* Hit `A` to start the project with an android emulator if you have one setup
OR

* You can access the app through Expo Go App on your Android Device (connect to the same network) or use the `start-tunnel` option to access over the internet

# Demo

[Google Solution Challenge 2023 submission video](https://youtu.be/VkfULcUcQxQ)



# Authors

- [@Doro-000](https://github.com/Doro-000)
- [@UncrownedKing1](https://github.com/UncrownedKing1)


Made with ❤️ in Bremen<br />
Google Developer Student Clubs Constructor University (previously Jacobs University)
