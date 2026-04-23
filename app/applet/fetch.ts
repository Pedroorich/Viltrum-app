import https from 'https';

const url = "https://shopee.com.br/Massa-Corrida-PVA-1kg-Maxincor-Parede-e-Teto-i.1229829549.21199760475";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const images = data.match(/https:\/\/cf\.shopee\.com\.br\/file\/[A-Za-z0-9_]+/g);
    console.log(images ? images.slice(0, 5) : "no images");
  });
}).on('error', err => console.log(err));
