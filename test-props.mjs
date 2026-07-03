import { generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';

async function main() {
  const result = streamText({
    model: google('gemini-2.5-flash'),
    prompt: 'hello'
  });
  let props = new Set();
  let obj = result;
  do {
    Object.getOwnPropertyNames(obj).forEach(p => props.add(p));
  } while (obj = Object.getPrototypeOf(obj));
  console.log(Array.from(props));
}
main();
