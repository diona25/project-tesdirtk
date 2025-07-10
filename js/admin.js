// Toggle functionality with proper event handling
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const toggler = document.querySelector('.navbar-toggler');
    const overlay = document.querySelector('.overlay');

    // Toggle sidebar with overlay show sidebar
    toggler.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    });

    // Close sidebar when clicking outside
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
        }
    });

    // Navigation handling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('d-none');
            });
            
            // Add active class to clicked link and show section
            this.classList.add('active');
            document.querySelector(targetId).classList.remove('d-none');
        });
    });

    // Initialize charts
    const initializeCharts = () => {
        // Remove duplicate chart initializations
        new Chart(document.getElementById('orderPieChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Completed', 'Pending', 'Canceled'],
                datasets: [{
                    data: [65, 18, 6],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                }]
            }
        });

        new Chart(document.getElementById('revenueChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 3000, 5000, 2000, 3000],
                    backgroundColor: '#8B0000'
                }]
            }
        });

        new Chart(document.getElementById('salesChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Orders',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: '#8B0000',
                    backgroundColor: 'rgba(139, 0, 0, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    };

    // Initialize charts after DOM load
    initializeCharts();
});


// Client Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Products from productE page
    const clients = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            status: 'active',
            profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '987-654-3210',
            status: 'active',
            profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            phone: '555-123-4567',
            status: 'pending',
            profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg'
        }
    ];
    let currentClientId = null;
    const clientModal = new bootstrap.Modal('#clientModal');

    // Add Client Button
    document.getElementById('addClientBtn').addEventListener('click', () => {
        currentClientId = null;
        document.getElementById('clientForm').reset();
        clientModal.show();
    });

    // Form Submission
    document.getElementById('clientForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const clientData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            status: formData.get('status')
        };
        
        // Handle profile picture
        const profilePictureInput = document.querySelector('input[name="profilePicture"]');
        if (profilePictureInput.files.length > 0) {
            const file = profilePictureInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                clientData.profilePicture = e.target.result;
                saveClient(clientData);
            };
            reader.readAsDataURL(file);
        } else {
            // If no new picture is uploaded, keep the existing one for edits
            if (currentClientId) {
                const existingClient = clients.find(c => c.id === currentClientId);
                clientData.profilePicture = existingClient ? existingClient.profilePicture : 'https://via.placeholder.com/50';
            } else {
                clientData.profilePicture = 'https://via.placeholder.com/50';
            }
            saveClient(clientData);
        }
    });

    function saveClient(clientData) {
        if (currentClientId !== null) {
            // Update existing client
            const index = clients.findIndex(c => c.id === currentClientId);
            clients[index] = {...clientData, id: currentClientId};
        } else {
            // Add new client
            clients.push({
                ...clientData,
                id: Date.now().toString()
            });
        }

        clientModal.hide();
        renderClientList();
    }

    // Preview profile picture
    document.querySelector('input[name="profilePicture"]').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewContainer = document.querySelector('.preview-container');
                const previewImg = document.getElementById('profilePreview');
                previewImg.src = e.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Render Client List
    function renderClientList() {
        const tbody = document.getElementById('clientList');
        tbody.innerHTML = clients.map(client => `
            <tr>
                <td data-label="Profile">
                    <img src="${client.profilePicture || 'https://via.placeholder.com/50'}" 
                         alt="${client.name}'s profile" 
                         class="client-profile">
                </td>
                <td data-label="Name">${client.name}</td>
                <td data-label="Email">${client.email}</td>
                <td data-label="Phone">${client.phone || 'N/A'}</td>
                <td data-label="Status">
                    <span class="client-status ${client.status}">${client.status}</span>
                </td>
                <td class="actions">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${client.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${client.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentClientId = btn.dataset.id;
                const client = clients.find(c => c.id === currentClientId);
                const form = document.getElementById('clientForm');
                form.name.value = client.name;
                form.email.value = client.email;
                form.phone.value = client.phone;
                form.status.value = client.status;
                clientModal.show();
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this client?')) {
                    const index = clients.findIndex(c => c.id === btn.dataset.id);
                    clients.splice(index, 1);
                    renderClientList();
                }
            });
        });
    }

    // Initial render
    renderClientList();
});
// Collections Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Products from productE page
    const products = [
        {
            id: 'chawi1',
            name: 'Malhfa chaoui',
            description: 'malhfa from the Chaoui Region',
            price: 100,
            category: 'chawi',
            image: '../Images/chawi1.jpg',
            status: 'active',
            stock: 25
        },
        {
            id: 'chawi2',
            name: 'malhfa chaoui',
            description: 'A Chaoui malhfa with unique eleganc',
            price: 210,
            category: 'chawi',
            image: '../Images/chawi2.jpg',
            status: 'active',
            stock: 18
        },
        {
            id: 'chawi3',
            name: 'malhfa chwaoui',
            description: 'A Chaoui with unique eleganc',
            price: 260,
            category: 'chawi',
            image: '../Images/chawi3.jpg',
            status: 'active',
            stock: 12
        },
        {
            id: 'chawi4',
            name: 'malhfa chaoui',
            description: 'A stunning and stylish dress for all occasions',
            price: 155,
            category: 'chawi',
            image: '../Images/chawi4.jpg',
            status: 'active',
            stock: 30
        },
        {
            id: 'assimi1',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou elegance',
            price: 200,
            category: 'assimi',
            image: '../Images/assimi1.jpg',
            status: 'active',
            stock: 15
        },
        {
            id: 'assimi2',
            name: 'Traditional Karakou',
            description: 'Karakou with luxurious embroidery',
            price: 130,
            category: 'assimi',
            image: '../Images/assimi2.jpg',
            status: 'active',
            stock: 22
        },
        {
            id: 'assimi3',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou elegance',
            price: 310,
            category: 'assimi',
            image: '../Images/assimi3.jpg',
            status: 'active',
            stock: 8
        },
        {
            id: 'assimi4',
            name: 'Traditional Karakou',
            description: 'Karakou with timeless elegance',
            price: 120,
            category: 'assimi',
            image: '../Images/assimi4.jpg',
            status: 'active',
            stock: 20
        },
        {
            id: 'jdid1',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou with a royal design',
            price: 145,
            category: 'melhfa',
            image: '../Images/jdid1.jpg',
            status: 'active',
            stock: 28
        },
        {
            id: 'jdid2',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou with a royal design',
            price: 235,
            category: 'melhfa',
            image: '../Images/jdid2.jpg',
            status: 'active',
            stock: 14
        },
        {
            id: 'jdid3',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou with a royal design',
            price: 145,
            category: 'melhfa',
            image: '../Images/jdid3.jpg',
            status: 'active',
            stock: 19
        },
        {
            id: 'jdid4',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou with a royal design',
            price: 180,
            category: 'melhfa',
            image: '../Images/jdid4.jpg',
            status: 'active',
            stock: 10
        },
        {
            id: 'constantine1',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou with a royal design',
            price: 220,
            category: 'constantinois',
            image: '../Images/constantine1.jpg',
            status: 'active',
            stock: 16
        },
        {
            id: 'constantine2',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou with a royal design',
            price: 190,
            category: 'constantinois',
            image: '../Images/constantine2.jpg',
            status: 'active',
            stock: 24
        },
        {
            id: 'constantine3',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou with a royal design',
            price: 280,
            category: 'constantinois',
            image: '../Images/constantine3.jpg',
            status: 'active',
            stock: 11
        },
        {
            id: 'constantine4',
            name: 'Traditional Karakou',
            description: 'A traditional Karakou with a royal design',
            price: 165,
            category: 'constantinois',
            image: '../Images/constantine4.jpg',
            status: 'active',
            stock: 17
        }
    ];

    // Collections Management
    const collectionModal = new bootstrap.Modal('#collectionModal');
    let currentCollectionId = null;

    document.getElementById('addCollectionBtn').addEventListener('click', () => {
        currentCollectionId = null;
        document.getElementById('collectionForm').reset();
        collectionModal.show();
    });

    document.getElementById('collectionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const collectionData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            status: formData.get('status')
        };

        const imageInput = document.querySelector('input[name="collectionImage"]');
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                collectionData.image = e.target.result;
                saveCollection(collectionData);
            };
            reader.readAsDataURL(file);
        } else {
            if (currentCollectionId) {
                const existingCollection = products.find(c => c.id === currentCollectionId);
                collectionData.image = existingCollection ? existingCollection.image : 'https://via.placeholder.com/150';
            } else {
                collectionData.image = 'https://via.placeholder.com/150';
            }
            saveCollection(collectionData);
        }
    });

    function saveCollection(collectionData) {
        if (currentCollectionId) {
            const index = products.findIndex(c => c.id === currentCollectionId);
            products[index] = { ...collectionData, id: currentCollectionId };
        } else {
            products.push({
                ...collectionData,
                id: Date.now().toString()
            });
        }
        collectionModal.hide();
        renderCollections();
    }

    function renderCollections() {
        const tbody = document.getElementById('collectionList');
        tbody.innerHTML = products.map(product => `
            <tr>
                <td data-label="Image">
                    <img src="${product.image}" alt="${product.name}" class="collection-image">
                </td>
                <td data-label="Name">${product.name}</td>
                <td data-label="Category">${product.category}</td>
                <td data-label="Price">$${product.price.toFixed(2)}</td>
                <td data-label="Stock">${product.stock || 0}</td>
                <td data-label="Status">
                    <span class="order-status ${product.status}">${product.status}</span>
                </td>
                <td class="actions">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary edit-collection-btn" data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-collection-btn" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners for collection actions
        document.querySelectorAll('.edit-collection-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCollectionId = btn.dataset.id;
                const product = products.find(c => c.id === currentCollectionId);
                const form = document.getElementById('collectionForm');
                form.name.value = product.name;
                form.category.value = product.category;
                form.price.value = product.price;
                form.stock.value = product.stock || 0;
                form.status.value = product.status;
                collectionModal.show();
            });
        });

        document.querySelectorAll('.delete-collection-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this product?')) {
                    const index = products.findIndex(c => c.id === btn.dataset.id);
                    products.splice(index, 1);
                    renderCollections();
                }
            });
        });
    }

    // Initial render
    renderCollections();
});

// Orders Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Sample orders data
    const orders = [
        {
            id: 'ORD001',
            customer: 'Aisha Khan',
            items: [
                { name: 'Malhfa chaoui', price: 100, quantity: 2 },
                { name: 'Traditional Karakou', price: 200, quantity: 1 }
            ],
            total: 400,
            date: '2024-03-15',
            status: 'completed'
        },
        {
            id: 'ORD002',
            customer: 'Fatima Ahmed',
            items: [
                { name: 'Traditional Karakou', price: 310, quantity: 1 },
                { name: 'malhfa chaoui', price: 210, quantity: 1 }
            ],
            total: 520,
            date: '2024-03-14',
            status: 'pending'
        },
        {
            id: 'ORD003',
            customer: 'Zainab Ali',
            items: [
                { name: 'Traditional Karakou', price: 220, quantity: 1 }
            ],
            total: 220,
            date: '2024-03-13',
            status: 'processing'
        },
        {
            id: 'ORD004',
            customer: 'Mariam Hassan',
            items: [
                { name: 'Traditional Karakou', price: 280, quantity: 1 },
                { name: 'malhfa chaoui', price: 260, quantity: 1 }
            ],
            total: 540,
            date: '2024-03-12',
            status: 'canceled'
        }
    ];

    // Orders Management
    const orderModal = new bootstrap.Modal('#orderModal');
    let currentOrderId = null;

    // Filter buttons
    document.getElementById('filterAll').addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('filterAll').classList.add('active');
        renderOrders();
    });

    document.getElementById('filterCompleted').addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('filterCompleted').classList.add('active');
        renderOrders('completed');
    });

    document.getElementById('filterPending').addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('filterPending').classList.add('active');
        renderOrders('pending');
    });

    document.getElementById('filterCanceled').addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('filterCanceled').classList.add('active');
        renderOrders('canceled');
    });

    // Update order status
    document.getElementById('updateOrderStatus').addEventListener('click', () => {
        if (currentOrderId) {
            const order = orders.find(o => o.id === currentOrderId);
            const newStatus = document.getElementById('orderStatus').value;
            order.status = newStatus;
            renderOrders();
            orderModal.hide();
        }
    });

    function renderOrders(filterStatus = null) {
        const tbody = document.getElementById('orderList');
        const filteredOrders = filterStatus ? orders.filter(o => o.status === filterStatus) : orders;
        
        tbody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td data-label="Order ID">${order.id}</td>
                <td data-label="Customer">${order.customer}</td>
                <td data-label="Items">${order.items.length} items</td>
                <td data-label="Total">$${order.total.toFixed(2)}</td>
                <td data-label="Date">${order.date}</td>
                <td data-label="Status">
                    <span class="order-status ${order.status}">${order.status}</span>
                </td>
                <td class="actions">
                    <button class="btn btn-sm btn-outline-primary view-order-btn" data-id="${order.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners to view buttons
        document.querySelectorAll('.view-order-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentOrderId = btn.dataset.id;
                const order = orders.find(o => o.id === currentOrderId);
                
                // Update modal content
                document.getElementById('customerInfo').innerHTML = `
                    <p><strong>Name:</strong> ${order.customer}</p>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                `;

                document.getElementById('orderItems').innerHTML = order.items.map(item => `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">Quantity: ${item.quantity}</small>
                        </div>
                        <div>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                `).join('');

                document.getElementById('orderStatus').value = order.status;
                orderModal.show();
            });
        });
    }

    // Initial render
    renderOrders();
});
// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const navbarToggler = document.querySelector('.navbar-toggler');

    navbarToggler.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    });

    // Navigation Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('d-none');
            });

            // Show selected section
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) {
                targetSection.classList.remove('d-none');
            }

            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
            }
        });
    });
});
// Messages Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const messages = [
        {
            id: 'MSG001',
            name: 'Sarah Benali',
            email: 'sarah@example.com',
            subject: 'Order Inquiry',
            message: 'I would like to know about the delivery time for my order. I placed it last week and haven\'t received any updates yet.',
            date: '2024-03-15',
            status: 'unread'
        },
        {
            id: 'MSG002',
            name: 'Yasmine Bouaziz',
            email: 'yasmine@example.com',
            subject: 'Product Availability',
            message: 'Is the Traditional Karakou in size M available? I would like to purchase it for an upcoming event.',
            date: '2024-03-14',
            status: 'read'
        },
        {
            id: 'MSG003',
            name: 'Fatima Ahmed',
            email: 'fatima@example.com',
            subject: 'Custom Order Request',
            message: 'I\'m interested in a custom-made Malhfa. Could you please provide information about your customization services?',
            date: '2024-03-13',
            status: 'unread'
        },
        {
            id: 'MSG004',
            name: 'Amina Khan',
            email: 'amina@example.com',
            subject: 'Store Visit',
            message: 'I would like to visit your store to try on some items. What are your business hours?',
            date: '2024-03-12',
            status: 'read'
        }
    ];

    const messageModal = new bootstrap.Modal('#messageModal');

    // Message Filter Buttons
    document.getElementById('filterAllMessages').addEventListener('click', () => {
        document.querySelectorAll('.filter-message-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('filterAllMessages').classList.add('active');
        renderMessages();
    });

    document.getElementById('filterUnreadMessages').addEventListener('click', () => {
        document.querySelectorAll('.filter-message-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('filterUnreadMessages').classList.add('active');
        renderMessages('unread');
    });

    document.getElementById('filterReadMessages').addEventListener('click', () => {
        document.querySelectorAll('.filter-message-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('filterReadMessages').classList.add('active');
        renderMessages('read');
    });

    function renderMessages(filterStatus = null) {
        const tbody = document.getElementById('messageList');
        const filteredMessages = filterStatus ? messages.filter(m => m.status === filterStatus) : messages;
        
        tbody.innerHTML = filteredMessages.map(msg => `
            <tr>
                <td data-label="Name">${msg.name}</td>
                <td data-label="Email">${msg.email}</td>
                <td data-label="Subject">${msg.subject}</td>
                <td data-label="Message" class="message-preview">${msg.message}</td>
                <td data-label="Date">${msg.date}</td>
                <td data-label="Status">
                    <span class="badge ${msg.status === 'unread' ? 'bg-primary' : 'bg-secondary'}">${msg.status}</span>
                </td>
                <td class="actions">
                    <button class="btn btn-sm btn-outline-primary view-message-btn" data-id="${msg.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.view-message-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = messages.find(m => m.id === btn.dataset.id);
                document.getElementById('messageDetails').innerHTML = `
                    <div class="mb-3">
                        <p><strong>From:</strong> ${message.name} (${message.email})</p>
                        <p><strong>Subject:</strong> ${message.subject}</p>
                        <p><strong>Date:</strong> ${message.date}</p>
                    </div>
                    <div class="message-content p-3 bg-light rounded">
                        <p>${message.message}</p>
                    </div>
                `;
                message.status = 'read';
                messageModal.show();
                renderMessages();
            });
        });
    }

    // Settings Form Submission
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const settings = Object.fromEntries(formData.entries());
        
        // Here you would typically save the settings to your backend
        alert('Settings saved successfully!');
        
        // Update the UI to reflect the changes
        const storeName = document.querySelector('input[name="storeName"]').value;
        document.querySelector('.logo').textContent = storeName;
    });

    // Initial render
    renderMessages();
});