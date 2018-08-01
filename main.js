var url = "https://dc-coffeerun.herokuapp.com/api/coffeeorders";
var coffeeOrderForm = document.querySelector(".data-coffee-order");
var orderList = document.querySelector('.order-list');
var orderListArray = [];

function storeData(orders) {
    localStorage.setItem('coffeeOrders', JSON.stringify(orders))
    for (var property in orders) {
        addStoredOrders(orders[property]);
    };
}

$.get(url, storeData);

var startTimer = function(event) {
    var completedOrderButton = event.target;
    var parent = completedOrderButton.parentElement;
    var deleteOrder = function deleteOrder() {
        parent.parentNode.removeChild(parent);
        var id = parent.getAttribute('id');
        var deletedUrl = url + "/" + id;
        $.ajax({
            url: deletedUrl,
            type: 'DELETE',
            success: function(res){
                console.log(res);
            },
            error: function(err){
                console.log(err);
            }
        });
    };
    parent.setAttribute('class', 'green order');
    setTimeout(deleteOrder, 2000);
}

var addStoredOrders = function(orderObject) {
    var orderArray = [
        orderObject["size"], 
        orderObject["coffee"], 
        "with a shot of ", 
        orderObject["flavor"], 
        "and", 
        orderObject["strength"], 
        "milligrams of caffeine for ", 
        orderObject["emailAddress"]
    ];
    var order = document.createElement('li');
    order.setAttribute('class', 'order');
    order.setAttribute('id', orderObject["emailAddress"]);
    order.textContent = orderArray.join(" ");
    var completed = document.createElement("input");
    completed.setAttribute('type', 'submit');
    completed.setAttribute('value', 'Order Completed!')
    completed.setAttribute('class', 'completed')
    completed.addEventListener('click', startTimer);
    order.appendChild(completed);
    orderList.appendChild(order); 
}

var createOrder = function() {
    var coffeeOrder = document.querySelector('[name="coffee"]');
    var emailInput = document.querySelector('[name="emailAddress"]');
    var size = document.querySelector('[name="size"]:checked');
    var flavorShot = document.querySelector('[name="flavor"]');
    var caffeineRating = document.querySelector('[name="strength"]');
    var orderContent = {
        coffee: coffeeOrder.value,
        emailAddress: emailInput.value,
        size: size.value, 
        flavor: flavorShot.value,
        strength: caffeineRating.value, 
    }
    orderListArray.push(orderContent);
    addStoredOrders(orderContent);
    $.post(url, orderContent);
}

var handleSubmit = function(event) {
    event.preventDefault();
    createOrder();
}

coffeeOrderForm.addEventListener('submit', handleSubmit);