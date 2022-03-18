# Backend
This is the backend application for ProTube of SaProto.

## Installation
Open up a terminal and run 
```sh
npm install
```
To build the frontend
```sh
npm run build
```
To start the project
```sh
npm run start
```
This should start the project on localhost:3000. The screen can be found at /protube/screen and the remote at /protube/remote, the admin remote at /protube/remote/admin, the admin screen at /protube/screen/admin (with code).

### CORS errors
In the event of cors errors this can be modified at protube.js line 34

### Dotenv
###### CLIENT_IDENTIFIER
Identification code for the local client (the electron application)
###### YOUTUBE_MAX_DURATION
Limit for the duration of the youtube videos that can be added to the queue
###### API_KEY
Key used to check the api authentication with, bearer token authorisation is used


### User Authentication
At this moment there is a test user auth method that you'll need to implement manually in a laravel project. 
In the AuthController for example:
```php
/**
     * @param Request $request
     * @return View|RedirectResponse
     */
    public function requestUserdetails(Request $request)
    {
        if(Auth::user()){
            return [
                'authenticated' => true,
                'username' => Auth::user()->calling_name,
                'is_admin' => Auth::user()->can('protube') || Auth::user()->isTempadmin()
            ];
        }
        return [
            'authenticated' => false
        ];
    }
```

And then add the route in web.php in the section routes related to authentication (± line 60)
```php
Route::get('userdetails', ['as' => 'requestusername', 'uses' => 'AuthController@requestUserdetails']);
```

Make sure to set the line 30 in the authenticator.js module to the right url for the userdetails. Note to update the cors rule if protube vue does not run on port 8080 (in protube.js)
