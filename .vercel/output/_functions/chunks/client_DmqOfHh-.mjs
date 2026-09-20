import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/lib/api/anilist/client.ts
var client_exports = /* @__PURE__ */ __exportAll({ fetchAniList: () => fetchAniList });
var ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co";
var anilistMemoryCache = /* @__PURE__ */ new Map();
var DEFAULT_CACHE_TTL_MS = 3e5;
/**
* Creates a unique deterministic cache key for query + variables.
*/
function getCacheKey(query, variables) {
	return `${query.replace(/\s+/g, " ").trim()}::${variables ? JSON.stringify(variables, Object.keys(variables).sort()) : ""}`;
}
/**
* Sends a GraphQL POST request to AniList.
* Always verifies response.errors to prevent false successes.
*
* @param query GraphQL query string
* @param variables Optional variables dictionary
* @param cacheTtlMs Optional cache TTL in milliseconds (defaults to 5 minutes)
*/
async function fetchAniList(query, variables, cacheTtlMs = DEFAULT_CACHE_TTL_MS) {
	const cacheKey = getCacheKey(query, variables);
	const cached = anilistMemoryCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) return cached.data;
	const payload = JSON.stringify({
		query,
		variables
	});
	let lastError = null;
	for (let attempt = 0; attempt < 3; attempt++) try {
		const res = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				...typeof window === "undefined" ? { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } : {}
			},
			body: payload
		});
		if (res.status === 429) {
			const retryAfter = parseInt(res.headers.get("Retry-After") || "2", 10);
			console.warn(`[AniList] Rate limited (429). Retrying in ${retryAfter}s...`);
			await new Promise((r) => setTimeout(r, Math.min(retryAfter * 1e3, 3e3)));
			continue;
		}
		const json = await res.json();
		if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
			const message = json.errors.map((e) => e.message).join(" | ");
			throw new Error(`AniList GraphQL Error: ${message}`);
		}
		if (!res.ok) throw new Error(`AniList HTTP Error ${res.status}: ${res.statusText}`);
		if (json.data) {
			anilistMemoryCache.set(cacheKey, {
				data: json.data,
				expiresAt: Date.now() + cacheTtlMs
			});
			return json.data;
		}
		throw new Error("AniList returned empty data object.");
	} catch (err) {
		lastError = err;
		if (typeof process !== "undefined" && process.versions?.node) try {
			const https = await import("node:https");
			const fallbackData = await new Promise((resolve, reject) => {
				const req = https.request(ANILIST_GRAPHQL_ENDPOINT, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
						"Content-Length": Buffer.byteLength(payload)
					}
				}, (res) => {
					let raw = "";
					res.on("data", (chunk) => raw += chunk);
					res.on("end", () => {
						try {
							const json = JSON.parse(raw);
							if (json.errors && json.errors.length > 0) return reject(/* @__PURE__ */ new Error(`AniList Error: ${json.errors.map((e) => e.message).join(" | ")}`));
							if (json.data) resolve(json.data);
							else reject(/* @__PURE__ */ new Error("AniList returned empty data object."));
						} catch (e) {
							reject(e);
						}
					});
				});
				req.on("error", reject);
				req.write(payload);
				req.end();
			});
			if (fallbackData) {
				anilistMemoryCache.set(cacheKey, {
					data: fallbackData,
					expiresAt: Date.now() + cacheTtlMs
				});
				return fallbackData;
			}
		} catch (nodeErr) {
			lastError = nodeErr;
		}
		if (attempt < 2) await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
	}
	if (cached) {
		console.warn("[AniList] Serving stale cache due to network failure");
		return cached.data;
	}
	throw lastError || /* @__PURE__ */ new Error("Failed to fetch data from AniList.");
}
//#endregion
export { fetchAniList as n, client_exports as t };
