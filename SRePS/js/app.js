var app = angular.module("myApp", ['ngRoute']);

// Route configarations
app.config(
	['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/sales', { templateUrl: 'views/salesView.html', controller: 'salesViewController'})
			.when('/sales/:salesid', { templateUrl: 'views/detailedView.html', controller: 'detailedViewController'})
			.when('/add', { templateUrl: 'views/addSaleView.html', controller: 'addSaleViewController'})
			.otherwise({ templateUrl: 'views/salesView.html', controller: 'salesViewController'} );
	}]
);

// Controllers

app.controller('salesViewController', 
	function($scope, $filter, Database){
		Database.getSales().success(function(result){
			alert(result);
			$scope.sales = result;
		});
		
});

app.controller('detailedViewController', 
	function($scope,$routeParams, $filter, Database){
	
		$scope.calculateTotal = function(sales){
			var sum = 0;
			sales.items.forEach(function(item){
					sum += parseFloat(item.unitprice) *parseInt(item.qty);
			});
			return sum;
		}
		
		$scope.sale_id = $routeParams.salesid;
	
		Database.getSale($scope.sale_id).success(function(result){
				$scope.sale = results;
				$scope.sum = $scope.calculateTotal($scope.sale);
		});
		
});

app.controller('addSaleViewController', 
	function($scope, $filter, Database){
		$scope.calculateTotal = function(){
			var total = 0;
			$scope.cart.forEach(function(item){
				total += parseFloat(item.unitprice) * parseInt(item.qty);
			});
			$scope.total = total;
			return total;
		}
		$scope.addItem = function(toAdd){
			$scope.cart.push({"batch_id":toAdd.batch,"product":toAdd.product,"qty":toAdd.qty,"unitprice":toAdd.unit_price});
			$scope.calculateTotal();
			document.getElementById('product_name').focus();
			$('#pricetag').addClass('animated flipInX');
		};
		$scope.removeItem = function(toRemove){
			var indexToRemove = $scope.cart.indexOf(toRemove);
			if (indexToRemove>=0) $scope.cart.splice(indexToRemove,1);
			$scope.calculateTotal();
		}
		
		$scope.date = new Date();
		$scope.cart = [{"batch_id":"1","product":"Doxycycline","qty":"2", "unitprice":"12.50"}];
		$scope.total_paid = 0;
		$scope.calculateTotal();
	
});

// Data factory
app.factory("Data", 
	function () {
		return {
			sales: function () {
				return [{"date": new Date() ,"id":100302,"amount":"$41.25"}];
			}
		};
	}
);


// Services
app.service('Database', function($http) {
	var sales = [{
				"id":100302, 
				"date": new Date(),
				"amount":"135.00",
				"paid":"150.00",
				"change":"50.00",
				"items":[
					{"batch_id":"1","product":"Doxycycline","qty":"2", "unitprice":"12.50"},
					{"batch_id":"2","product":"Cyclobenzaprine","qty":"1","unitprice":"12.50"},
					{"batch_id":"3","product":"Stemis","qty":"6","unitprice":"12.50"},
					{"batch_id":"4","product":"Zoloft","qty":"1","unitprice":"12.50"}],
				"staff":"James Bardock"
			}];
	
	this.getSales = function () {
		return $http.get("api/salesapi.php/sales")
	};
	
	this.getSale = function (id) {
			return $http.get("api/salesapi.php/sales/"+id)
	};
	
	this.getProduct = function (batch_id) {
			return $http.get("api/product_api.php/batch/"+id);
	};
	
	this.addSale = function (id) {
			$http.post("api/salesapi.php/sales/"+id);
	};
	
});

// App run
app.run(
	function($rootScope) {
});

//Directives

app.directive('ngEnter', function () {
		return function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
						if(event.which === 13) {
								scope.$apply(function (){
										scope.$eval(attrs.ngEnter);
								});

								event.preventDefault();
						}
				});
		};
});

app.directive('formatOnBlur', function ($filter, $window) {
		var toCurrency = $filter('currency');
		return {
				restrict: 'A',
				require: '?ngModel',
				link: function (scope, elem, attrs, ctrl) {
						var rawElem = elem[0];
						if (!ctrl || !rawElem.hasOwnProperty('value')) return;

						elem.on('focus', updateView.bind(null, true));
						elem.on('blur',  updateView.bind(null, false));

						function updateView(hasFocus) {
								if (!ctrl.$modelValue) { return; }
								var displayValue = hasFocus ?
												ctrl.$modelValue :
												toCurrency(ctrl.$modelValue);
								rawElem.value = displayValue;
						}
						updateView(rawElem === $window.document.activeElement);
				}
		};
});