import { execSync } from 'child_process';

function agent(subCmd) {
  const full = `npx agent-browser --session tv_cinesrc ${subCmd}`;
  return execSync(full, { encoding: 'utf8' }).trim();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== VERIFYING CINESRC TV EMBED IN BROWSER ===\n');

  // Step 1: Open TV show watch page (Breaking Bad 1396 S1E1)
  console.log('1. Navigating to http://localhost:4321/watch/1396?s=1&ep=s1e1');
  agent('open "http://localhost:4321/watch/1396?s=1&ep=s1e1"');
  await sleep(3000);

  // Check iframe src
  const iframeSrc1 = agent('eval "document.querySelector(\'iframe\')?.src"');
  console.log('Iframe src for S1E1:', iframeSrc1);
  if (!iframeSrc1.includes('cinesrc.st/embed/tv/1396?s=1&e=1')) {
    throw new Error(`Expected cinesrc S1E1 url, got: ${iframeSrc1}`);
  }

  // Step 2: Change to Episode 2 (click Next button)
  console.log('\n2. Clicking Next Episode button');
  agent('eval "(() => { const nextBtn = Array.from(document.querySelectorAll(\'button\')).find(b => b.title === \'Next Episode\' || b.textContent.includes(\'Next\')); if (nextBtn) nextBtn.click(); return !!nextBtn; })()"');
  await sleep(2500);

  const iframeSrc2 = agent('eval "document.querySelector(\'iframe\')?.src"');
  console.log('Iframe src after Next Episode:', iframeSrc2);
  if (!iframeSrc2.includes('cinesrc.st/embed/tv/1396?s=1&e=2')) {
    throw new Error(`Expected cinesrc S1E2 url, got: ${iframeSrc2}`);
  }

  // Step 3: Change season (open S2E1)
  console.log('\n3. Navigating to Season 2 Episode 1');
  agent('open "http://localhost:4321/watch/1396?s=2&ep=s2e1"');
  await sleep(3000);

  const iframeSrc3 = agent('eval "document.querySelector(\'iframe\')?.src"');
  console.log('Iframe src for S2E1:', iframeSrc3);
  if (!iframeSrc3.includes('cinesrc.st/embed/tv/1396?s=2&e=1')) {
    throw new Error(`Expected cinesrc S2E1 url, got: ${iframeSrc3}`);
  }

  // Step 4: Navigate Home -> TV Shows
  console.log('\n4. Navigating Home -> TV Shows');
  agent('open http://localhost:4321/');
  await sleep(1500);
  agent('open http://localhost:4321/tv-shows');
  await sleep(2000);
  const tvCatalogText = agent('eval "document.body.innerText.match(/Showing \\d+ of [\\d,]+ titles from TMDB/)?.[0]"');
  console.log('TV Catalog after Home -> TV Shows:', tvCatalogText);

  // Step 5: Navigate Movies -> TV Shows
  console.log('\n5. Navigating Movies -> TV Shows');
  agent('open http://localhost:4321/movies');
  await sleep(1500);
  agent('open http://localhost:4321/tv-shows');
  await sleep(2000);
  const tvCatalogText2 = agent('eval "document.body.innerText.match(/Showing \\d+ of [\\d,]+ titles from TMDB/)?.[0]"');
  console.log('TV Catalog after Movies -> TV Shows:', tvCatalogText2);

  // Step 6: Return to TV watch page to confirm player still works
  console.log('\n6. Returning to TV watch player');
  agent('open "http://localhost:4321/watch/1396?s=1&ep=s1e1"');
  await sleep(3000);
  const iframeSrcFinal = agent('eval "document.querySelector(\'iframe\')?.src"');
  console.log('TV Player iframe src:', iframeSrcFinal);
  if (!iframeSrcFinal.includes('cinesrc.st/embed/tv/1396?s=1&e=1')) {
    throw new Error(`Player verification failed: ${iframeSrcFinal}`);
  }

  console.log('\n=== ALL BROWSER CINESRC TESTS PASSED! ===');
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
