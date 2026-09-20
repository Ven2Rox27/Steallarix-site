// ============================================================
// Stellarix — AniList GraphQL Types & Schema Definitions
// ============================================================

export interface AniListTitle {
  romaji?: string | null;
  english?: string | null;
  native?: string | null;
  userPreferred?: string | null;
}

export interface AniListCoverImage {
  extraLarge?: string | null;
  large?: string | null;
  medium?: string | null;
  color?: string | null;
}

export interface AniListFuzzyDate {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}

export interface AniListTag {
  name: string;
  rank?: number | null;
  isMediaSpoiler?: boolean | null;
}

export interface AniListNextAiringEpisode {
  episode: number;
  airingAt: number;
  timeUntilAiring?: number | null;
}

export type AniListMediaFormat =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC';

export type AniListMediaStatus =
  | 'FINISHED'
  | 'RELEASING'
  | 'NOT_YET_RELEASED'
  | 'CANCELLED'
  | 'HIATUS';

export interface AniListMedia {
  id: number;
  idMal?: number | null;
  title: AniListTitle;
  coverImage?: AniListCoverImage | null;
  bannerImage?: string | null;
  description?: string | null;
  genres?: string[] | null;
  tags?: AniListTag[] | null;
  format?: AniListMediaFormat | null;
  status?: AniListMediaStatus | null;
  startDate?: AniListFuzzyDate | null;
  endDate?: AniListFuzzyDate | null;
  season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL' | null;
  seasonYear?: number | null;
  episodes?: number | null;
  duration?: number | null;
  averageScore?: number | null;
  popularity?: number | null;
  nextAiringEpisode?: AniListNextAiringEpisode | null;
  isAdult?: boolean | null;
}

export interface AniListPageInfo {
  currentPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface AniListPaginatedResponse {
  pageInfo: AniListPageInfo;
  media: AniListMedia[];
}

export interface AniListGraphQLError {
  message: string;
  status?: number;
  locations?: Array<{ line: number; column: number }>;
}

export interface AniListGraphQLResponse<T> {
  data?: T;
  errors?: AniListGraphQLError[];
}
