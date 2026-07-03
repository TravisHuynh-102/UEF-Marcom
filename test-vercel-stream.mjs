async function main() {
  try {
    const res = await fetch('https://uef-marcom.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
    });
    console.log('Status:', res.status);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      console.log('Chunk:', decoder.decode(value));
    }
  } catch (e) {
    console.error(e);
  }
}
main();
