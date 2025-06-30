// Quick test to check if admin user is logged in and has the right token
const backendURL = 'http://localhost:5252';

function getToken() {
    return localStorage.getItem('token');
}

async function testAdminAuth() {
    const token = getToken();
    console.log('Current token:', token);

    if (!token) {
        console.log('No token found. Please login first.');
        return;
    }

    // Decode token to see claims (just for debugging)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('User role:', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
        console.log('User ID:', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
    } catch (e) {
        console.log('Error decoding token:', e);
    }

    // Test admin endpoint
    try {
        const response = await fetch(`${backendURL}/api/Products/categories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Categories endpoint response status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Categories data:', data);
        } else {
            const errorText = await response.text();
            console.log('Categories error:', errorText);
        }
    } catch (error) {
        console.log('Categories request error:', error);
    }

    // Test add product endpoint with dummy data
    try {
        const testProduct = {
            name: "Test Product",
            description: "Test Description",
            price: 99.99,
            imageUrl: "https://example.com/test.jpg",
            categoryId: 1,
            brand: "Test Brand",
            stockQuantity: 10
        };

        const response = await fetch(`${backendURL}/api/Products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testProduct)
        });

        console.log('Add product response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Add product error:', errorText);
        } else {
            const data = await response.json();
            console.log('Add product success:', data);
        }
    } catch (error) {
        console.log('Add product request error:', error);
    }
}

testAdminAuth();
