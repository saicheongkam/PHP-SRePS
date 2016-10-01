var app = angular.module("myApp", ['ngRoute','ngAnimate']);

// Route configarations
app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/sales', { templateUrl: 'views/salesView.html', controller: 'salesViewController'})
			.when('/sales/:salesid', { templateUrl: 'views/detailedSaleView.html', controller: 'detailedSaleViewController'})
			.when('/sale/add', { templateUrl: 'views/addSaleView.html', controller: 'addSaleViewController'})
			.when('/inventory', { templateUrl: 'views/inventoryView.html', controller: 'inventoryViewController'})
			.when('/addItem', { templateUrl: 'views/addItemView.html', controller: 'addItemViewController'})
			.when('/reports', { templateUrl: 'views/reportsView.html', controller: 'reportsViewController'})
			.when('/report/:month/:year', { templateUrl: 'views/reportDetailView.html', controller: 'reportDetailViewController'})
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
			var columns = [
					{title: "Invoice#", dataKey: "id"},
					{title: "Date", dataKey: "date"}, 
					{title: "Amount Due", dataKey: "amount"}, 
			];
			var rows = $scope.sales;
			// Only pt supported (not mm or in)
			var doc = new jsPDF('p', 'pt');
			doc.autoTable(columns, rows, {
					margin: {top: 60},
					beforePageContent: function(data) {
							doc.text("Monthly Sales Report", 40, 40);
					}
			});
			doc.save('table.pdf');
		}
		$scope.selection = {
				range: "day"
		};
		$scope.date_range = 0;
		$scope.calculateDateRange = function(range)
		{
			var difference = 0;
			switch(range)
			{
				case "day": 
					difference = 1;
					break;
				case "week": 
					difference = 7;
					break
				case "month": 
					difference = 30;
					break
			}
			var endDate = new Date();
			var startDate = new Date();
			startDate.setDate(startDate.getDate() - difference );
			startDate = startDate.toISOString().slice(0,10);
			endDate = endDate.toISOString().slice(0,10);
			return {start:startDate,end:endDate};
		}
		
		$scope.fetching = false;
		$scope.reloadTable = function()
		{
			$scope.date_range = $scope.calculateDateRange($scope.selection.range);
			//alert($scope.date_range.start+" -> "+$scope.date_range.end);
			$scope.fetching = true;
			Database.getSalesFrom($scope.date_range.start,$scope.date_range.end).success(function(result){
				$scope.sales = result;
				$scope.fetching = false;
			});
		}
		
		$scope.reloadTable();
		
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
		$scope.selectedItem = {product:0,batches:0};
		$scope.selectItem = function(item){
			Database.getItem(item).success(function(result){
				$scope.selectedItem.product = result;
				$scope.fetching = true;
				Database.getBatches($scope.selectedItem.product.id).success(function(result){
					$scope.fetching = false;
					$scope.selectedItem.batches = result;
					return result;
				});
			});
		}
		
		$scope.reloadData = function ()
		{
			Database.getInventory().success(function(result){
					$scope.inventory = result;
			});
		}
		$scope.reloadData();
});

app.controller('viewItemViewController', function($scope,Database) {
		// View Item Controller
		$scope.editPrice = false;
		$scope.editLimit = false;
		$scope.saving = false;
	
		$scope.closePanel = function ()
		{
			$scope.saving = false;
			$('#view-item').modal('hide');
			$scope.reloadData();
		}
		
		$scope.updateItem = function(itemToUpdate){
			$scope.saving = true;
			var toSend = {"UnitPrice":itemToUpdate.price,"ReorderLevel":itemToUpdate.reOrderLevel}
			Database.updateItem(itemToUpdate.id,toSend).success(function(result){
				
				return result;
			});
		};
	
		//Batch Controller
		$scope.toAdd = {};
		$scope.editing = false;
		$scope.editingBatch = 0;
		
		$scope.editBatch = function(toEdit){
			$scope.toAdd =  JSON.parse(JSON.stringify(toEdit));
			$scope.editing = true;
			$scope.editingBatch = toEdit.batch_id;
		}
		
		$scope.addBatch = function(toAdd){
			$scope.editing = false;
			$scope.editingBatch = 0;
			for(i=0;i<$scope.selectedItem.batches.length;i++)
			{
				var currentBatch = $scope.selectedItem.batches[i];
				if(currentBatch.batch_id==toAdd.batch_id){
					// Update batch detected
					$scope.selectedItem.batches[i] = JSON.parse(JSON.stringify(toAdd));
					$scope.toAdd = {};
					return;
				}
			}
			//Add batch detected!
			var newAddition = JSON.parse(JSON.stringify(toAdd));
			$scope.selectedItem.batches.push(newAddition);
			$scope.toAdd = {};
		}
		
		$scope.finalise = function() {
			$scope.parityCheck = 0;
			$scope.selectedItem.batches.forEach(function(batch){
				if(batch.batch_id==null){
					//Addition
					$scope.saving = true;
					var toAdd = {"Product_ID": $scope.selectedItem.product.id,
													"Quantity":batch.quantity,
													"ExpiryDate":batch.expirydate,
													"Shelf":batch.shelf	};
					Database.addBatch(toAdd).success(function(result){
						$scope.parityCheck+=1;
						if ($scope.parityCheck==$scope.selectedItem.batches.length) $scope.closePanel();
						return result;
					});
				}else if(batch.batch_id>0){
					//Update
					$scope.saving = true;
					var toUpdate = {"Product_ID": $scope.selectedItem.product.id,
													"Quantity":batch.quantity,
													"ExpiryDate":batch.expirydate,
													"Shelf":batch.shelf	};
					Database.updateBatch(batch.batch_id,toUpdate).success(function(result){
						$scope.parityCheck+=1;
						if ($scope.parityCheck==$scope.selectedItem.batches.length) $scope.closePanel();
						return result;
					});
				}
			});
		}
});

app.controller('addItemViewController', function($scope, Database, $window){
	
		Database.getDrugs().success(function(result){
				$scope.types = result;
		});
		
		$scope.addItem = function(toAdd){
			$scope.sending = true;
			var toSend = {"Description":toAdd.product,"Supplier":toAdd.supplier,"Drug_ID":14,"Type_ID":toAdd.type, "UnitPrice":0,"ReorderLevel":1};
			Database.addItem(toSend).success(function(response){
				$scope.sending = false;
				$('#add-item').modal('hide');
				//to refresh the view
				$window.location = "#/"; 
				$window.location = "#/inventory";
				return response;
			});
		};
});

app.controller('reportsViewController', function($scope,Database) {
	
	$scope.currentYear = 2016;
	$scope.previousYear = $scope.currentYear - 1;
	$scope.nextYear = $scope.currentYear + 1
	
	$scope.upperLimit = $scope.nextYear;
	$scope.lowerLimit = 1999;
	
	$scope.nextYearDisabled = false;
	$scope.previousYearDisabled = false;
	
	$scope.currentMonth = 9;
	$scope.nextMonth = $scope.currentMonth + 1;
	
	
	$scope.previous = function()
	{
		$scope.currentYear--;
		$scope.previousYear--;
		$scope.nextYear--;
		
		$scope.checkLimit();
	};
	
	$scope.next = function()
	{
		$scope.currentYear++;
		$scope.previousYear++;
		$scope.nextYear++;
		
		$scope.checkLimit();
	};
	
	
	$scope.checkLimit = function()
	{
		if ($scope.nextYear >= $scope.upperLimit)
			$scope.nextYearDisabled = true;
		else
			$scope.nextYearDisabled = false;
		
		if ($scope.previousYear <= $scope.lowerLimit)
			$scope.previousYearDisabled = true;
		else
			$scope.previousYearDisabled = false;
	};
	
	$scope.checkLimit();
});

app.controller('reportDetailViewController', function($scope, $filter, $routeParams, Database) {
	$scope.year = $routeParams.year;
	$scope.month = $routeParams.month;
	$scope.fetching = { items: true, sales: "true"};
	$scope.items = [];
	Database.getReportItems($scope.month, $scope.year).success(function(response){
		$scope.fetching.items = false;
		$scope.items = response;
	});
	
	$scope.sales = [];
	Database.getReportSales($scope.month,$scope.year).success(function(response){
		$scope.fetching.sales = false;
		$scope.sales = response;
	});
	
	//helpers
	
	$scope.calculateWidth = function(x,list)
	{
		var total = 0;
		var high = 0;
		for(i=0;i<list.length; i++)
		{
			if(parseInt(list[i].sold) > high) 
				high = list[i].sold;
			total+= parseInt(list[i].sold);
		}
		if(total==0) return 0;
		return ((x/high)*98)+2;
	}
	 
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
	
	this.getSalesFrom = function (startDate,endDate) {
		return $http.get("api/salesapi.php/month_sales/date?start="+startDate+"&end="+endDate);
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
			//Batch APIS
			this.getBatches = function (prouct_id) {
					return $http.get("api/batch_api.php/product/"+prouct_id);
			};
			this.updateBatch = function (id, dataToUpdate) {
					return $http.put("api/batch_api.php/batch/"+id,dataToUpdate,{headers: {'Content-Type': 'application/json'} });
			};
			this.addBatch = function (toAdd) {
					return $http.post("api/batch_api.php/batch/",toAdd,{headers: {'Content-Type': 'application/json'} });
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
	
	//Report APIS
	this.getReportSales = function (month,year) {
			return $http.get("api/report_api.php/sales/sale?month="+month+"&year="+year);
	};
	
	this.getReportItems = function (month, year) {
			var date = new Date(year, month, 0, 12, 0, 0, 0);
			var start = new Date(date.moveToFirstDayOfMonth().getTime());
			var end = new Date(date.moveToLastDayOfMonth().getTime());
			start = start.toISOString().slice(0,10);
			end = end.toISOString().slice(0,10);
			return $http.get("api/report_api.php/sales/items?start="+start+"&end="+end);
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

// Filter

app.filter('monthName', [function() {
		return function (monthNumber) { //1 = January
				var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December' ];
				return monthNames[monthNumber - 1];
		}
}]);

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