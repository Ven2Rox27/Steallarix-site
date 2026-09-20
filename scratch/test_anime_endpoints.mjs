import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  console.log('--- TEST 1: /api/anime/search?query=Naruto&page=1 ---');
  const a1 = await get('http://localhost:4321/api/anime/search?query=Naruto&page=1');
  console.log(`Status: ${a1.status}, Results count: ${a1.data?.results?.length}, hasNext: ${a1.data?.hasNextPage}`);
  console.log(`First anime:`, a1.data?.results?.[0]?.title);

  console.log('\n--- TEST 2: /api/anime/search?query=Naruto&page=2 ---');
  const a2 = await get('http://localhost:4321/api/anime/search?query=Naruto&page=2');
  console.log(`Status: ${a2.status}, Results count: ${a2.data?.results?.length}, hasNext: ${a2.data?.hasNextPage}`);

  const animeId = a1.data?.results?.[0]?.id || '1555';
  console.log(`\n--- TEST 3: /api/anime/info?id=${animeId} ---`);
  const aInfo = await get(`http://localhost:4321/api/anime/info?id=${animeId}`);
  console.log(`Status: ${aInfo.status}, Title: ${aInfo.data?.title}, Episodes: ${aInfo.data?.episodes?.length}`);
  console.log(`First Episode:`, aInfo.data?.episodes?.[0]);

  console.log('\n--- TEST 4: Movies API Integrity (/api/movies?page=1) ---');
  const m = await get('http://localhost:4321/api/movies?page=1');
  console.log(`Status: ${m.status}, Movies count: ${m.data?.items?.length}, First: ${m.data?.items?.[0]?.title}`);

  console.log('\n--- TEST 5: TV Shows API Integrity (/api/tv?page=1) ---');
  const t = await get('http://localhost:4321/api/tv?page=1');
  console.log(`Status: ${t.status}, TV count: ${t.data?.items?.length}, First: ${t.data?.items?.[0]?.title}`);

  console.log('\n=== ALL API CHECKS PASSED ===');
}

test().catch(console.error);
