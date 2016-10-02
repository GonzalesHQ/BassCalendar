'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller("View1Ctrl", function($scope, $firebaseArray, $location) {

  // for preload icon
  $scope.preloader = function() {



    // Animate loader off screen
    $(".preloader").addClass("preload-done");
    setTimeout(bye, 3000);

     function bye() {
     // Keep it gone
      $(".preloader").addClass("bye-preloader");
      }


  };



  //date of today to filter against
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  var today = yyyy + '-' + mm + '-' + dd;
  $scope.dateToday = today;

  $scope.eventIsToday = function(date) {
    if (date == today) {
      return true;
    }
    else {
      return false;
    }

  };


  //var ref = new Firebase(" https://radiant-inferno-9336.firebaseio.com/").orderByChild("start_time").startAt(today);
  //usable but redundant, see ng-if >=today in ngrepeat


  var ref = new Firebase("https://brilliant-torch-2628.firebaseio.com"); //firebase reference
  var arrayFire = $firebaseArray(ref); // for use with genrefilters

  $scope.genreSelect = null;
  $scope.showPagin = true;

  //Genre Selection Function
  //loads new firebase list without pagination, but with genre filter
  $scope.genreChange = function(genre) {
    if (genre != null) {
      var filterArr = ref.orderByChild("genre").equalTo(genre);
      $scope.list = $firebaseArray(filterArr);
      $scope.genreSelect = genre;
      $scope.showPagin = false;

    }
    else {
      $scope.genreSelect = genre;
      $scope.list = list;
      $scope.showPagin = true;

    }
  }


  // create a read-only paginate ref, we pass in the baseRef and the field that
  // will be used in the orderByChild() criteria (this also accepts $key, $priority, and $value)
  // an optional third argument can be used to specify the number of items per page
  var pageRef = new Firebase.util.Paginate(ref, 'start_time', {maxCacheSize: 250});
  // listen for changes to the data as you would on any Firebase ref
  pageRef.on('child_added', function(snap) {
    //console.log('record added', snap.key());
  });
  // discard any currently loaded records (calls child_removed)
  // and then load the next page of records (calls child_added)
  $scope.pagePrevious = function() {
    pageRef.page.prev();
  };
  $scope.pageNext = function() {
    pageRef.page.next(6);
  };
  // create a synchronized array ( with paginated list )
  var list = $firebaseArray(pageRef);
  list.page = pageRef.page;
  // when the page count loads, update local scope vars
  pageRef.page.onPageCount(function(currentPageCount, couldHaveMore) {
    list.pageCount = currentPageCount;
    list.couldHaveMore = couldHaveMore;
  });
  // when the current page is changed, update local scope vars
  pageRef.page.onPageChange(function(currentPageNumber) {
    list.currentPageNumber = currentPageNumber;
    $scope.pageNr = pageRef.currentPageNumber;
  });
  // load the first page
  pageRef.page.next();
  // make the list available in the DOM
  $scope.list = list;

$scope.goToFbPage = function(eventID){
  //goto event page
}


  //TODO pagination - OK

  //TODO :: Filter by genre with ng click !! - OK with haxx

  //TODO :: compare listed dates to today, only show events in future or today, not past events - OK

  //OPTIONAL TODO :: add attending to table ( needs facebook connection) - possibly redundant since thats what the fb link is for. FUCKDAT



})




;
