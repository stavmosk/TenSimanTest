$(function() {
    //set the login button.
    $('#imgFBLogin').click(function() {
        Login();
    });
});

window.fbAsyncInit = function() {

    // initialize the SDK with your app ID. This will let you make calls against the Facebook API.
    // IMPORTANT NOTE: All FB.API methods must be called after FB.init!
    FB.init({
        appId: 'id here', // App ID
        channelUrl: 'channel.html', // Channel File
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML
    });

    //Subscribe to auth changes.
    FB.Event.subscribe('auth.authResponseChange', function(response) {

        //the user is logged in and has authenticated your app
        if (response.status === 'connected') {
            //SUCCESS

            // and response.authResponse supplies the user's ID, a valid access token,
            // a signed request, and the time the access token and signed request each expire.
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            
            //$.ajax()
            
            $("#message").html($("#message").html() + "<br>Connected to Facebook + Authenticated app");
            getUserInfo();
        }
        // the user is logged in to Facebook, but has not authenticated your app
        else if (response.status === 'not_authorized') {
            //FAILED

            $("#message").html($("#message").html() + "<br>Failed to Connect");
        }
        // the user isn't logged in to Facebook.
        else {
            //UNKNOWN ERROR

            $("#message").html($("#message").html() + "<br>Logged Out");
        }
    });
};

//attempt user login.
function Login() {
    FB.login(function(response) {
        // handle the response
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            getUserInfo();
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'email,user_likes,user_photos,user_videos'}); //set app's required permissions
}

// Get user's entire info.
function getUserInfo() {
    FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');

        var str = "<b>Name</b> : " + response.name + "<br>";
        str += "<b>Link: </b><a target=\"_blank\" href=\"" + response.link + "\">" + response.link + "</a><br>";
        str += "<b>Username:</b> " + response.username + "<br>";
        str += "<b>ID: </b>" + response.id + "<br>";
        str += "<b>Email:</b> " + response.email + "<br>";
        str += "<input type='button' value='Get Photo' onclick='getPhoto();'/>";
        str += "<input type='button' value='Logout' onclick='Logout();'/>";
        $('#status').html(str);
    });
}

// Get user's photo
function getPhoto() {
    FB.api('/me/picture?type=normal', function(response) {
        var str = "<br/><b>Pic</b> : <img src='" + response.data.url + "'/>";
        $('#status').html($('#status').html() + str);
    });
}

// Log out user
function Logout() {
    FB.logout(function() {
        document.location.reload();
    });
}

// Load the SDK asynchronously
(function(d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "http://connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));