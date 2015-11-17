/// <reference path="typings/jquerymobile/jquerymobile.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/cordova/cordova.d.ts" />
/// <reference path="typings/handlebars/handlebars.d.ts" />
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var BlankCordovaApp1;
(function (BlankCordovaApp1) {
    "use strict";
    var apiUrl = 'http://api.groblschegg.at:8080/BusinessTravellerAPI/api';
    var tokenUrl = 'http://api.groblschegg.at:8080/BusinessTravellerAPI/token';
    //var apiUrl = 'http://localhost:6778/api';
    //var tokenUrl = 'http://localhost:6778/token';
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        var tripItemTPL;
        var accessToken = "";
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
            // $('#doit').on("click", doit_click);
            $('#btLogin').on("click", login);
            $('#btLogout').on("click", logout);
            $('#btSave').on("click", save);
            $("#pageMain").on("pageshow", function () {
                listeAnzeigen();
            });
            tripItemTPL = Handlebars.compile($("#tripItemtpl").html());
            Handlebars.registerHelper("ShortDate", function (dateField) {
                var d = new Date(dateField);
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
                    success: function (response) {
                        $('#tripslist').html(tripItemTPL(response));
                    },
                    error: function (err) { alert('could not render'); }
                });
            }
            else {
                $('#tripslist').html('');
            }
        }
        function login() {
            var txt = $('#txtText').val();
            var username = "Administrator";
            var password = "ppedv2015!2";
            $.ajax({
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                url: tokenUrl,
                data: {
                    username: username,
                    password: password,
                    grant_type: "password"
                },
                success: function (response) {
                    accessToken = response.access_token;
                    useAccessToken(accessToken);
                    window.localStorage.setItem("accessToken", accessToken);
                    setLoginStatus();
                    listeAnzeigen();
                    $.mobile.changePage("#pageMain", { changeHash: true });
                },
                error: function (err) { navigator.notification.alert(err.responseText, function () { }); }
            });
        }
        function logout() {
            accessToken = null;
            setLoginStatus();
            $.mobile.changePage("#pageMain", { changeHash: true });
        }
        function login_click() {
        }
        function save() {
            var dataToPost = {
                Title: $('#Title').val(),
                Start: $('#Start').val(),
                End: $('#End').val(),
                City: $('#City').val()
            };
            $.ajax({
                type: "POST",
                url: apiUrl + "/Trips/AddTrip",
                data: JSON.stringify(dataToPost),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response) {
                    $.mobile.changePage('#pageMain');
                    listeAnzeigen();
                },
                error: function (err) { navigator.notification.alert(err.statusText, function () { }); }
            });
        }
        function useAccessToken(accessToken) {
            $.ajaxSetup({
                headers: { 'Authorization': 'Bearer ' + accessToken }
            });
        }
        function anzeigen_click() {
            $.ajax({
                dataType: "json",
                url: apiUrl + "/Vacations",
                success: function (response) {
                    var html = '';
                    $.each(response, function (i, data) {
                        html += data.Title + "<br/>";
                    });
                    $('#liste').html(html);
                },
                error: function (err) { }
            });
        }
    })(Application = BlankCordovaApp1.Application || (BlankCordovaApp1.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(BlankCordovaApp1 || (BlankCordovaApp1 = {}));
//# sourceMappingURL=appBundle.js.map