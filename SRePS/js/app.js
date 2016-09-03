var app = angular.module("myApp", ['ngRoute']);

// Route configarations
app.config(
	['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/sales', { templateUrl: 'views/salesView.html', controller: 'salesViewController'})
			.when('/sales/:salesid', { templateUrl: 'views/detailedView.html', controller: 'detailedViewController'})
			.when('/sale/add', { templateUrl: 'views/addSaleView.html', controller: 'addSaleViewController'})
			.when('/inventory', { templateUrl: 'views/inventoryView.html', controller: 'inventoryViewController'})
			.when('/addItem', { templateUrl: 'views/addItemView.html', controller: 'addItemViewController'})
			.otherwise({ templateUrl: 'views/salesView.html', controller: 'salesViewController'} );
	}]
);

// Controllers

app.controller('salesViewController', 
	function($scope, $filter, $window, Database){
		$scope.navigateTo = function(sale_id) {
			document.getElementById('select-sale-'+sale_id).click();
		};
		Database.getSales().success(function(result){
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
			if(!(toAdd.resolved=='invalid' || toAdd.resolved==null)){
				$scope.cart.push({"batch_id":toAdd.batch_id,"product":toAdd.product,"qty":toAdd.qty,"unitprice":toAdd.unit_price});
				$scope.calculateTotal();
				document.getElementById('batch_id').focus();
				$('#pricetag').addClass('animated flipInX');
				$scope.toAdd = {};
				$scope.toAdd.qty = 1;
			}
		};
		$scope.removeItem = function(toRemove){
			var indexToRemove = $scope.cart.indexOf(toRemove);
			if (indexToRemove>=0) $scope.cart.splice(indexToRemove,1);
			$scope.calculateTotal();
		}
		$scope.resolveProduct = function(batch_id)
		{
			$scope.toAdd.resolved = false;
			Database.getProduct(batch_id).success(function(result){
				if(result.name){
					$scope.toAdd.product = result.name;
					$scope.toAdd.resolved = true;
					$scope.toAdd.unit_price = result.price;
				}else{
					$scope.toAdd.product = "Invalid Batch";
					$scope.toAdd.resolved = "invalid";
					document.getElementById('batch_id').focus();
				}
			});
		}
		$scope.finalise = function()
		{
			var toSend = { "SaleDate":  $filter('date')($scope.date,'yyyy/MM/dd'),
										 "Amount": $scope.calculateTotal(),
										 "Paid": $scope.total_paid,
										 "Change": $scope.change,
										 "Staff_ID": 1,
										 "Items": $scope.cart};
			console.log(toSend);
			$scope.sending = true;
			Database.addSale(toSend).success(function (response) {
					console.log(response);
					$scope.sending = false;
					$('#add-view').modal('hide');
					return response;
			});
		}
		
		$scope.date = new Date();
		$scope.cart = [];
		$scope.toAdd = {qty:1};
		$scope.total_paid = 0;
		$scope.change = 0;
		$scope.calculateTotal();
	
});

app.controller('inventoryViewController', 
	function($scope){
		$scope.date = new Date();
	
	var slider = new Slider('#ex1', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});
		
});

app.controller('addItemViewController', 
	function($scope, Database){
		$scope.inventory = [{"batch_id":"1","category":"Antibiotic","manufacturer":"Actavis","product":"Doxycycline","desc":"Antibiotic used for treating bacterial infections","qty":47}];
		$scope.addItem = function(toAdd){
			$scope.inventory.push({"batch_id":toAdd.batch_id,"category":toAdd.category,"manufacturer":toAdd.manufacturer,"product":toAdd.product,"desc":toAdd.desc,"qty":toAdd.qty});
		};
});

app.controller("myModalCtrl", function($scope) {
	$scope.showModal = false;
	$scope.open = function() {	
		$scope.showModal = true;	
	};
	$scope.close = function() {
		$scope.showModal = false;
	};
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
	
	this.getProducts = function (batch_id) {
			return $http.get("api/product_api.php/batch/");
	};
	
	this.getSale = function (id) {
			return $http.get("api/salesapi.php/sales/"+id)
	};
	
	this.getProduct = function (batch_id) {
			return $http.get("api/product_api.php/batch/"+batch_id);
	};
	
	this.addSale = function (toAdd) {
			return $http.post("api/salesapi.php/sales/", toAdd, {headers: {'Content-Type': 'application/json'} });
	};
	
	this.addProduct = function (batch_id) {
			return $http.post("api/product_api.php/batch/"+id);
	};
	
	this.addProduct = function (batch_id) {
			return $http.post("api/product_api.php/batch/"+id);
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