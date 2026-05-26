async function test() {
  try {
    const res = await fetch("https://api.englishom.com/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "superadmin@englishom.com",
        password: "Admin@2026!"
      })
    });
    
    const data = await res.json();
    console.log("Status:", res.status);
    console.log(data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

test();
