'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }]

)

.controller('View2Ctrl', ['$scope', '$facebook', '$firebaseArray', function($scope, $facebook, $firebaseArray) {

        $scope.isLoggedIn = false;
        $scope.isNotLoggedIn = true;
        
        var ref = new Firebase(" https://radiant-inferno-9336.firebaseio.com/");
        var fireList = $firebaseArray(ref); //firebase connection
        $scope.partylist = fireList; //firebase into scope
        

        $scope.login = function() {
            $facebook.login().then(function() {
                refresh();
            });
        };
        

        
        
        
        $scope.genres = ['neuro', 'dubstep', 'liquid', 'core', 'mixed', 'jumpup'];
        
       
        

        function refresh() {
            $facebook.api("me?fields=events{owner,id,description,cover,place,attending_count,name,start_time}").then(
                function(response) {

                    $scope.isLoggedIn = true; 
                    $scope.isNotLoggedIn = false;
                    
                    $scope.selectedGenre =   null ; //genre value holder
                    
                    var fbResponse = response.events.data; //facebook relevant info

                    $scope.partylist.$loaded().then(function() {
                        //console.log($scope.partylist[0].id + " connected to firebase, data ready");
                    }); //test firebase response 

                    var parties = [];
                    for (var i = 0, len = fbResponse.length; i < len; i++) {
                        if (response.id == fbResponse[i].owner.id) {
                            parties.push(fbResponse[i]);
                        }
                    }
                    $scope.fbResponse = fbResponse; //get parties where user is owner ( var parties[] ) and put them in scope
                    $scope.welcomeMsg = "Choose the event, " + fbResponse[0].owner.name; // welcomeMsg

                    //add party to firebase via ngClick
                    $scope.addParty = function(fbitem) {
                        //look in firebase for party ID and compare to party ID to be added (firebase, location of id's in firebse, id of party)
                    //   console.log( fbitem.id); //id party in fb response
                        var dupeCheck = 0;
                        for (var i = 0, len = fireList.length; i < len; i++) {
                            
                            if(fbitem.id == fireList[i].id){
                                $scope.toastMsg = "The party has already been added.";
                                console.log("The party has already been added.");
                                dupeCheck =+ 1;
                            }
                        }
                            if(dupeCheck > 0){
                                //  $scope.toastMsg = "The party has already been added.";
                                console.log("The party has already been added. Duplicates :" + dupeCheck );
                            }else{
                                
                                if($scope.selectedGenre != null){
                                 console.log(fbitem);
                                 console.log($scope.selectedGenre);
                                 fbitem.genre = $scope.selectedGenre;
                                 console.log("-------------");
                                 console.log(fbitem);
                                 $scope.partylist.$add(fbitem); //add party to firebase
                                 console.log("Event Added ! ");
                                    
                                }
                                 else{
                                     console.log($scope.selectedGenre);
                                     console.log("Select genre before adding!")
                                 }
                            }
                        
                    }//end addParty() funtion
                    
                    // use NG FORM and make it submit the EVENT ID to the handler ( use form name = $index this yields unique names)
                    // filter out the selected genre from radio btns, find em inside the 'ngrepeat > ngform' scope
                    // Then grab the corresponding event JSON data from the list and push the genre into it :: submit(event.ID) or submit(jsonEventData.push(genre)) (?)
                    // send info to the Firebase
                    // add validation etc etc
                    

                    //TODO - get radio buttons to work decently
                    //TODO - Only show parties with date set in future
                    //TODO - Check for ID duplicates before $add - OK
                    
                    //TODO - Add genre to party object :: check if genre selected (ngValidate)
                    //- GET selected genre ($scope.genre.name != null) -
                    //add genre to party's JSON (fbitem.genre = $scope.genre.name;) - 
                    //send JSON to firebase   ($scope.partylist.$add(fbitem);)



                },
                function(err) {
                    $scope.welcomeMsg = "Please log in";
                    console.log(err);
                });
        }

        refresh();
    
}])

.directive('noImage', function() {
                                     //set default cover image
    var setDefaultImage = function(el) {
        el.attr('src', "https://www.iwantcovers.com/wp-content/uploads/2012/04/Volume-Dial.jpg");
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
});