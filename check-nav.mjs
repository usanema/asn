const token = 'qdlR2fCcQijD2ksBpX750pUwVZa8X58I';
const url = 'http://srv50.mikr.us:40249';

async function main() {
  const res = await fetch(`${url}/items/navigation?fields=*.*`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  console.log(JSON.stringify(json.data, null, 2));
}

main().catch(console.error);
