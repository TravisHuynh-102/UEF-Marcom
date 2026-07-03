import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

async function main() {
  const result = streamText({
    model: google('gemini-2.5-flash'),
    prompt: 'hello'
  });
  const res = result.toUIMessageStreamResponse();
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let firstChunk = true;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    if (firstChunk) {
      console.log('Sample chunk:', chunk);
      firstChunk = false;
    }
  }
}
main();
