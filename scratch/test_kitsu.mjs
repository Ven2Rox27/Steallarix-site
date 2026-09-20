async function test() {
  const res = await fetch('https://kitsu.io/api/edge/anime?filter[text]=naruto&page[limit]=20&page[offset]=0', {
    headers: { 'Accept': 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json', 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Count:', data.data?.length);
  const first = data.data?.[0];
  console.log('First anime:', {
    id: first?.id,
    title: first?.attributes?.canonicalTitle,
    poster: first?.attributes?.posterImage?.large,
    cover: first?.attributes?.coverImage?.large,
    synopsis: first?.attributes?.synopsis?.slice(0, 80),
    startDate: first?.attributes?.startDate,
    episodeCount: first?.attributes?.episodeCount,
    status: first?.attributes?.status,
    subtype: first?.attributes?.subtype
  });
}

test().catch(console.error);
