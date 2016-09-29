var app = angular.module("myApp", ['ngRoute','ngAnimate']);

// Route configarations
app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/users', { templateUrl: 'views/usersView.html', controller: 'userViewController',resolve:{
					"check":function($location){
						if(sessionStorage.user == null){
							$location.path('/login');  
						}
					}					
				}})
			.when('/users/adduser', { templateUrl: 'views/addUserView.html', controller: 'userViewController'})
			.when('/login', { templateUrl: 'views/loginView.html', controller: 'loginViewController'})
			.when('/sales', { templateUrl: 'views/salesView.html', controller: 'salesViewController'})
			.when('/sales/:salesid', { templateUrl: 'views/detailedSaleView.html', controller: 'detailedSaleViewController'})
			.when('/sale/add', { templateUrl: 'views/addSaleView.html', controller: 'addSaleViewController'})
			.when('/inventory', { templateUrl: 'views/inventoryView.html', controller: 'inventoryViewController'})
			.when('/addItem', { templateUrl: 'views/addItemView.html', controller: 'addItemViewController'})			
			.otherwise({ templateUrl: 'views/homepage.html', controller: '',resolve:{
					"check":function($location){
						if(sessionStorage.user == null){
							$location.path('/login');  
						}
					}
				}
			} );
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
		if(tab == "inventory" || tab == "report" || tab == "stat"){
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
	
	//Login API call
	this.doLogin = function (toAdd) {
		return $http({
			method: 'POST',
			url:'api/loginapi.php',
			data: $.param({username: toAdd.username,password:toAdd.password}),           
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}							
		}); 		
	};	
	
	// User logout
	this.doLogout = function(){
		return $http({
			method: 'POST',
			url:'api/logout.php'						
		}); 			
	}
	//Get users API
	this.getUsers = function () {
		return $http.get("api/getusers_api.php");
	};	
	
	//Create user API
	this.createUser = function (toAdd) {
		//console.log(toAdd);
		return $http({
			method: 'POST',
			url:'api/adduser_api.php',
			data: $.param({staffname:toAdd.staffname,role:toAdd.role,username: toAdd.username,password:toAdd.password}),           
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}							
		}); 		
	};	
	
	//Password reset API
	this.resetPassword = function (toAdd) {
		//console.log(toAdd);
		return $http({
			method: 'POST',
			url:'api/password_api.php',
			data: $.param({id:toAdd.id,password:toAdd.password}),           
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}							
		}); 		
	};	

	// Delete user API
	this.deleteUser = function (toAdd) {
		//console.log(toAdd);
		return $http({
			method: 'POST',
			url:'api/deluser_api.php',
			data: $.param({id:toAdd.id}),           
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}							
		}); 		
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