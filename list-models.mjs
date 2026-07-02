async function main() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  let url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=100`;
  const models = [];
  while(url) {
    const res = await fetch(url);
    const data = await res.json();
    if(data.models) models.push(...data.models.map(m => m.name));
    if(data.nextPageToken) {
      url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageToken=${data.nextPageToken}&pageSize=100`;
    } else {
      url = null;
    }
  }
  console.log(models.join('\n'));
}
main();
