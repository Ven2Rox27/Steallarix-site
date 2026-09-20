async function test() {
  const query = `
    query ($search: String, $page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          currentPage
          hasNextPage
        }
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            english
            romaji
            native
          }
          coverImage {
            extraLarge
            large
          }
          bannerImage
          startDate {
            year
          }
          format
          status
          episodes
          genres
          description
        }
      }
    }
  `;

  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0'
    },
    body: JSON.stringify({
      query,
      variables: { search: 'Naruto', page: 1 }
    })
  });

  const text = await res.text();
  console.log('Status:', res.status);
  try {
    const data = JSON.parse(text);
    console.log('Data:', JSON.stringify(data).slice(0, 500));
  } catch(e) {
    console.log('Raw text:', text.slice(0, 300));
  }
}

test().catch(console.error);
