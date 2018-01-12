


angular.module('Directives')
    .directive('reviewrating', function() {
        return {
            restrict: 'E',
            scope: {
                points: '=points'
            },
            template: '<span><img data-ng-repeat="ratingIterator in getRating()" src="images/icon/svg/ratings_star_full.svg" alt="*"/><img ng-show="half" src="images/icon/svg/ratings_star_half.svg" alt="*"/><img data-ng-repeat="iterator in getEmptyRating()" src="images/icon/svg/ratings_star_empty.svg" alt="*"/></span>',
            replace: true,
            link: function(scope) {
                scope.getRating = function() {
                    var range = [];
                    var emptyRating = [];
                    var n = scope.points;
                    var maxLoop = Math.floor(n);
                    /*var blank=Math.floor(5-n);*/
                    if (parseFloat(n) > 0 && parseFloat(n) % 1 !== 0) {
                        scope.half = true;
                    }
                    for (var j = 0; j < 6; j++) {
                        if (j < maxLoop) {
                            range.push(j);
                        } else {
                            emptyRating.push('e' + j);
                        }
                    }
                    return range;
                };
                scope.getEmptyRating = function() {
                    var emptyRating = [];
                    var n = scope.points;
                    var blank = Math.floor(5 - n);
                    for (var j = 0; j < blank; j++) {
                        emptyRating.push('e' + j);
                    }
                    return emptyRating;
                };
            }
        };
    });