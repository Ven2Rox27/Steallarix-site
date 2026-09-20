// ============================================================
// Stellarix — AniList GraphQL Queries
// ============================================================
// Public queries strictly for Anime (type: ANIME, isAdult: false).
// Single paginated data field per Page query.

/**
 * Standard fields returned for anime cards and discovery lists.
 */
export const ANIME_CARD_FIELDS = `
  id
  idMal
  title {
    romaji
    english
    native
    userPreferred
  }
  coverImage {
    large
    extraLarge
    medium
    color
  }
  bannerImage
  description
  genres
  tags {
    name
    rank
  }
  format
  status
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  season
  seasonYear
  episodes
  duration
  averageScore
  popularity
  nextAiringEpisode {
    episode
    airingAt
  }
  isAdult
`;

/**
 * Paginated Anime Discovery / Filter / Search Query
 */
export const ANIME_PAGE_QUERY = `
  query (
    $page: Int
    $perPage: Int
    $search: String
    $sort: [MediaSort]
    $genre: [String]
    $tag: [String]
    $status: MediaStatus
    $format: MediaFormat
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
      }
      media(
        type: ANIME
        isAdult: false
        search: $search
        sort: $sort
        genre_in: $genre
        tag_in: $tag
        status: $status
        format: $format
      ) {
        ${ANIME_CARD_FIELDS}
      }
    }
  }
`;

/**
 * Detailed Anime Metadata Query (Single Media by AniList ID)
 */
export const ANIME_DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      coverImage {
        large
        extraLarge
        medium
        color
      }
      bannerImage
      description
      genres
      tags {
        name
        rank
        isMediaSpoiler
      }
      format
      status
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      season
      seasonYear
      episodes
      duration
      averageScore
      popularity
      nextAiringEpisode {
        episode
        airingAt
      }
      isAdult
    }
  }
`;
