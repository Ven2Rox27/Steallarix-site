async function test() {
  const res = await fetch('https://kitsu.io/api/edge/anime/1555/episodes?page[limit]=20&page[offset]=0', {
    headers: { 'Accept': 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json', 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Episode count returned:', data.data?.length);
  const ep = data.data?.[0];
  console.log('Episode 1:', {
    id: ep?.id,
    number: ep?.attributes?.number,
    title: ep?.attributes?.canonicalTitle,
    synopsis: ep?.attributes?.synopsis?.slice(0, 50),
    thumbnail: ep?.attributes?.thumbnail?.original
  });
}

test().catch(console.error);
