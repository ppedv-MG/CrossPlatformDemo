/// <reference path="typings/jquerymobile/jquerymobile.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/cordova/cordova.d.ts" />
/// <reference path="typings/handlebars/handlebars.d.ts" />


// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
module BlankCordovaApp1 {

    "use strict";
  
    var apiUrl = 'http://localhost:6778/api';
    var tokenUrl = 'http://localhost:6778/token';



    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }


        var tripItemTPL;


        var accessToken: string = "";


        function setLoginStatus() {
            if (accessToken != null) {
                $("#status").html("angemeldet");
            }
            else {
                $("#status").html("nicht angemeldet");
            }

        }
        
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            
            $('#btLogin').on("click", login);
            $('#btLogout').on("click", logout);
            $('#btSave').on("click", save);

            $("#pageMain").on("pageshow", function () {
                listeAnzeigen();
            });



            //Handlebar Template laden
            tripItemTPL = Handlebars.compile($("#tripItemtpl").html());
            
            // Handlebar Erweiterung um Datum anzuzeigen
            Handlebars.registerHelper(
                "ShortDate",
                function (dateField) {
                    var d: Date = new Date(dateField);
                    return d.toLocaleDateString();
                });
           

           
            accessToken = window.localStorage.getItem("accessToken");
            if (accessToken != null) {
                useAccessToken(accessToken);
            }   
           
            setLoginStatus();           
        }

  
     

        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }

        function listeAnzeigen() {
            if (accessToken != null) {
                $.ajax({
                    dataType: "json",
                    url: apiUrl + "/trips",
                    success: (response) => {
                        $('#tripslist').html(tripItemTPL(response));

                    },
                    error: (err) => { alert('could not render'); }
                });
            }
            else {
                $('#tripslist').html('');
            }

        }

        function login() {
           
            var txt: string = $('#txtText').val();
            var username: string;
            var password: string;

            username = $('#txtUser').val();
            password = $('#txtPWD').val();


            $.ajax(
                {
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    url: tokenUrl,
                    data: {
                        username: username,
                        password: password,
                        grant_type: "password"
                    },
                    success: (response) => {
                        accessToken = response.access_token;
                        useAccessToken(accessToken);

                        window.localStorage.setItem("accessToken", accessToken);
                        setLoginStatus();
                        listeAnzeigen();
                        $.mobile.changePage("#pageMain", { changeHash: true });
                    },
                    error: (err) => { navigator.notification.alert(err.responseText, () => { }); }
                }

            );
          
        }

        function logout() {
            accessToken = null;
            setLoginStatus();
            $.mobile.changePage("#pageMain", { changeHash: true });

        }
        
        function save() {
            var dataToPost = {
                Title : $('#Title').val(),
                Start:$('#Start').val(),
                End:$('#End').val(),
                City:$('#City').val()
            };
            
            $.ajax(
                {
                    type: "POST",
                    
                    url: apiUrl + "/Trips/AddTrip",
                    data: JSON.stringify(dataToPost),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: (response) => {
                        $.mobile.changePage('#pageMain');
                        listeAnzeigen();
                    },
                    error: (err) => { navigator.notification.alert(err.statusText, () => { }); }
                });
        }


        // sendet den Auth Header bei jedem JQuery Ajax Aufruf
        function useAccessToken(accessToken) {
            $.ajaxSetup(
                {
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                });
        }
        
    }

    window.onload = function () {
        Application.initialize();
    }
}
