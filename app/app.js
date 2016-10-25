'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.calendar',
  'myApp.addevent',
  'myApp.version',
  'ngFacebook',
  'firebase',

])


// config

.config(['$routeProvider','$facebookProvider',  function($routeProvider, $facebookProvider) {

  $facebookProvider.setAppId('replace').setPermissions(['email','user_events']);
  $routeProvider.otherwise({redirectTo: '/calendar'});

}])

// run

.run( function( $rootScope ) {
  // Load the facebook SDK asynchronously
  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script');
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());
})


// .config(['$facebookProvider', function($facebookProvider) {
//     $facebookProvider.setAppId('974494579240404').setPermissions(['email','user_events']);
//   }])//Facebook config
//

  .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
});// cut filter for trancuating words
