'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
      templateUrl: 'view2/view2.html',
      controller: 'View2Ctrl'
    });
  }]

)

.controller('View2Ctrl', ['$scope', '$facebook', '$firebaseArray', '$rootScope', function($scope, $facebook, $firebaseArray, $rootScope) {


  $scope.preloader = function() {

    // Animate loader off
    $(".preloader").slideUp("slow");
    $(".preload-card").fadeOut("medium");

  };

  var ref = new Firebase("https://brilliant-torch-2628.firebaseio.com");
  var fireList = $firebaseArray(ref); //firebase connection
  $scope.partylist = fireList; //firebase into scope

  $scope.isLoggedIn = $rootScope.isLoggedIn;

  //      function  login () {
  //     $facebook.login().then(function() {
  //         refresh();
  //         $rootScope.isLoggedIn = true;
  //     });
  // }; //fb login

  $scope.genres = ['neuro', 'jumpup', 'dubstep', 'mixed', 'liquid', 'core'];

  var today = new Date();
  $scope.dateToday = today;

  function GetEvents() {
      if ($scope.isLoggedIn) {
    $facebook.api('/me', 'GET', {
      "fields": "id,name,events",
      "debug": "all"
    }).then(
      function(response) {
        console.log(response);
      });
    }
  }

    function refresh() {
      $facebook.api("/me").then(
        function(response) {
          $scope.welcomeMsg = "Welcome " + response.name;
          $scope.isLoggedIn = true;
          GetEvents();
        },
        function(err) {
          $scope.welcomeMsg = "Please log in";
        });
    }


    refresh();





  // function refresh() {
  //     $facebook.api('/me', 'GET', {
  //             "fields": "events{owner,id,description,cover,place,attending_count,name,start_time}",
  //             "debug": "all"
  //         }).then(
  //         function(response) {
  //             console.warn("respone here" + response);
  //             console.warn(response);
  //             $scope.isLoggedIn = true;
  //             $scope.toastMsg = "dik";
  //
  //             $scope.selectedGenre = null; //genre value holder
  //
  //             var fbResponse = response.events.data;
  //             //var fbResponse = response;
  //
  //             console.log(fbResponse)
  //                 //facebook relevant info
  //
  //
  //
  //
  //             $scope.partylist.$loaded().then(function() {
  //                 console.log(" connected to firebase, data ready");
  //             }); //test firebase response
  //
  //             var parties = [];
  //             for (var i = 0, len = fbResponse.length; i < len; i++) {
  //                 // if (response.id == fbResponse[i].owner.id) {
  //                 //     fbResponse[i].genre = null;
  //                 parties.push(fbResponse[i]);
  //                 // }
  //             }
  //             $scope.fbResponse = fbResponse; //get parties where user is owner ( var parties[] ) and put them in scope
  //            // $scope.welcomeMsg = "Choose the event, " + fbResponse.name; // welcomeMsg
  //
  //             //add party to firebase via ngClick
  //             $scope.addParty = function(fbitem) {
  //                     //look in firebase for party ID and compare to party ID to be added (firebase, location of id's in firebse, id of party)
  //                     console.log(fbitem.name + " with genre " + fbitem.genre); //name party in fb response
  //                     var dupeCheck = 0;
  //                     for (var i = 0, len = fireList.length; i < len; i++) {
  //
  //                         if (fbitem.id == fireList[i].id) {
  //                             $scope.toastMsg = "The party has already been added.";
  //                             dupeCheck = +1;
  //                         }
  //                     }
  //                     if (dupeCheck > 0) {
  //                         //  $scope.toastMsg = "The party has already been added.";
  //                         console.log("The party has already been added. Duplicates :" + dupeCheck);
  //                     }
  //                     else {
  //
  //                         if (fbitem.genre != null) {
  //                             console.log(fbitem.name + " " + fbitem.genre);
  //
  //                             $scope.partylist.$add(fbitem); //add party to firebase
  //                             console.log("Event Added ! ");
  //
  //                         }
  //                         else {
  //                             console.log($scope.selectedGenre);
  //                             console.log("Select genre before adding!");
  //                         }
  //                     }
  //
  //                 } //end addParty() funtion NEEDS REWIRITE, STOPPED WORKING -- OK SOLVED
  //
  //             // use NG FORM and make it submit the EVENT ID to the handler ( use form name = $index this yields unique names)
  //             // filter out the selected genre from radio btns, find em inside the 'ngrepeat > ngform' scope
  //             // Then grab the corresponding event JSON data from the list and push the genre into it
  //             // send info to the Firebase
  //             // add validation etc etc
  //
  //
  //             //TODO - get radio buttons to work decently - OK SOLVED
  //             //TODO - Only show parties with date set in future
  //             //TODO - Check for ID duplicates before $add - OK SOLVED
  //
  //             //TODO - Add genre to party object :: check if genre selected (ngValidate) OK
  //             //- GET selected genre (fbitem.genre != null) -
  //             //add genre to party's JSON via ngModel = item.genre //see in view
  //             //send JSON to firebase   ($scope.partylist.$add(fbitem);)
  //         },
  //         function(err) {
  //             $scope.welcomeMsg = "Please log in";
  //             console.log("login failed");
  //             //console.log(err);
  //         });
  // }

  // refresh();

}])

//set default cover image
.directive('noImage', function() {
  var setDefaultImage = function(el) {
    el.attr('src', "https://placehold.it/350x150");
  };

  return {
    restrict: 'A',
    link: function(scope, el, attr) {
      scope.$watch(function() {
        return attr.ngSrc;
      }, function() {
        var src = attr.ngSrc;
        if (!src) {
          setDefaultImage(el);
        }
      });
      el.bind('error', function() {
        setDefaultImage(el);
      });
    }
  };
})


.directive('backImg', function() {
  return function(scope, element, attrs) {
    var url = attrs.backImg;
    element.css({
      'background-image': 'url(' + url + ')',
      'background-size': 'cover'
    });
  };
});
