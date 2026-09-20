import { getTvStreamUrl, tvStreamProvider } from '../src/lib/api/providers/tvStreamProvider.ts';
import { movieStreamProvider } from '../src/lib/api/providers/movieStreamProvider.ts';

console.log('=== TV STREAM PROVIDER (CineSRC) UNIT TESTS ===\n');

// Test 1: Season 1 Episode 1
const url1 = getTvStreamUrl(1396, 1, 1);
console.log('Test 1 - 1396 S1E1:', url1);
if (url1 !== 'https://cinesrc.st/embed/tv/1396?s=1&e=1') {
  throw new Error(`Expected https://cinesrc.st/embed/tv/1396?s=1&e=1, got ${url1}`);
}

// Test 2: Season 1 Episode 2
const url2 = getTvStreamUrl(1396, 1, 2);
console.log('Test 2 - 1396 S1E2:', url2);
if (url2 !== 'https://cinesrc.st/embed/tv/1396?s=1&e=2') {
  throw new Error(`Expected https://cinesrc.st/embed/tv/1396?s=1&e=2, got ${url2}`);
}

// Test 3: Season 2 Episode 1
const url3 = getTvStreamUrl(1396, 2, 1);
console.log('Test 3 - 1396 S2E1:', url3);
if (url3 !== 'https://cinesrc.st/embed/tv/1396?s=2&e=1') {
  throw new Error(`Expected https://cinesrc.st/embed/tv/1396?s=2&e=1, got ${url3}`);
}

// Test 4: Dynamic ID
const url4 = getTvStreamUrl(94605, 3, 5);
console.log('Test 4 - 94605 S3E5:', url4);
if (url4 !== 'https://cinesrc.st/embed/tv/94605?s=3&e=5') {
  throw new Error(`Expected https://cinesrc.st/embed/tv/94605?s=3&e=5, got ${url4}`);
}

// Test 5: tvStreamProvider.getTVStream
const res = tvStreamProvider.getTVStream('1396', 1, 1);
console.log('Test 5 - tvStreamProvider.getTVStream available:', res.available);
console.log('Test 5 - Source URL:', res.sources[0]?.url);
console.log('Test 5 - Source Provider:', res.sources[0]?.provider);
console.log('Test 5 - Source Label:', res.sources[0]?.label);
if (res.sources[0]?.url !== 'https://cinesrc.st/embed/tv/1396?s=1&e=1' || res.sources[0]?.provider !== 'cinesrc') {
  throw new Error('Provider getTVStream failed validation.');
}

// Test 6: Verify Movies provider remains 100% untouched
const movieRes = movieStreamProvider.getStream({ id: '533535', tmdbId: 533535, title: 'Deadpool', mediaType: 'movie' });
console.log('\n=== MOVIE PROVIDER (VidSrc/2Embed) INTEGRITY CHECK ===');
console.log('Movie Source 1 URL:', movieRes.sources[0]?.url);
console.log('Movie Source 1 Provider:', movieRes.sources[0]?.provider);
if (!movieRes.sources[0]?.url.includes('vidsrc.sbs/embed/movie/533535')) {
  throw new Error('Movie provider was unexpectedly changed!');
}

console.log('\n ALL UNIT CHECKS PASSED SUCCESSFULLY!');
