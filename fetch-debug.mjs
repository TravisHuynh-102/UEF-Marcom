async function main() {
  const res = await fetch('https://uef-marcom.vercel.app/api/debug');
  console.log(await res.text());
}
main();
