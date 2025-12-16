const coffeeMenu = [
    { name: 'Espresso', price: 3.50 },
    { name: 'Americano', price: 4.00 },
    { name: 'Cappuccino', price: 4.50 },
    { name: 'Latte', price: 4.75 },
    { name: 'Mocha', price: 5.00 },
    { name: 'Macchiato', price: 4.25 }
];

let selectedCoffee = null;
let selectedSize = 'Medium';

function initCoffeeOptions() {
    const container = document.getElementById('coffeeOptions');
    coffeeMenu.forEach((coffee, idx) => {
        const div = document.createElement('div');
        div.className = 'coffee-option';
        if (idx === 2) div.classList.add('selected');
        div.innerHTML = `
            <div class="coffee-name">${coffee.name}</div>
            <div class="coffee-price">$${coffee.price.toFixed(2)}</div>
        `;
        div.onclick = () => selectCoffee(div, coffee);
        container.appendChild(div);
        
        if (idx === 2) selectedCoffee = coffee;
    });
    calculatePrice();
}

function selectCoffee(element, coffee) {
    document.querySelectorAll('.coffee-option').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedCoffee = coffee;
    calculatePrice();
}

document.addEventListener('DOMContentLoaded', function() {
    initCoffeeOptions();
    
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.size-btn').forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
            calculatePrice();
        };
    });
    
    document.querySelectorAll('input[type="checkbox"], #quantity').forEach(el => {
        el.addEventListener('change', calculatePrice);
    });
});

function calculatePrice() {
    if (!selectedCoffee) return;
    
    let price = selectedCoffee.price;
    
    const sizeBtn = document.querySelector('.size-btn.selected');
    if (sizeBtn) {
        price += parseFloat(sizeBtn.dataset.price);
    }
    
    if (document.getElementById('extraShot').checked) price += 0.50;
    if (document.getElementById('whippedCream').checked) price += 0.75;
    if (document.getElementById('vanilla').checked) price += 0.50;
    if (document.getElementById('caramel').checked) price += 0.50;
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    price *= quantity;
    
    document.getElementById('totalPrice').textContent = `$${price.toFixed(2)}`;
}

function placeOrder() {
    const customerName = document.getElementById('customerName').value.trim();
    
    if (!customerName) {
        showError('Please enter your name');
        return;
    }
    
    if (!selectedCoffee) {
        showError('Please select a coffee');
        return;
    }
    
    const extras = [];
    if (document.getElementById('extraShot').checked) extras.push('Extra Shot');
    if (document.getElementById('whippedCream').checked) extras.push('Whipped Cream');
    if (document.getElementById('vanilla').checked) extras.push('Vanilla Syrup');
    if (document.getElementById('caramel').checked) extras.push('Caramel Syrup');
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = parseFloat(document.getElementById('totalPrice').textContent.replace('$', ''));
    
    const order = {
        customerName: customerName,
        coffeeType: selectedCoffee.name,
        size: selectedSize,
        quantity: quantity,
        extras: extras.join(', '),
        totalPrice: totalPrice
    };
    
    // Store in localStorage (simulating backend call)
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    order.orderId = orders.length + 1;
    order.status = 'pending';
    order.orderTime = new Date().toISOString();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    showSuccess(`Order placed successfully! Order #${order.orderId}`);
    
    setTimeout(() => {
        document.getElementById('customerName').value = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.getElementById('quantity').value = 1;
        calculatePrice();
    }, 2000);
}

function showSuccess(msg) {
    const el = document.getElementById('successMsg');
    el.textContent = msg;
    el.style.display = 'block';
    document.getElementById('errorMsg').style.display = 'none';
    setTimeout(() => el.style.display = 'none', 3000);
}

function showError(msg) {
    const el = document.getElementById('errorMsg');
    el.textContent = msg;
    el.style.display = 'block';
    document.getElementById('successMsg').style.display = 'none';
    setTimeout(() => el.style.display = 'none', 3000);
}