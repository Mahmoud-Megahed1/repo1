async function test() {
  try {
    const res = await fetch("https://englishom.com/ques/api/trpc/auth.adminLogin?batch=1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "0": {
          "email": "test@test.com",
          "password": "test"
        }
      })
    });
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    console.log("Body:", await res.text());
  } catch(e) {
    console.error(e);
  }
}
test();
