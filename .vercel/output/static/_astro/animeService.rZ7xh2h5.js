import"./cineSrc.DGHvR-Ke.js";import{fetchAniList as e}from"./client.BKbNuoiH.js";var t=`
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

      }
    }
  }
`;function n(e){let t=e.title?.english||e.title?.romaji||e.title?.userPreferred||`Anime Title`,n=e.coverImage?.extraLarge||e.coverImage?.large||e.coverImage?.medium||``,r=e.seasonYear?String(e.seasonYear):e.startDate?.year?String(e.startDate.year):void 0,i=e.format?String(e.format).toUpperCase():`TV`,a=i===`MOVIE`?`Movie`:i===`TV_SHORT`?`TV`:i,o=`Ongoing`;e.status===`FINISHED`?o=`Completed`:e.status===`RELEASING`?o=`Airing`:e.status===`NOT_YET_RELEASED`&&(o=`Upcoming`);let s=e.averageScore?Math.round(e.averageScore/10*10)/10:void 0;return{id:String(e.id),title:t,nativeTitle:e.title?.native||void 0,image:n,banner:e.bannerImage||void 0,releaseDate:r,subOrDub:`both`,type:a,status:o,rating:s,genres:e.genres||[],episode:e.nextAiringEpisode?.episode?e.nextAiringEpisode.episode-1:e.episodes||void 0}}async function r(r,i=1,a=24){let o=(r||``).trim();if(!o)return{currentPage:1,hasNextPage:!1,results:[]};let s=Math.max(1,Number(i)||1);try{let r=await e(t,{page:s,perPage:a,search:o,sort:[`SEARCH_MATCH`]}),i=r?.Page?.pageInfo,c=Array.isArray(r?.Page?.media)?r.Page.media:[];return{currentPage:i?.currentPage||s,hasNextPage:!!i?.hasNextPage,results:c.map(n)}}catch(e){throw console.error(`[AniList Search] Failed to search for "${o}":`,e.message),Error(`Failed to search anime: ${e.message||`AniList query error`}`)}}async function i(r=12){try{return((await e(t,{page:1,perPage:r,status:`RELEASING`,sort:[`POPULARITY_DESC`]}))?.Page?.media||[]).map(n)}catch(e){return console.warn(`[AniList] Failed to fetch recent anime:`,e.message),[]}}export{i as getRecentlyAddedAnime,r as searchAnime};