import https from 'https';

async function fetchShopeeImage(shortUrl) {
  try {
    const res = await fetch(shortUrl, { redirect: 'follow' });
    const text = await res.text();
    
    // Look for shopee cdn links
    const matches = text.match(/https:\/\/(cf|cvf)\.shopee\.com\.br\/file\/[a-zA-Z0-9_-]+/g);
    if (matches && matches.length > 0) {
      // Return the most frequently occurring or first one
      const unique = [...new Set(matches)];
      return unique.slice(0, 3).join(', ');
    }
    
    const jsonMatch = text.match(/"image":\s*"([^"]+)"/);
    if (jsonMatch) return jsonMatch[1];
    
    return "No image found in text";
  } catch (err) {
    return "Error: " + err.message;
  }
}

async function main() {
  const url = "https://s.shopee.com.br/5q4PzQjwUC";
  const img = await fetchShopeeImage(url);
  console.log(`${url} -> ${img}`);
}

main();
