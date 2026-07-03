async function main() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
main();
