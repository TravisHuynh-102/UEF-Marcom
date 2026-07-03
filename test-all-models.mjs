async function main() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const models = [
    "gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", 
    "gemini-pro-latest", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite", "gemini-2.0-flash-lite-001"
  ];
  
  for (const m of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
      });
      const data = await res.json();
      if (data.error) {
        console.log(`❌ ${m}: ${data.error.message}`);
      } else {
        console.log(`✅ ${m}: SUCCESS!`);
      }
    } catch (e) {
      console.log(`❌ ${m}: ${e.message}`);
    }
  }
}
main();
