      // Global variables
let currentMenu = '';
let currentPrice = 0;
let cart = JSON.parse(localStorage.getItem('dimsumCart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCartItems();
    
    // Set first payment method as active by default
    selectPaymentMethod('cash');
    
    // Close modal when clicking outside
    document.getElementById('orderModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeOrderModal();
        }
    });
    
    // Prevent form submission
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
    });
    
    // Phone number input validation
    document.getElementById('customerPhone').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Load cart from localStorage
    loadCart();
});

// Cart functions
function loadCart() {
    const savedCart = localStorage.getItem('dimsumCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        renderCartItems();
    }
}

function saveCart() {
    localStorage.setItem('dimsumCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang Anda kosong</p>';
        cartTotalAmount.textContent = 'Rp 0';
        return;
    }
    
    let itemsHTML = '';
    let totalAmount = 0;
    
    cart.forEach((item, index) => {
        totalAmount += item.price * item.quantity;
        
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</p>
                    <div class="cart-item-actions">
                        <button onclick="decreaseQuantity(${index})"><i class="fas fa-minus"></i></button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})"><i class="fas fa-plus"></i></button>
                        <button class="cart-item-remove" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    cartTotalAmount.textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;
}

function addToCart(name, price, image) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Increase quantity if item exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    saveCart();
    renderCartItems();
    
    // Show notification
    showNotification(`${name} telah ditambahkan ke keranjang`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    renderCartItems();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
    }
    saveCart();
    renderCartItems();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Checkout from cart
function checkoutFromCart() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong');
        return;
    }
    
    // Open order modal with cart items
    openCartOrderModal();
}

function openCartOrderModal() {
    // Calculate total quantity and price
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update modal title
    document.getElementById('modalMenuTitle').textContent = `Pesan ${cart.length} Item`;
    
    // Update order summary with cart items
    let menuList = '';
    cart.forEach(item => {
        menuList += `${item.name} (${item.quantity} paket), `;
    });
    menuList = menuList.slice(0, -2); // Remove trailing comma
    
    document.getElementById('summaryMenu').textContent = menuList;
    document.getElementById('summaryQuantity').textContent = `${totalQuantity} Paket`;
    document.getElementById('summaryTotal').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    
    // Reset form
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('orderNotes').value = '';
    
    // Show modal
    document.getElementById('orderModal').classList.add('active');
    
    // Set first payment method as active
    selectPaymentMethod('cash');
}

// Order modal functions
function openOrderModal(menuName, price) {
    currentMenu = menuName;
    currentPrice = price;
    
    // Update modal title
    document.getElementById('modalMenuTitle').textContent = `Pesan ${menuName}`;
    
    // Update order summary
    document.getElementById('summaryMenu').textContent = menuName;
    document.getElementById('summaryTotal').textContent = `Rp ${price.toLocaleString('id-ID')}`;
    
    // Reset form
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('orderNotes').value = '';
    
    // Show modal
    document.getElementById('orderModal').classList.add('active');
    
    // Set first payment method as active
    selectPaymentMethod('cash');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

function toggleDeliveryAddress(show) {
    const addressGroup = document.getElementById('addressGroup');
    const addressField = document.getElementById('deliveryAddress');
    const cashPaymentMethod = document.getElementById('cashPaymentMethod');
    
    if (show) {
        // Untuk pengiriman "Diantar"
        addressGroup.classList.remove('hidden');
        addressField.required = true;
        cashPaymentMethod.style.display = 'none'; // Sembunyikan metode tunai
        
        // Otomatis pilih transfer jika tunai tersembunyi
        if (document.querySelector('.payment-method.active input').value === 'cash') {
            selectPaymentMethod('transfer');
        }
    } else {
        // Untuk pengiriman "Ambil Sendiri"
        addressGroup.classList.add('hidden');
        addressField.required = false;
        cashPaymentMethod.style.display = 'flex'; // Tampilkan kembali metode tunai
        cashPaymentMethod.querySelector('span').textContent = 'Bayar di Tempat';
    }
}

function selectPaymentMethod(method) {
    // Remove active class from all payment methods
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('active');
    });
    
    // Add active class to selected method
    const selectedMethod = document.querySelector(`.payment-method[onclick="selectPaymentMethod('${method}')"]`);
    if (selectedMethod) {
        selectedMethod.classList.add('active');
    }
    
    // Update payment method in summary
    let paymentText = '';
    switch(method) {
        case 'qris': paymentText = 'QRIS'; break;
        case 'cash': 
            paymentText = document.querySelector('input[name="deliveryMethod"]:checked').value === 'Diantar' 
                ? 'Tunai' 
                : 'Bayar di Tempat'; 
            break;
        case 'transfer': paymentText = 'Transfer Bank'; break;
    }
    
    document.getElementById('summaryPayment').textContent = paymentText;
    
    // Show/hide payment proof section
    const paymentProofGroup = document.getElementById('paymentProofGroup');
    const qrisSection = document.getElementById('qrisSection');
    
    if (method === 'transfer' || method === 'qris') {
        paymentProofGroup.classList.remove('hidden');
        if (method === 'qris') {
            qrisSection.classList.remove('hidden');
        } else {
            qrisSection.classList.add('hidden');
        }
    } else {
        paymentProofGroup.classList.add('hidden');
        qrisSection.classList.add('hidden');
    }
}

function updateOrderSummary() {
    const quantity = document.getElementById('quantity').value;
    const spicyLevel = document.querySelector('input[name="spicyLevel"]:checked').value;
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    
    // Calculate total price
    let totalPrice;
    if (currentMenu) {
        // Single item order
        totalPrice = quantity * currentPrice;
    } else {
        // Cart order
        totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Update summary
    document.getElementById('summaryQuantity').textContent = `${quantity} Paket`;
    document.getElementById('summarySpice').textContent = spicyLevel;
    document.getElementById('summaryDelivery').textContent = deliveryMethod;
    document.getElementById('summaryTotal').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

function submitOrder() {
    // Get form values
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const quantity = document.getElementById('quantity').value;
    const spicyLevel = document.querySelector('input[name="spicyLevel"]:checked').value;
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const address = deliveryMethod === 'Diantar' ? document.getElementById('deliveryAddress').value : 'Ambil Sendiri';
    const notes = document.getElementById('orderNotes').value;
    const paymentMethod = document.querySelector('.payment-method.active input').value;
    const paymentProof = document.getElementById('paymentProof').files[0];
    
    // Validate form
    if (!name || !phone) {
        alert('Harap isi nama dan nomor WhatsApp Anda');
        return;
    }
    
    if (deliveryMethod === 'Diantar' && !address) {
        alert('Harap isi alamat pengiriman');
        return;
    }
    
    // Format WhatsApp message
    let message;
    
    if (currentMenu) {
        // Single item order
        const totalPrice = quantity * currentPrice;
        
        message = `Halo, saya ingin memesan:
        
🍽 *Menu*: ${currentMenu}
🔢 *Jumlah*: ${quantity} Paket (isi ${quantity * 4})
🌶 *Level Pedas*: ${spicyLevel}
🚚 *Pengiriman*: ${deliveryMethod}
🏠 *Alamat*: ${address}
📝 *Catatan*: ${notes || '-'}
💳 *Pembayaran*: ${paymentMethod === 'cash' ? (deliveryMethod === 'Diantar' ? 'Tunai' : 'Bayar di Tempat') : paymentMethod}
💰 *Total*: Rp ${totalPrice.toLocaleString('id-ID')}

*Data Pemesan*:
👤 Nama: ${name}
📱 WhatsApp: ${phone}`;
    } else {
        // Cart order
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        let menuList = '';
        cart.forEach(item => {
            menuList += `- ${item.name} (${item.quantity} paket)\n`;
        });
        
        message = `Halo, saya ingin memesan beberapa menu:
        
📋 *Daftar Pesanan*:
${menuList}
🌶 *Level Pedas*: ${spicyLevel}
🚚 *Pengiriman*: ${deliveryMethod}
🏠 *Alamat*: ${address}
📝 *Catatan*: ${notes || '-'}
💳 *Pembayaran*: ${paymentMethod === 'cash' ? (deliveryMethod === 'Diantar' ? 'Tunai' : 'Bayar di Tempat') : paymentMethod}
💰 *Total*: Rp ${totalPrice.toLocaleString('id-ID')}

*Data Pemesan*:
👤 Nama: ${name}
📱 WhatsApp: ${phone}`;
        
        // Clear cart after order
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
    }
    
    // Add payment proof note if needed
if ((paymentMethod === 'transfer' || paymentMethod === 'qris') && paymentProof) {
    message += "\n\n📷 Bukti transfer akan dikirim di chat terpisah";
    alert("Silakan kirim bukti transfer di chat WhatsApp setelah mengirim pesan");
}
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/6285213963005?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Close modal
    closeOrderModal();
}