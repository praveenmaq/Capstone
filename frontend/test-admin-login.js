// Admin Login Test Script - Run this in browser console
const backendURL = "http://localhost:5252";

async function testAdminLogin() {
    try {
        console.log("Testing admin login...");

        const response = await fetch(`${backendURL}/api/Auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "admin@admin.com",
                password: "admin123"
            }),
        });

        console.log("Login response status:", response.status);

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);

            // Store the token
            localStorage.setItem("userToken", data.userToken);
            localStorage.setItem("userInfo", JSON.stringify(data.userDetail));

            console.log("Token stored. User role:", data.userDetail.role);
            return data;
        } else {
            const error = await response.text();
            console.error("Login failed:", error);
        }
    } catch (error) {
        console.error("Login error:", error);
    }
}

// Test image upload after login
async function testImageUpload() {
    const token = localStorage.getItem("userToken");
    if (!token) {
        console.log("No token found. Please login first.");
        return;
    }

    console.log("Testing image upload with token...");

    // Create a small test blob as image
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);

    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("File", blob, "test.png");

        try {
            const response = await fetch(`${backendURL}/api/UploadImage/upload`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Image upload response status:", response.status);

            if (response.ok) {
                const imageUrl = await response.text();
                console.log("Image upload successful:", imageUrl);
            } else {
                const error = await response.text();
                console.error("Image upload failed:", error);
            }
        } catch (error) {
            console.error("Image upload error:", error);
        }
    }, 'image/png');
}

// Run the tests
console.log("=== Admin Functionality Test ===");
console.log("1. Run: testAdminLogin()");
console.log("2. Then run: testImageUpload()");

// Make functions available globally
window.testAdminLogin = testAdminLogin;
window.testImageUpload = testImageUpload;
