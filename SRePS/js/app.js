var app = angular.module("myApp", ['ngRoute','ngAnimate']);

// Route configarations
app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/sales', { templateUrl: 'views/salesView.html', controller: 'salesViewController'})
			.when('/sales/:salesid', { templateUrl: 'views/detailedSaleView.html', controller: 'detailedSaleViewController'})
			.when('/sale/add', { templateUrl: 'views/addSaleView.html', controller: 'addSaleViewController'})
			.when('/inventory', { templateUrl: 'views/inventoryView.html', controller: 'inventoryViewController'})
			.when('/addItem', { templateUrl: 'views/addItemView.html', controller: 'addItemViewController'})
			.otherwise({ templateUrl: 'views/homepage.html', controller: ''} );
	}]
);

// Controllers

app.controller('menuController', function($scope,$window){
	$scope.isActive = function(requestedTab){
		var strs = $window.location.toString().split('/');
		var thisTab = strs[strs.indexOf('#')+1];
		return (requestedTab==thisTab);
	};
});

app.controller('salesViewController', function($scope, $filter, $window, Database){
		$scope.navigateTo = function(sale_id) {
			document.getElementById('select-sale-'+sale_id).click();
		};
		
		$scope.generateReport = function()
		{
			var doc = new jsPDF('p', 'pt', 'letter');
			alert('here');
			source = $('#content')[0];
			margins = {
								top: 80,
								bottom: 60,
								left: 40,
								width: 522
								};
		 specialElementHandlers = {
							// element with id of "bypass" - jQuery style selector
							'#bypassme': function(element, renderer) {
									// true = "handled elsewhere, bypass text extraction"
									return true
							}
					};
			doc.fromHTML(
										source, // HTML string or DOM elem ref.
										margins.left, // x coord
										margins.top, {// y coord
												'width': margins.width, // max width of content on PDF
												'elementHandlers': specialElementHandlers
										},
						function(dispose) {
								// dispose: object with X, Y of the last line add to the PDF 
								//          this allow the insertion of new lines after html
								doc.save('Test.pdf');
						}
						, margins);
		}
		Database.getSales().success(function(result){
			$scope.sales = result;
		});
		
});

app.controller('detailedSaleViewController', function($scope,$routeParams, $filter, Database){
	
		$scope.calculateTotal = function(sales){
			var sum = 0;
			sales.items.forEach(function(item){
					sum += parseFloat(item.unitPrice) *parseInt(item.quantitySold);
			});
			return sum;
		}
		
		$scope.sale_id = $routeParams.salesid;
		
		Database.getSale($scope.sale_id).success(function(result){
				console.log(result);
				$scope.sale = result[0];
				$scope.sum = $scope.calculateTotal($scope.sale);
		});
		
});

app.controller('addSaleViewController', function($scope, $filter, Database, $window){
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
			Database.addSale(toSend).success(function(response){
				$scope.sending = false;
				$('#add-view').modal('hide');
				$window.location = "#/"; 
				$window.location = "#/sales";
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

app.controller('inventoryViewController', function($scope, Database){
		$scope.selectedItem = 0;
	
		$scope.selectItem = function(item)
		{
			Database.getItem(item).success(function(result){
				$scope.selectedItem = result;
			});
		}
		
		Database.getInventory().success(function(result){
				$scope.inventory = result;
		});
		
});

app.controller('viewItemViewController', function($scope,Database) {
		$scope.editPrice = false;
		$scope.editLimit = false;
		$scope.updating = false;
		$scope.updateItem = function(itemToUpdate)
		{
			$scope.updating = true;
			var toSend = {"UnitPrice":itemToUpdate.price,"ReorderLevel":itemToUpdate.reOrderLevel}
			Database.updateItem(itemToUpdate.id,toSend).success(function(result){
				$scope.updating = false;
				$('#view-item').modal('hide');
				$window.location = "#/"; 
				$window.location = "#/inventory";
				return result;
			});
		};
});

app.controller('addItemViewController', function($scope, Database, $window){
	
		Database.getDrugs().success(function(result){
				$scope.types = result;
		});
		
		$scope.addItem = function(toAdd){
			$scope.sending = true;
			var toSend = {"Description":toAdd.product,"Supplier":toAdd.supplier,"Drug_ID":1,"Type_ID":toAdd.type, "UnitPrice":0,"ReorderLevel":1};
			Database.addItem(toSend).success(function(response){
				alert(response);
				$scope.sending = false;
				$('#add-item').modal('hide');
				//to refresh the view
				$window.location = "#/"; 
				$window.location = "#/inventory";
				return response;
			});
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
	//Sale APIS
	this.getSales = function () {
		return $http.get("api/salesapi.php/sales");
	};
	
	this.getSale = function (id) {
			return $http.get("api/salesapi.php/sales/"+id);
	};
	this.addSale = function (toAdd) {
			return $http.post("api/salesapi.php/sales/", toAdd, {headers: {'Content-Type': 'application/json'} });
	};
	
	//Inventory APIS
	this.getInventory= function () {
			return $http.get("api/product_api.php/product/");
	};
	this.getItem = function (item_id) {
			return $http.get("api/product_api.php/product/"+item_id);
	};
	this.getProduct = function (batch_id) {
			return $http.get("api/product_api.php/batch/"+batch_id);
	};
	this.updateItem = function (id, dataToUpdate) {
			return $http.put("api/product_api.php/product/"+id,dataToUpdate,{headers: {'Content-Type': 'application/json'} });
	};
	this.addItem = function (toAdd) {
			return $http.post("api/product_api.php/product/",toAdd,{headers: {'Content-Type': 'application/json'} });
	};
	
	//Drug APIS
	this.getDrugs = function () {
			return $http.get("api/drug_api.php/type/");
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

// Animations 

app.animation('.reveal-animation', function() {
	return {
		enter: function(element, done) {
			element.css('display', 'none');
			element.fadeIn(250, done);
			return function() {
				element.stop();
			}
		},
		leave: function(element, done) {
			element.fadeOut(250, done)
			return function() {
				element.stop();
			}
		}
	}
	});