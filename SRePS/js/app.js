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
			.when('/predict/:month/:year', { templateUrl: 'views/predictionView.html', controller: 'predictionViewController'})
			.when('/login', { templateUrl: 'views/loginView.html', controller: 'loginViewController'})
			.when('/users', { templateUrl: 'views/usersView.html', controller: 'userViewController', resolve:{
					"check":function($location){
						if(sessionStorage.user == null){
							$location.path('/login');
						}
					}
				}})
			.when('/users/adduser', { templateUrl: 'views/addUserView.html', controller: 'userViewController'})
			.otherwise({ templateUrl: 'views/homepage.html', controller: '', resolve:{
					"check":function($location){
						if(sessionStorage.user == null){
							$location.path('/login');
						}
					}
				}
			});
	}]
);

// Controllers

app.controller('menuController', function($scope,$window, Database){
	$scope.user_name = "User";
	$scope.showLogout = false;	
	$scope.role = "";
	
	// Check user session
	if(sessionStorage.user != null){
		var user = JSON.parse(sessionStorage.user);
		if(user){
			$scope.user_name = user.name;
			$scope.role = user.role;
			$scope.showLogout = true;
		}
	}	
	
	$scope.isActive = function(requestedTab){
		var strs = $window.location.toString().split('/');
		var thisTab = strs[strs.indexOf('#')+1];
		return (requestedTab==thisTab);		
	};
	
	//Hide menu
	$scope.isDisabled = function(tab){
		var result = true;
		var sales = ["Sales Person","Manager","Owner"];
		var report = ["Manager","Owner"];
		var full = ["Owner"];				
		if(tab == "sales"){
			result = sales.indexOf($scope.role) > -1;			
		}
		if(tab == "inventory" || tab == "reports" || tab == "stat"){
			result = report.indexOf($scope.role) > -1;			
		}
		if(tab == "adduser"){
			result = full.indexOf($scope.role) > -1;
		}		
		return !result;
	}

	//Call logout
	$scope.logout = function(){
		Database.doLogout().success(function(result){
			sessionStorage.clear();
			$window.location = "#/login";
			window.location.reload();			
		});		
	}
});

app.controller('loginViewController', function($scope, $filter, $window, Database){	
	$scope.showError = false;
	$scope.errorMsg = "";

	$scope.login = function(){	
		var toSend = {"username":$scope.username,"password":$scope.userpass};
		if( !$scope.username ){
			$scope.showError = true;
			$scope.errorMsg = "Please enter username";	
			angular.element('#login-username').focus();
			return;
		}else if( !$scope.userpass ){
			$scope.showError = true;
			$scope.errorMsg = "Please enter password";
			angular.element('#login-password').focus();			
			return;			
		}else{
			$scope.showError = false;
			$scope.errorMsg = "";			
			Database.doLogin(toSend).success(function(result){
				if(result.error){
					$scope.showError = true;
					$scope.errorMsg = result.message;						
				}else{
					sessionStorage.setItem('user', JSON.stringify(result));
					$window.location = "#/sales";
					window.location.reload(); 
				}
			});			
		}	
	}
});

app.controller('userViewController', function($scope, $filter, $window, Database){	
	$scope.roles = ['Sales Person', 'Manager', 'Owner'];
	$scope.userrole = "Sales Person";
	$scope.users = null;
	Database.getUsers().success(function(result){
		$scope.users = result;		
	});
	$scope.showReset = function(Id){
		$scope.staff_Id = Id;
		$('#reset-password').modal('show');		
	}
	
	$scope.showDelete = function(Id){
		$scope.staff_Id = Id;
		$('#delete-user').modal('show');		
	}	
	
	//Reset password
	$scope.resetPw = function(){
		if( !$scope.reset_pw ){	
			angular.element('#txt-reset-pw').focus();
			return;
		}else{
			var toSend = {"id":$scope.staff_Id,"password":$scope.reset_pw};
			Database.resetPassword(toSend).success(function(result){
				if(result.error){
					$window.alert(result.message);
				}else{
					$window.alert(result.message);
					$('#reset-password').modal('hide');								
				}
			});			
		}		
	}
	
	//Delete user
	$scope.delUser = function(){
		var toSend = {"id":$scope.staff_Id};
		Database.deleteUser(toSend).success(function(result){
			if(result.error){
				$window.alert(result.message);
			}else{
				$window.alert(result.message);
				$('#delete-user').modal('hide');
				$window.location.reload();		
			}
		});		
	}	
	// Create user 
	$scope.createUser = function(){
		if( !$scope.staffname ){
			$scope.showError = true;
			$scope.errorMsg = "Please enter a Full Name";	
			angular.element('#staff-name').focus();
			return;
		}else if( !$scope.username ){
			$scope.showError = true;
			$scope.errorMsg = "Please enter a Username";
			angular.element('#user-name').focus();			
			return;			
		}else if(!$scope.userpass){
			$scope.showError = true;
			$scope.errorMsg = "Please enter  a Password";
			angular.element('#user-password').focus();			
			return;					
		}else if($scope.userpass != $scope.confirmpass){
			$scope.showError = true;
			$scope.errorMsg = "Password fields are not the same";
			angular.element('#confirm-password').focus();			
			return;					
		}else{		
			$scope.showError = false;
			$scope.errorMsg = "";				
			var toSend = {"staffname":$scope.staffname,"role":$scope.userrole ,"username":$scope.username,"password":$scope.userpass};
			Database.createUser(toSend).success(function(result){
				if(result.error){
					$scope.showError = true;
					$scope.errorMsg = result.message;						
				}else{
					$('#user-confirmation').modal('show');
					$('#user-confirmation').on('hidden.bs.modal', function (e) {
						$window.location = "#/users";
					})					
				}
			});	
		}
	}
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

app.controller('reportsViewController', function($scope,Database, $window) {
		
	var currentDate = new Date();
	
	$scope.currentYear = 1900 + currentDate.getYear();
	$scope.previousYear = $scope.currentYear - 1;
	$scope.nextYear = $scope.currentYear + 1
	
	$scope.upperLimit = $scope.nextYear;
	$scope.lowerLimit = 1999;
	
	$scope.nextYearDisabled = false;
	$scope.previousYearDisabled = false;
	
	$scope.currentMonth = currentDate.getMonth() + 1;
	$scope.nextMonth = $scope.currentMonth + 1;
	
	$scope.animateEnabled = true;
	
	
	$scope.calendarClick = function()
	{
		if ($scope.previousClicked == false && $scope.nextClicked == false && angular.element('#left').click)
			$scope.previousClicked = true;
		
		if ($scope.nextClicked == false && $scope.previousClicked == false && angular.element('#right').click)
			$scope.nextClicked = true;
	}
	
	
	$scope.previous = function()
	{
		if ($scope.previousClicked == false)
			$scope.previousClicked = true;
		else
			$scope.previousClicked = false;
		
		$scope.nextClicked = false;
		
		$scope.currentYear--;
		$scope.previousYear--;
		$scope.nextYear--;
		
		$scope.checkLimit();
	};

	
	$scope.next = function()
	{
		//if ($scope.nextClicked == false)
			$scope.nextClicked = true;
		//else
		//	$scope.nextClicked = false;
		
		$scope.previousClicked = false;
		
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
	$scope.total_revenue = 0;
	Database.getReportSales($scope.month,$scope.year).success(function(response){
		$scope.fetching.sales = false;
		$scope.sales = response;
		$scope.total_revenue = $scope.calculateTotalRevenue($scope.sales);
	});
	
	//helpers
	$scope.calculateTotalRevenue = function(revenueList)
	{
		var total = 0;
		for(var i=0;i<revenueList.length; i++)
		{
			total += parseFloat(revenueList[i].total);
		}
		return total;
	}
	
	$scope.calculateTotalForType = function(item)
	{
		var total = 0;
		for(l=0;l<item.drugs.length; l++)
		{
			total += $scope.calculateTotalForDrug(item.drugs[l].products);
		}
		return total;
	}
	
	$scope.calculateTotalForDrug = function(products)
	{
		var total = 0;
		for(i=0;i<products.length; i++)
		{
			total += parseFloat(products[i].sold);
		}
		return total;
	}
	
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

app.controller('predictionViewController', function($scope, $filter, $routeParams, Database) {
	$scope.year = $routeParams.year;
	$scope.month = $routeParams.month;
	$scope.fetching = {items: true, sales: "true"};
	$scope.predict_items = [];
	$scope.average_revenue = 0;
	$scope.predict_total = 0;
	$scope.highest_item =0;
	//helpers
	$scope.calculateTotal = function(predict_items)
	{
		var total = 0;
		for(var i=0;i<predict_items.length; i++)
		{
			total += parseFloat(predict_items[i].total);
		}
		return total;
	}
	
	$scope.getHighest = function(predict_items)
	{
		var high = 0;
		for(var i=0;i<predict_items.length; i++)
		{
			var value = parseFloat(predict_items[i].total);
			if (value>high)
			{
				high = value;
			}
		}
		return high;
	}
	
	$scope.calculateTotal = function(predict_items)
	{
		var total = 0;
		for(var i=0;i<predict_items.length; i++)
		{
			total += parseFloat(predict_items[i].total);
		}
		return total;
	}
	
	$scope.calculateWidth = function()
	{
		var total_width = document.getElementsByClassName("histogram")[0].clientWidth;
		return (total_width / ($scope.predict_items.length + 1)) - 20;
		
	}
	$scope.calculateHeight = function(x)
	{
		return (x / $scope.highest_item)*200;
		
	}
	
	Database.getPredictItems($scope.month, $scope.year).success(function(response){
		$scope.fetching.items = false;
		$scope.predict_items = response;
		$scope.highest_item = $scope.getHighest($scope.predict_items);
		$scope.predict_total = $scope.calculateTotal($scope.predict_items);
		$scope.average_revenue = $scope.predict_total / $scope.predict_items.length ;
	});
	 
});

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
	
	// Authentication API

	this.doLogin = function (toAdd) {
		return $http({
			method: 'POST',
			url:'api/loginapi.php',
			data: $.param({username: toAdd.username,password:toAdd.password}),           
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}							
		});
	};
	this.doLogout = function(){
		return $http({
			method: 'POST',
			url:'api/logout.php'
		}); 
	}
	this.getUsers = function () {
		return $http.get("api/getusers_api.php");
	};
	this.createUser = function (toAdd) {
		//console.log(toAdd);
		return $http({
			method: 'POST',
			url:'api/adduser_api.php',
			data: $.param({staffname:toAdd.staffname,role:toAdd.role,username: toAdd.username,password:toAdd.password}),           
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}							
		});
	};
	this.resetPassword = function (toAdd) {
		//console.log(toAdd);
		return $http({
			method: 'POST',
			url:'api/password_api.php',
			data: $.param({id:toAdd.id,password:toAdd.password}),           
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}							
		});
	};
	this.deleteUser = function (toAdd) {
		//console.log(toAdd);
		return $http({
			method: 'POST',
			url:'api/deluser_api.php',
			data: $.param({id:toAdd.id}),           
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}							
		});
	};
	
	//Prediction APIS
	this.getPredictItems = function (month,year) {
			return $http.get("api/prediction_api.php/sales/sale?month="+month+"&year="+year);
	};
	
});

// App run
app.run(
	function($rootScope) {
});

//Directives

app.directive('animate', ['$window', function ($window) {

	return {
		link: link,
		restrict: 'A',
	};
	
	function link($scope, element, attrs){
		
		$scope.width = $window.innerWidth;
		
		angular.element($window).on('resize', function(){	
			$scope.width = $window.innerWidth;
			
			if ($scope.width < 768)
				$scope.animateEnabled = false;
			else
				$scope.animateEnabled = true;
			
			$scope.$digest();
		});
	}
}]);

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
