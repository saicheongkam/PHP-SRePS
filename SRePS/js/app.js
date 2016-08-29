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
		$scope.sales = Database.getSales();
		
});

app.controller('detailedViewController', 
	function($scope,$routeParams, $filter, Database){
		$scope.sale_id = $routeParams.salesid;
		$scope.sale = Database.getSale($scope.sale_id);
		$scope.sum = 10;
		$scope.sale.items.forEach(function(item){
			$scope.sum += parseFloat(item.unitprice) *parseInt(item.qty);
		});
});

app.controller('addSaleViewController', 
	function($scope, $filter, Database){
		$scope.date = new Date();
		$scope.cart = [{"batch_id":"1","product":"Doxycycline","qty":"2", "unitprice":"12.50"}];
		
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
app.service('Database', function() {
	var sales = [{
				"id":100302, 
				"date": new Date(),
				"amount":"135.00",
				"paid":"150.00",
				"change":"50.00",
				"items":[
					{"batch_id":"1","product":"Doxycycline","qty":"2", "unitprice":"12.50"},
					{"batch_id":"2","product":"Cyclobenzaprine","qty":"1","unitprice":"12.50"},
					{"batch_id":"3","product":"Viagra","qty":"6","unitprice":"12.50"},
					{"batch_id":"4","product":"Zoloft","qty":"1","unitprice":"12.50"}],
				"staff":"James Bardock"
			}];
	this.getSales = function () {
		return sales;
	};
	this.getSale = function (sale_id) {
		var tosend;
		sales.forEach(function(sale){
			if(sale.id==sale_id) tosend = sale;
		});
		return tosend;
	}
});

// App run
app.run(
	function($rootScope) {
		//Enable tooltip and popover
		$rootScope.$on('$viewContentLoaded', function () {
				$(document).ready(function(){
						$('[data-toggle="popover"]').popover();
						$('[data-toggle="tooltip"]').tooltip();
				});
				$(document).foundation();
		});
});



