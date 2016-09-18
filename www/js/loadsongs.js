function include_loadsongsjs($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http){

$scope.loadSongs = function() {
    recursiveCounter = 0;
    $timeout(function() {
        //	alert($scope.showHideYou);
        // if($scope.showHideYou){
           console.log("Trying to load. isApp = "+isApp);
             //if (isApp)
        if (true) {
             console.log("Inside isApp");
            //if (window.localStorage['songs']) {
             if (false) {
             console.log("Already songs loaded");
                console.log(localStorage['songs']);
                $scope.songs = JSON.parse(localStorage['songs']);
                $scope.youCount = $scope.songs.length;
                $ionicLoading.hide();
            } else {
             console.log("songs loading");
             var localURLs = [ cordova.file.applicationDirectory ];
             // if running on IOS
             console.log('cordova.file.documentsDirectory: ' + cordova.file.applicationDirectory);
             // I use cordova.file.documentsDirectory because this url is for IOS (NOT backed on iCloud) devices
             fileTransferDir = cordova.file.applicationDirectory;
             fileDir = '';
             console.log('IOS FILETRANSFERDIR: ' + fileTransferDir);
             console.log('IOS FILEDIR: ' + fileDir);
             console.log('local urls: ' + localURLs);
                var index = 0;
                var i;
                var statusStr = "";
                var endOfRecursive = "";
                function addFileEntry(entry) {
                  $ionicLoading.show({
                      template: 'Loading songs from device...'
                  });
                  recursiveCounter++;
            //      console.log("recursiveCounter = "+recursiveCounter);

                    var dirReader = entry.createReader();
                    dirReader.readEntries(
                        function(entries) {
                            var fileStr = "";
                            if(entries.length == 0){
                              recursiveCounter--;
                            }
                            for (i = 0; i < entries.length; i++) {
                                if (entries[i].isDirectory === true) {
                                    // Recursive -- call back into this subdirectory
                                    addFileEntry(entries[i]);
                                } else {
                                          console.log("entries"+entries[i].name);
                                    if (entries[i].name.indexOf(".mp3") != -1) {
                                          console.log("Mp3 path : "+entries[i].fullPath);
                                      $scope.songs.push({
                                           name: entries[i].name, //+ " ("+Math.round( (file.size/1000000 ) * 10 ) / 10+" mb)",
                                           //filePath: entries[i].fullPath,
                                                        filePath: "file:///var/containers/Bundle/Application/889F9D0E-EE47-4657-9E9D-E2E987E771D3/liveplay.app/Aayakalaigal - TamilWire.Com.mp3"
                                          // album_art_picture : album_art_picture
                                                        
                                      });
                                      $scope.youCount = $scope.songs.length;
                                      localStorage['songs'] = JSON.stringify($scope.songs);
                                      console.log($scope.songs.length + ' ' + entries[i].name);
                                    }
                                }
                                // console.log("i="+i+" entries.lenght-1 = "+entries.length-1);
                                if(i == entries.length-1){
                                  recursiveCounter--;
                            //      console.log("recursiveCounter = "+recursiveCounter);
                                  if(recursiveCounter == 0){
                                    console.log("File system scanning done !!!");
                                    //load thumbnails here
                                    //loadThumbnails(0);
                                    $ionicLoading.hide();
                                  }
                                }
                            }

                        },
                        function(error) {
                            console.log("readEntries error : " + error.code);
                        }
                    );
                };

                function addFileEntryWrapper(entry) {
                    addFileEntry(entry);

                };

                var addError = function(error) {
                    console.log("Filesystem error : " + error.code + ", " + error.message);
                };

                // function loadThumbnails(i){
                //   var dfd = new $.Deferred();
                //    $.when(dfd).then(loadThumbnails);
                //   console.log("thumbnail counter = "+i);
                //   if(i >= $scope.songs.length){
                //     $ionicLoading.hide();
                //     return;
                //   }
                //   	window.resolveLocalFileSystemURL("file://" + $scope.songs[i].filePath,
                //     function(entry){
                //       entry.file(function(file){
                //         musicmetadata(file, function (err, result) {
                //             if (err){
                //               console.log("error id3");
                //             }else{
                //               if (result.picture.length > 0) {
                //                 console.log("title = " + result.title + " ; pic len = "+result.picture.length + " ; pic data type = "+ (typeof result.picture[0].data));
                //
                //                 var picture = result.picture[0];
                //                 var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
                //                 $scope.songs[i].album_art_picture = url;
                //                 $scope.$digest();
                //               }
                //           }
                //           dfd.resolve(++i);
                //           //loadThumbnails(++i);
                //           });
                //       },function(error){console.log("error");dfd.resolve(++i);});
                //     }, function(error){console.log("error");dfd.resolve(++i);});
                // }
                for (i = 0; i < localURLs.length; i++) {
                    if (localURLs[i] === null || localURLs[i].length === 0) {
                        continue; // skip blank / non-existent paths for this platform
                    }
                    window.resolveLocalFileSystemURL(localURLs[i], addFileEntryWrapper, addError);
                }

            }
        }

        if (window.localStorage['partnersongs']) {
            //console.log(localStorage['songs']);
            $scope.partnersongs = JSON.parse(localStorage['partnersongs']);
            $scope.partnerCount = $scope.partnersongs.length;
            return;
        } else {
            $scope.sendToPeer({
                action: 'get-songlist'
            });
        }
    }, 1000);
}
}
