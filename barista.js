document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    setInterval(loadOrders, 5000); // Auto-refresh every 5 seconds
});

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    updateStats(pendingOrders, completedOrders, orders);
    displayOrders(pendingOrders);
}

function updateStats(pendingOrders, completedOrders, allOrders) {
    document.getElementById('pendingCount').textContent = pendingOrders.length;
    document.getElementById('completedCount').textContent = completedOrders.length;
    
    const totalRevenue = allOrders.reduce((sum, order) => {
        return order.status === 'completed' ? sum + order.totalPrice : sum;
    }, 0);
    
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No pending orders at the moment</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        container.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const orderDate = new Date(order.orderTime);
    const timeString = orderDate.toLocaleTimeString();
    
    card.innerHTML = `
        <div class="order-header">
            <div class="order-id">Order #${order.orderId}</div>
            <div class="order-time">${timeString}</div>
        </div>
        
        <div class="order-details">
            <div class="detail-item">
                <div class="detail-label">Customer</div>
                <div class="detail-value">${order.customerName}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Coffee Type</div>
                <div class="detail-value">${order.coffeeType}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Size</div>
                <div class="detail-value">${order.size}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${order.quantity}</div>
            </div>
        </div>
        
        ${order.extras ? `
            <div class="order-extras">
                <strong>Extras:</strong> ${order.extras}
            </div>
        ` : ''}
        
        <div class="order-price">Total: $${order.totalPrice.toFixed(2)}</div>
        
        <button class="btn-done" onclick="completeOrder(${order.orderId})">
            ✓ DONE
        </button>
    `;
    
    return card;
}

function completeOrder(orderId) {
    const baristaName = document.getElementById('baristaName').value.trim();
    
    if (!baristaName) {
        alert('Please enter your name before completing orders');
        document.getElementById('baristaName').focus();
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'completed';
        orders[orderIndex].completedTime = new Date().toISOString();
        orders[orderIndex].baristaName = baristaName;
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        loadOrders();
        
        showNotification(`Order #${orderId} completed!`);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);