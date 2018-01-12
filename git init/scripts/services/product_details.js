
angular.module('myApp').factory("ProductDetailsSrv", function($http , $q) {
  var factorySrv = {},
      partNumber,
      zipCode,
      imageUrl = [];
   var _productDetail;
  // var newArrivalMethods = [];

   
  factorySrv.getPartNumberDetail = function(partNumber) {
      
    return  $http({
      method: 'GET',
      url:' https://mobilesalint-pilotvip.prod.ch4.s.com/mobileapi/v3/products/details/'+partNumber+'?storeName=Sears&showSpecInd=true&storePriceInd=true&unitNum=0001213&showMatureContentInd=true ',
     // https://mobilesalint.prod.global.s.com/mobileapi/v3/products/details/'+partNumber+'?storeName=Sears&showSpecInd=true&storePriceInd=true&unitNum=0001213&showMatureContentInd=true
      headers: {
              'Authorization': 'Basic hmac-v1 SHOPSEARS25IPAD:gDqzbRtubvUk2UOpo98nqmTkGcs=',
              'Accept': 'application/json, text/plain'
       
     //  https://mcp6-sal3vip.qa.ch3.s.com/mobileapi/v3/products/details/'+partNumber+'?storeName=Sears&showSpecInd=true&storePriceInd=true&unitNum=0001213&showMatureContentInd=true 
      }
    });

  }
  factorySrv.getDeliveryAvailability = function(inventoryItems) {



     return  $http({
      method: 'POST',
      url:'https://mobilesalint-pilotvip.prod.ch4.s.com/mobileapi/v2/inventory/check',
      data: inventoryItems,
      headers: {

          'Accept': 'application/json;charset=UTF-8',
          'Authorization': 'hmac-v1 SHOPSEARS25IPAD:4+YaFhGQGna4AaUuwkgDvW2zW88=',              
          'X-SAL-Date': 'Wed, 10 Jan 2018 13:06:27 GMT',                     
          
          'X-USP-TraceID': 'SHOPSEARS25IPAD|Organic|14d68019-0e8c-4874-8e7f-da5ef963667a|20180110183627_7906924087136'
         }
      });        
    } 


    

    
   factorySrv.getReviewsDetail = function (partNumber) {

      return  $http({
      method: 'GET',
      url:' https://mobilesalint-pilotvip.prod.ch4.s.com/mobileapi/v1/products/reviews?partNum='+partNumber+'',

      headers: {

              'Accept': 'application/json, text/plain',
              'Authorization': 'hmac-v1 SHOPSEARS25IPAD:6+mK4/8uLv55RoDJPwZgm3fspeQ=',
              'X-SAL-Date' : 'Wed, 10 Jan 2018 13:26:15 GMT',
              'X-USP-TraceID': 'SHOPSEARS25IPAD|Organic|14d68019-0e8c-4874-8e7f-da5ef963667a|20180110185615_7153312332425'
     //  https://mcp6-sal3vip.qa.ch3.s.com/mobileapi/v3/products/details/'+partNumber+'?storeName=Sears&showSpecInd=true&storePriceInd=true&unitNum=0001213&showMatureContentInd=true 
      },

      transformResponse: function(response) {
            response = JSON.parse(response);
            if (response.data && response.data.reviews) {
              var reviews = {
                summary: {
                  overallRating: response.data.summary.overallRating,
                  maxRating: response.data.summary.overallRatingBreakdown.length
                },
                items: []
              };
              for (var i = 0; i < response.data.reviews.length; i++) {
                var review = response.data.reviews[i];
                reviews.items.push({
                  title: review.reviewSummary,
                  content: review.reviewContent,
                  rating: review.attributeRating[0].attributeValue,
                  username: review.author.screenName,
                  city: review.author.city,
                  state: review.author.state
                });
              }

              return reviews;
            }
          }
    });
    }


    

    factorySrv.getArrivalMethods = function(_productDetail) {
      
        // var ProductDetailsResponse = _productDetail;
        var newArrivalMethods = [];

        if (_productDetail.source === "SKINNY" || (_productDetail.source === "online" && _productDetail.arrivalMethods.length === 0)) {
          newArrivalMethods.push("Take With");
          if (_productDetail.distributionCenter !== 'VIEW_ONLY') {
            newArrivalMethods.push("Merchandise Pickup");
            newArrivalMethods.push("Transfer Sale");
          } else {
            newArrivalMethods.push("Merchandise Pickup");
          }

          return newArrivalMethods;
        }

        if (isDeliveryOnlyItem(_productDetail)) {
          newArrivalMethods.push("Delivery");
          newArrivalMethods.push("Take With");
          if (_productDetail.distributionCenter !== 'VIEW_ONLY') {
            newArrivalMethods.push("Merchandise Pickup");
          }

          return newArrivalMethods;
        }

        if ((_productDetail.arrivalMethods !== null && _productDetail.arrivalMethods.length > 0) && _productDetail.arrivalMethods.indexOf("Delivery") !== -1 && _productDetail.source === "online") {
          newArrivalMethods.push("Delivery");
        }

        if ((_productDetail.arrivalMethods !== null && _productDetail.arrivalMethods.length > 0) && _productDetail.arrivalMethods.indexOf("Ship") !== -1 &&
        "online") {
          newArrivalMethods.push("Ship");
        }

        if (!isMarketPlaceItem(_productDetail)) {
          newArrivalMethods.push("Take With");
        }

        if (isShipOnlyItem(_productDetail)) {
          if (_productDetail.distributionCenter !== 'VIEW_ONLY') {
            newArrivalMethods.push("Merchandise Pickup");
          }

          return newArrivalMethods;
        }


        if (_productDetail.distributionCenter !== 'VIEW_ONLY') {
          newArrivalMethods.push("Merchandise Pickup");
          newArrivalMethods.push("Transfer Sale");
        }

        if (newArrivalMethods.indexOf("Take With") !== -1 && newArrivalMethods.indexOf("Delivery") !== -1 && _productDetail.source === "online") {
          newArrivalMethods.push("Cust. Pickup @ MDO");
        }

        return newArrivalMethods;
      };

       var isDeliveryOnlyItem = function(_productDetail) {
        if (_productDetail.arrivalMethods && _productDetail.arrivalMethods.length === 1) {
          if (_productDetail.arrivalMethods.indexOf("Delivery") !== -1) {
            return true;
          }
        }

        return false;
      };
      var isMarketPlaceItem = function(_productDetail) {
        if ((_productDetail.defaultSeller && _productDetail.defaultSeller.soldBy === 'Sears') || !_productDetail.marketPlaceItemInd) {
          return false;
        }

        return true;
      };

      var isShipOnlyItem = function(_productDetail) {
        if (_productDetail.arrivalMethods && _productDetail.arrivalMethods.length === 1 && _productDetail.arrivalMethods.indexOf("Ship") !== -1) {
          return true;
        }

        return false;
      };



      factorySrv.getCartDetails = function(CartDetails) {

    return  $http({
      method: 'POST',
      url:'https://mobilesalint-pilotvip.prod.ch4.s.com/mobileapi/v1/carts/37f2fbce-1947-43e4-9a49-0af26ac7d9b9/items?fullCartResponse=true&sessionId=71bc7044-b126-4225-9c5d-7ee4b7fad6cc',
      data: CartDetails,
      headers: {

         // 'Accept': 'application/json;charset=UTF-8',
          'Authorization': 'hmac-v1 SHOPSEARS25IPAD:HZiJ/C0GUU10AoZooZ34BvmmIKs=', 
          'Content-Type': 'application/json;charset=UTF-8',             
          'X-SAL-Date': 'Fri, 12 Jan 2018 05:24:44 GMT',                     
          'X-SAL-SessionID' : '71bc7044-b126-4225-9c5d-7ee4b7fad6cc',
          'X-USP-TraceID': 'SHOPSEARS25IPAD|Organic|71bc7044-b126-4225-9c5d-7ee4b7fad6cc|20180112105444_3955504421301'
         }
      });        
    } 

  


 

  return factorySrv;

});





/*      //'Access-Control-Allow-Headers': '*', 
        'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36', 
        'X-SAL-UserTrackingID' : 'TRACKER_ASSOC1272741950', 
        'Accept' : 'application/json', 
        'Content-Type' :'application/json',
        'Access-Control-Allow-Credentials' : true,
        'X-SAL-SessionID': '500c191d-34bf-46fe-b14d-87cb492a13ba', 
        'X-SAL-Date' : 'Tue, 09 Jan 2018 18:53:47 GMT',
        'X-SAL-ClientID':'SHOPSEARS25IPAD', 
        'Authorization' : 'Basic hmac-v1 SHOPSEARS25IPAD:haKUcsC86pQ45IP9u/FYQzbSG9Q=', 
        'X-USP-TraceID' : 'SHOPSEARS25IPAD|Organic|500c191d-34bf-46fe-b14d-87cb492a13ba|1392749627070_2141616621524'*/











 /*factorySrv.getZipCode=function(zipCode){
    return  $http({
      method: 'GET',
      url:'https://mobilesalint.prod.global.s.com/mobileapi/v1/location/zipcode/'+zipCode+'',

      headers: {
              'Authorization': 'Basic hmac-v1 SHOPSEARS25IPAD:6meQv0mJtcoHA8FeOK1lv2veYJc=',
              'Accept': 'application/json, text/plain'
        
      }
     
    });
     console.log(zipCode);
    
  }*/








 /*inventoryItems: {
          partNum: '02215723000P',
          zipCode: '05443',
          mode: 'DELIVERY',
          deliveryStore: '09300',
          reqQuantity: '1',
          storeId: 'Sears',
         // storeList: storeList
        },*/