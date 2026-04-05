const axios = require("axios");

async function testRegister() {
  try {
    const res = await axios.post("http://localhost:5001/api/auth/register", {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "student"
    });

    console.log("✅ REGISTER:", res.status, res.data);
  } catch (err) {
    console.log("❌ REGISTER ERROR:", err.response?.data || err.message);
  }
}

async function testLogin() {
  try {
    const res = await axios.post("http://localhost:5001/api/auth/login", {
      email: "test@example.com",   // ⚠️ same email as register
      password: "password123"
    });

    console.log("✅ LOGIN:", res.status, res.data);
  } catch (err) {
    console.log("❌ LOGIN ERROR:", err.response?.data || err.message);
  }
}

// Run step by step
(async () => {
  await testRegister();
  await testLogin();
})();