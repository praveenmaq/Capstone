// Test script to check admin API endpoints
const backendURL = "http://localhost:5252";

// Mock token for testing (you'll need to replace with actual admin token)
const getToken = () => localStorage.getItem("userToken") || "";

// Test fetch categories
async function testFetchCategories() {
    try {
        const response = await fetch(`${backendURL}/api/Products/categories`);
        console.log('Categories Response Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Categories Data:', data);
        } else {
            console.error('Categories Error:', await response.text());
        }
    } catch (error) {
        console.error('Categories Fetch Error:', error);
    }
}

// Test fetch products
async function testFetchProducts() {
    try {
        const response = await fetch(`${backendURL}/api/Products`);
        console.log('Products Response Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Products Data:', data);
        } else {
            console.error('Products Error:', await response.text());
        }
    } catch (error) {
        console.error('Products Fetch Error:', error);
    }
}

// Test image upload (requires admin token)
async function testImageUpload() {
    const token = getToken();
    if (!token) {
        console.log('No token found - cannot test image upload');
        return;
    }

    // Create a small test file
    const formData = new FormData();
    const blob = new Blob(['test'], { type: 'image/jpeg' });
    formData.append('File', blob, 'test.jpg');

    try {
        const response = await fetch(`${backendURL}/api/UploadImage/upload`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Image Upload Response Status:', response.status);
        if (response.ok) {
            const data = await response.text();
            console.log('Image Upload Data:', data);
        } else {
            console.error('Image Upload Error:', await response.text());
        }
    } catch (error) {
        console.error('Image Upload Fetch Error:', error);
    }
}

// Run tests
console.log('Testing Admin API endpoints...');
testFetchCategories();
testFetchProducts();
testImageUpload();
