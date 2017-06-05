
//Creates cookie form and order total variables selected from the DOM
var cookieForm = document.cookieForm;
var orderTotal = document.getElementById("orderTotal");

//Gets the selected cookie flavor from drop-down list and quantity amount from radio buttons for cookie order.
//Calls functions to retrieve any delivery and additonal cost amounts if those options are selected.  
//Finally calls a function to calculate order's total cost with all selected options in form.
function getCookieCost(){
    var cookieFlavor = document.getElementById("cookieFlavor");
    var selectedCookieFlavor = parseFloat(cookieFlavor.options[cookieFlavor.selectedIndex].value);
    
    var cookieNumber = cookieForm.cookieNumber;
    for (var index = 0; index < cookieNumber.length; index++){
        if (cookieNumber[index].checked){
            var cookieQuantity = parseFloat(cookieNumber[index].value);
        }
    }
    
    var cookieCost = (selectedCookieFlavor*cookieQuantity);
    var additionalCost = getAdditionalCost();
    var deliveryCost = getDeliveryCost();
    
    var totalCost = (cookieCost + additionalCost + deliveryCost).toFixed(2);
    return totalCost;
    
}

//Calculates and returns additional cost amount based on any selected checkboxes.	
function getAdditionalCost(){
    var additionalCost = 0;
    
    for (var index = 0; index < cookieForm.length; index++){
        var formElement = cookieForm[index];
        if (formElement.type == "checkbox"){
            if (formElement.checked){
                additionalCost += parseFloat(formElement.value);
            } 	
        }
    }
    
    return additionalCost;
}

//Calculates and returns delivery cost amount based on selected radio button option.
function getDeliveryCost(){
    var deliveryPickup = cookieForm.deliveryPickup;
    var deliveryCost = 0;
    for (var index = 0; index < deliveryPickup.length; index++){
        if (deliveryPickup[index].checked){
            deliveryCost = parseFloat(deliveryPickup[index].value);
        }
    }
    return deliveryCost;
}		

//Calculates total cost and outputs amount as a string in the proper HTML element.
function getTotal(){
    var total = getCookieCost();
    orderTotal.innerHTML = "$" + total;
}

//Resets order total cost to default value with all default options selected.
function clearTotal(){
    orderTotal.innerHTML = "$0.00";
}

//Form elements	
function processOrder(){
    var nameForOrder = cookieForm.nameForOrder;
    var emailForOrder = cookieForm.emailForOrder; 
    var cookieFlavor = document.getElementById("cookieFlavor");
    var checkDeliveryOption = cookieForm.deliveryPickup[0];
    var checkPickupOption = cookieForm.deliveryPickup[1];
    var state = cookieForm.state;
    var zip = cookieForm.zip;

//Regular Expressions
    var validEmail = /^(([^<>()\[\]\\.,;:@"\x00-\x20\xF7]|\\.)+|("""([^\x0A\x0D"\\]|\\\\)+"""))@(([a-z]|#\d+?)([a-z0-9-]|#\d+?)*([a-z0-9]|#\d+?)\.)+([a-z]{2,4})$/i;
    var validState = /[a-z]{2}/i;
    var validZip = /\d{5}/;

//Checks form elements to ensure a valid user response has been entered.    
    if (nameForOrder.value == ""){
        alert("You forgot to enter a name for your order!");
        nameForOrder.focus();
        nameForOrder.select();
    } else if (emailForOrder.value == ""){
        alert("You forgot to enter an email for your order!");
        emailForOrder.focus();
        emailForOrder.select();
    } else if(validEmail.test(emailForOrder.value) != true){
        alert("Email is invalid. Please try again.");
        emailForOrder.focus();
        emailForOrder.select(); 
    } else if (checkDeliveryOption.checked){
        if (cookieForm.street.value == "" || cookieForm.city.value == "" || cookieForm.state.value == "" || cookieForm.zip.value == ""){
            alert("You forgot to enter a complete address for your delivery!");
        } else if (validState.test(state.value) != true) {
            alert("State input is invalid. Please try again.");
            state.focus();
            state.select();
        } else if (validZip.test(zip.value) !=true) {
            alert("Zip code input is invalid. Please try again.");
            zip.focus();
            zip.select();
        }
   } else if (checkPickupOption.checked){
        if (cookieForm.street.value != "" || cookieForm.city.value != "" || cookieForm.state.value != "" || cookieForm.zip.value != ""){
            alert("You chose to pickup your order at the store. Please do not enter in an address or select delivery for your order instead.");
        }
    } 
 
 //Checks all form elements when submit button is entered. 
    if (nameForOrder.value != ""){
        if (emailForOrder.value != "" && validEmail.test(emailForOrder.value) == true){
            if (checkPickupOption.checked){
                if (cookieForm.street.value == "" && cookieForm.city.value == "" && cookieForm.state.value == "" && cookieForm.zip.value == ""){
                    if (orderTotal.innerHTML != "$0.00"){
                        alert("Thank you for your order!");
                    } else {
                        alert("You haven't ordered anything! Please select a cookie flavor.");
                        cookieFlavor.focus();
                        cookieFlavor.select();
                    }
                }
            } else if (checkDeliveryOption.checked){
                if (cookieForm.street.value != "" && cookieForm.city.value != "" && cookieForm.state.value != "" && cookieForm.zip.value != ""){
                    if (validState.test(state.value) == true && validZip.test(zip.value) == true){
                        if (orderTotal.innerHTML != "$0.00"){
                        alert("Thank you for your order!");
                        } else {
                            alert("You haven't ordered anything! Please select a cookie flavor.");
                            cookieFlavor.focus();
                            cookieFlavor.select();
                        }
                    }
                }
            }
        }
    }
}

//Updates total order cost as user selects options in form by adding event listeners to form elements.
function updateTotal() {
    for (var index = 0; index < cookieForm.length; index++){
        var formElement = cookieForm[index];
        formElement.addEventListener("change", getTotal);
    } 	
}

//Calls functions to initialize order cost calculation and adds event listeners to form buttons.
getTotal();
updateTotal();
cookieForm.submitOrder.addEventListener("click", processOrder);
cookieForm.resetOrder.addEventListener("click", clearTotal);
