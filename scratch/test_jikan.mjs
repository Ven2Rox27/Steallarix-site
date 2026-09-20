async function test() {
  const res = await fetch('https://api.jikan.moe/v4/anime?q=naruto&page=1');
  const d = await res.json();
  console.log('Jikan status:', res.status);
  console.log('Pagination:', d.pagination);
  console.log('Results count:', d.data ? d.data.length : 0);
  if (d.data && d.data.length > 0) {
    const a = d.data[0];
    console.log('First:', {
      mal_id: a.mal_id,
      title: a.title,
      image: a.images && a.images.jpg ? a.images.jpg.large_image_url : null,
      year: a.year,
      type: a.type,
      episodes: a.episodes
    });
  }
}

test().catch(console.error);
