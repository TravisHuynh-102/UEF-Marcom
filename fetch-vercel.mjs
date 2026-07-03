async function main() {
  const res = await fetch('https://uef-marcom.vercel.app/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body length:', text.length);
  console.log('Body start:', text.substring(0, 100));
}
main();
