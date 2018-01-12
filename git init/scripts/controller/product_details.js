
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, ProductDetailsSrv, $sce) {


	 $scope.productDetails = {
		productName:'',
    Review:'',
    Rating:'',
		price: '',
		soldBy:'',
		selectFfm:'',
		shortDescriptions:'',
		longDescriptions:'',
		desc:'',
		spec:'',
		imageUrls140:'',
		imageUrls20:'',
		zipCode:'',
    mode:'',
    deliveryStore:'',
    reqQuantity:'',
    storeId:'',
    source:'',
    quantity :'1',
    ssIN:''
	}
	$scope.inventoryItemsVals = '';

  var partNumber='';
      
  $scope.getDetailsByPartNumber = function(partNumber) {

   $scope.partNumber = partNumber;
  

	ProductDetailsSrv.getPartNumberDetail(partNumber).then(function (response) 
	{
	 	
	$scope.ProductDetailsResponse = response.data.productDetail.softhardProductdetails[0];
	
	 $scope.productDetails = {
				
				productName:   $scope.ProductDetailsResponse.descriptionName,
				imageUrls140:  $scope.ProductDetailsResponse.mainImageUrl,
				imageUrls20:   $scope.ProductDetailsResponse.imageUrls,
				price:         $scope.ProductDetailsResponse.storePromoPrice,
				soldBy:        $scope.ProductDetailsResponse.defaultSeller.soldBy,
				selectFfm:     $scope.ProductDetailsResponse.arrivalMethods,
				spec :		    $scope.ProductDetailsResponse.specification,
  			descShort:		$scope.ProductDetailsResponse.shortDescription,
        partNumber:   $scope.ProductDetailsResponse.partNum,
        source:       $scope.ProductDetailsResponse.source,
        Rating:       $scope.ProductDetailsResponse.rating,
        Review:       $scope.ProductDetailsResponse.numReview,
        ssIN:          $scope.ProductDetailsResponse.identity.sSin,
        descLong:     $sce.trustAsHtml($scope.ProductDetailsResponse.longDescription),
        descShort:    $sce.trustAsHtml($scope.ProductDetailsResponse.shortDescription),

	           }

	      
         		 
	     var arrivalMethodOptions = ProductDetailsSrv.getArrivalMethods($scope.ProductDetailsResponse);
        
              $scope.arrivalMethodOptions = arrivalMethodOptions;
		          console.log( $scope.arrivalMethodOptions);
       		     

				      },
              function (error) {
      			    if (partNumber !== $scope.productDetails.partNumber) {
      			        alert("Please Enter Correct Part Number"); 
      			        
      			    }


			         	});

				        }


        $scope.getProductReviews =function()
         {
          
            //console.log($scope.productDetails.ssIN);
          var  partNumbertoSend = null ;
        if ($scope.productDetails.source === 'SKINNY') {
          partNumbertoSend = $scope.partNum;
        } else {
          partNumbertoSend = $scope.productDetails.ssIN;
            }

          ProductDetailsSrv.getReviewsDetail(partNumbertoSend).then(function (reviews) {
              console.log(reviews);
               $scope.reviews = reviews;
              
        }); 
        }  
      

    $scope.getDetails = function(option)
			  	{
            
			  	$scope.temp = option;
           if($scope.temp === 'rev'){
            
          $scope.getProductReviews();
           	} 
           }

              
			  	$scope.moveImages=function(event)
			  	{
			  		event = event || window.event;
			  		var targetElement = event.target || event.srcElement;
			  		document.getElementById("mainImage").src=targetElement.getAttribute("src");

			  	}

          $scope.getInventoryDetail = function(zipCode,partNumber) {
          $scope.zipCode = zipCode;

        
          $scope.partNumber = partNumber;

          $scope.partNum = partNumber.replace('P', '');
          console.log($scope.partNum);
          console.log( $scope.arrivalMethodOptions);
        
        var setInventoryCheckValues = function() {
          var inventoryItems = {};
          var partNum = '';
          var storeList = [];
          var deliveryStore ='';
          var mode ='';
          var storeId ='';
          var reqQuantity ='';
          var zipCode ='';
          var data = {
          inventoryItems :[{
            partNum: $scope.partNum, 
            storeId: 'Sears',
            mode:  'DELIVERY',
            deliveryStore: '09300',
            storeList:["0001213"],
            zipCode: $scope.zipCode,
            reqQuantity: '1'

              }]
              };

      return data;
        }
          
        var inventoryCheck = function()
         {
        
        $scope.inventoryItemsVals = null;
          ProductDetailsSrv.getDeliveryAvailability(setInventoryCheckValues())
                .then(function(response) {

            $scope.inventoryItemsVals = response.data.items[0].modes[0].locationInfo[0];      
                 
          $scope.zipCode = $scope.inventoryItemsVals.zipCode;
          $scope.date =    $scope.inventoryItemsVals.availDate;
                  
            console.log($scope.zipCode);
            console.log($scope.date);
            

            },
                function (error) {
                  if (error.status === 401 || zipCode.length > 5 || zipCode.length < 5 ) {
                      $scope.unauthorized = true; 
                      alert("please Enter Correct Zipcode");

                      }
                   });
              }

        inventoryCheck();
      };


        $scope.addTocart=function()
          {

          var setCart = function() {
          var CartDetails = {};
          var catalogId = '';
          var fulfillmentLocation = '';
          var fulfillmentMethod ='';
          var fulfillmentStoreNumber ='';
          var inventoryOverride =false;
          var merchantId ='';
          var parentProductId ='';
          var partNum = '';
          var postalCode = '';
          var quantity = '';
          var storeId = '';
          var variantOptions = {};
          var waterFilterInd = false;
           
           CartDetails = {
            catalogId : '12605_Sears',
            fulfillmentLocation : 'FLOOR',
            fulfillmentMethod   :  'DELIVERY',
            fulfillmentStoreNumber : '01213',
            inventoryOverride     : false,
            merchantId        : 'SEARS',
            parentProductId   : '02212853000',
            partNum           : '02212853000',
            postalCode        : '01501',
            quantity          : '1',
            storeId           : '10153',
            variantOptions    : variantOptions,
            waterFilterInd    : false
              };
             //$location.path('/cart.html');

    return CartDetails;
        }

            
            
            ProductDetailsSrv.getCartDetails(setCart()).then(function(response) {
            });
          } 
        
});


                






                 













                 /* if (response.items) {
                    if (response.items[0].modes && response.items[0].modes[0].locationInfo) {
                      $scope.ffmType = response.items[0].modes[0].locationInfo[0].ffmType;
                      $scope.reqQtyAvailInd = response.items[0].modes[0].locationInfo[0].reqQtyAvailInd;
                    }*/



                     
	












      


/*ProductDetailsSrv.getZipCode(zipCode).then(function(response){

            $scope.storezipcode = response.data.zipCodeResults[0].zipCode;
            console.log($scope.storezipcode);

            
   },

                function(response) {
                  $scope.errorMessage = 'Please enter valid zipcode';
                });*/




























































 /*$scope.items = ['DELIVERY','TAKE WITH','FLYBACK DELIVERY','TRANSFER SALE']
*/


/*$scope.spec = 		$scope.ProductDetailsResponse.specification;
	  		$scope.descShort=	$scope.ProductDetailsResponse.shortDescription;
           	$scope.descLong=	$sce.trustAsHtml($scope.ProductDetailsResponse.longDescription);
           	$scope.descShort=	$sce.trustAsHtml($scope.ProductDetailsResponse.shortDescription);
*/