//#region src/lib/api/mockData.ts
var genres = [
	{
		id: "g-action",
		name: "Action",
		slug: "action"
	},
	{
		id: "g-adventure",
		name: "Adventure",
		slug: "adventure"
	},
	{
		id: "g-comedy",
		name: "Comedy",
		slug: "comedy"
	},
	{
		id: "g-drama",
		name: "Drama",
		slug: "drama"
	},
	{
		id: "g-fantasy",
		name: "Fantasy",
		slug: "fantasy"
	},
	{
		id: "g-horror",
		name: "Horror",
		slug: "horror"
	},
	{
		id: "g-mystery",
		name: "Mystery",
		slug: "mystery"
	},
	{
		id: "g-romance",
		name: "Romance",
		slug: "romance"
	},
	{
		id: "g-scifi",
		name: "Sci-Fi",
		slug: "sci-fi"
	},
	{
		id: "g-thriller",
		name: "Thriller",
		slug: "thriller"
	},
	{
		id: "g-psychological",
		name: "Psychological",
		slug: "psychological"
	},
	{
		id: "g-shonen",
		name: "Shonen",
		slug: "shonen"
	},
	{
		id: "g-seinen",
		name: "Seinen",
		slug: "seinen"
	},
	{
		id: "g-mecha",
		name: "Mecha",
		slug: "mecha"
	},
	{
		id: "g-slice-of-life",
		name: "Slice of Life",
		slug: "slice-of-life"
	},
	{
		id: "g-supernatural",
		name: "Supernatural",
		slug: "supernatural"
	},
	{
		id: "g-crime",
		name: "Crime",
		slug: "crime"
	},
	{
		id: "g-documentary",
		name: "Documentary",
		slug: "documentary"
	},
	{
		id: "g-animation",
		name: "Animation",
		slug: "animation"
	}
];
var g = (slug) => {
	const s = slug === "scifi" ? "sci-fi" : slug;
	return genres.find((x) => x.slug === s) || {
		id: `g-${s}`,
		name: s.charAt(0).toUpperCase() + s.slice(1),
		slug: s
	};
};
var avatar = (seed) => `https://picsum.photos/seed/stellarix-a${seed}/200/200`;
avatar(101), avatar(102), avatar(103), avatar(104), avatar(105), avatar(106), avatar(107), avatar(108);
var movieCast = {
	ryanReynolds: {
		id: "mc-rr",
		name: "Ryan Reynolds",
		character: "Wade Wilson / Deadpool",
		image: "https://image.tmdb.org/t/p/w200/4SYTH5FRAxTkYo8Um4vhk78whQf.jpg"
	},
	hughJackman: {
		id: "mc-hj",
		name: "Hugh Jackman",
		character: "Logan / Wolverine",
		image: "https://image.tmdb.org/t/p/w200/oX6CpXmn5O1gq8Vq1mJd1tXyQ8q.jpg"
	},
	emmaCorrin: {
		id: "mc-ec",
		name: "Emma Corrin",
		character: "Cassandra Nova",
		image: "https://image.tmdb.org/t/p/w200/9b2NkV5Yx0M41zVw0xP3Jq9N8N.jpg"
	},
	brieLarson: {
		id: "mc-bl",
		name: "Brie Larson",
		character: "Carol Danvers / Captain Marvel",
		image: "https://image.tmdb.org/t/p/w200/8j6PzWpS7mI2x1zH3xW3e8c0K0.jpg"
	},
	teyonahParris: {
		id: "mc-tp",
		name: "Teyonah Parris",
		character: "Monica Rambeau",
		image: "https://image.tmdb.org/t/p/w200/9kF1Z4x0q3j4Y8v5K6k9y0x4w0.jpg"
	},
	imanVellani: {
		id: "mc-iv",
		name: "Iman Vellani",
		character: "Kamala Khan / Ms. Marvel",
		image: "https://image.tmdb.org/t/p/w200/5Wk0t0X6k2P1y0y7z7x9v1k3a.jpg"
	},
	samuelJackson: {
		id: "mc-slj",
		name: "Samuel L. Jackson",
		character: "Nick Fury",
		image: "https://image.tmdb.org/t/p/w200/mXN4Gw9t2IRehgAO244YPhBt59N.jpg"
	},
	timotheeChalamet: {
		id: "mc-tc",
		name: "Timothée Chalamet",
		character: "Paul Atreides",
		image: "https://image.tmdb.org/t/p/w200/BE2sdjpgsa2rNTFa66f7upkaOP.jpg"
	},
	zendaya: {
		id: "mc-z",
		name: "Zendaya",
		character: "Chani",
		image: "https://image.tmdb.org/t/p/w200/ty97jlu1g0t2vWvK0c7hZ3c5a.jpg"
	},
	cillianMurphy: {
		id: "mc-cm",
		name: "Cillian Murphy",
		character: "J. Robert Oppenheimer",
		image: "https://image.tmdb.org/t/p/w200/360RfhU0t6lFqaO069wG7z2w1.jpg"
	},
	caileeSpaeny: {
		id: "mc-cs",
		name: "Cailee Spaeny",
		character: "Rain Carradine",
		image: "https://image.tmdb.org/t/p/w200/w4M2pY6l0o6h5k2w1m9a.jpg"
	}
};
var movies = [
	{
		id: "533535",
		tmdbId: 533535,
		imdbId: "tt6263850",
		title: "Deadpool & Wolverine",
		description: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
		posterUrl: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/yDHYTjA3R0neXjYj43Y17unm20x.jpg",
		mediaType: "movie",
		year: 2024,
		rating: 7.7,
		imdbRating: 7.7,
		genres: [
			g("action"),
			g("comedy"),
			g("sci-fi")
		],
		duration: 128,
		badges: [
			"4K",
			"HDR",
			"Dolby Atmos"
		],
		cast: [
			movieCast.ryanReynolds,
			movieCast.hughJackman,
			movieCast.emmaCorrin
		],
		director: "Shawn Levy",
		trailerUrl: "https://www.youtube.com/watch?v=73_1biulkYk",
		featured: true
	},
	{
		id: "tt10676048",
		tmdbId: 609681,
		imdbId: "tt10676048",
		title: "The Marvels",
		description: "Carol Danvers gets her powers entangled with those of Kamala Khan and Monica Rambeau, forcing them to work together to save the universe.",
		posterUrl: "https://image.tmdb.org/t/p/w500/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/feSiISwgEpVzR1v3zw2dnLpq4g8.jpg",
		mediaType: "movie",
		year: 2023,
		rating: 6,
		imdbRating: 5.6,
		genres: [
			g("action"),
			g("adventure"),
			g("sci-fi")
		],
		duration: 105,
		badges: ["4K", "HDR"],
		cast: [
			movieCast.brieLarson,
			movieCast.teyonahParris,
			movieCast.imanVellani,
			movieCast.samuelJackson
		],
		director: "Nia DaCosta",
		trailerUrl: "https://www.youtube.com/watch?v=wS_qbDztgWA",
		featured: true
	},
	{
		id: "693134",
		tmdbId: 693134,
		imdbId: "tt15239678",
		title: "Dune: Part Two",
		description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
		posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
		mediaType: "movie",
		year: 2024,
		rating: 8.5,
		imdbRating: 8.5,
		genres: [
			g("sci-fi"),
			g("adventure"),
			g("drama")
		],
		duration: 166,
		badges: [
			"4K",
			"HDR",
			"Dolby Atmos"
		],
		cast: [movieCast.timotheeChalamet, movieCast.zendaya],
		director: "Denis Villeneuve",
		trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
		featured: true
	},
	{
		id: "872585",
		tmdbId: 872585,
		imdbId: "tt15398776",
		title: "Oppenheimer",
		description: "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
		posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/rLb2cw69Pazuxaj0sRXQx2OOxvt.jpg",
		mediaType: "movie",
		year: 2023,
		rating: 8.9,
		imdbRating: 8.9,
		genres: [g("drama"), g("thriller")],
		duration: 180,
		badges: [
			"4K",
			"IMAX",
			"Dolby Atmos"
		],
		cast: [movieCast.cillianMurphy],
		director: "Christopher Nolan",
		trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
		featured: true
	},
	{
		id: "1022789",
		tmdbId: 1022789,
		imdbId: "tt22022452",
		title: "Inside Out 2",
		description: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for unexpected new Emotions: Anxiety, Envy, Ennui, and Embarrassment.",
		posterUrl: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/stKGOm8wqGGOvEj9hnRsIRSYVOq.jpg",
		mediaType: "movie",
		year: 2024,
		rating: 7.6,
		imdbRating: 7.6,
		genres: [
			g("animation"),
			g("comedy"),
			g("adventure")
		],
		duration: 96,
		badges: ["4K", "HDR"],
		cast: [],
		director: "Kelsey Mann",
		trailerUrl: "https://www.youtube.com/watch?v=LEjhY15eCx0"
	},
	{
		id: "823464",
		tmdbId: 823464,
		imdbId: "tt1160419",
		title: "Godzilla x Kong: The New Empire",
		description: "Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world, challenging their very existence.",
		posterUrl: "https://image.tmdb.org/t/p/w500/bQ2ywkchIiaKLSEaMrcT6e29f91.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/xRd1eJIDc7nhAg5EGvTrda37Ag0.jpg",
		mediaType: "movie",
		year: 2024,
		rating: 7.2,
		imdbRating: 6.1,
		genres: [
			g("action"),
			g("sci-fi"),
			g("adventure")
		],
		duration: 115,
		badges: ["4K", "HDR"],
		cast: [],
		director: "Adam Wingard",
		trailerUrl: "https://www.youtube.com/watch?v=lV1OOlGwExg"
	},
	{
		id: "945961",
		tmdbId: 945961,
		imdbId: "tt23567776",
		title: "Alien: Romulus",
		description: "While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
		posterUrl: "https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao8l3urDDujmmQh.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg",
		mediaType: "movie",
		year: 2024,
		rating: 7.3,
		imdbRating: 7.3,
		genres: [
			g("horror"),
			g("sci-fi"),
			g("thriller")
		],
		duration: 119,
		badges: ["4K", "Dolby Atmos"],
		cast: [movieCast.caileeSpaeny],
		director: "Fede Álvarez",
		trailerUrl: "https://www.youtube.com/watch?v=x0XDEhP4MQs"
	},
	{
		id: "157336",
		tmdbId: 157336,
		imdbId: "tt0816692",
		title: "Interstellar",
		description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
		posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/rAiYTsqJiiklh00mYfvQv24wN9.jpg",
		mediaType: "movie",
		year: 2014,
		rating: 8.7,
		imdbRating: 8.7,
		voteCount: 35e3,
		releaseDate: "2014-11-05",
		tagline: "Mankind was born on Earth. It was never meant to die here.",
		genres: [
			g("sci-fi"),
			g("drama"),
			g("adventure")
		],
		duration: 169,
		badges: [
			"4K",
			"IMAX",
			"Dolby Atmos"
		],
		cast: [movieCast.timotheeChalamet],
		director: "Christopher Nolan",
		writers: ["Jonathan Nolan", "Christopher Nolan"],
		productionCompanies: [
			"Syncopy",
			"Lynda Obst Productions",
			"Legendary Pictures"
		],
		trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
		featured: true
	},
	{
		id: "27205",
		tmdbId: 27205,
		imdbId: "tt1375666",
		title: "Inception",
		description: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception.",
		posterUrl: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
		mediaType: "movie",
		year: 2010,
		rating: 8.8,
		imdbRating: 8.8,
		voteCount: 36e3,
		releaseDate: "2010-07-15",
		tagline: "Your mind is the scene of the crime.",
		genres: [
			g("action"),
			g("sci-fi"),
			g("adventure")
		],
		duration: 148,
		badges: ["4K", "HDR"],
		director: "Christopher Nolan",
		writers: ["Christopher Nolan"],
		productionCompanies: ["Syncopy", "Legendary Pictures"],
		trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
		featured: true
	},
	{
		id: "155",
		tmdbId: 155,
		imdbId: "tt0468569",
		title: "The Dark Knight",
		description: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
		posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
		mediaType: "movie",
		year: 2008,
		rating: 9,
		imdbRating: 9,
		voteCount: 32e3,
		releaseDate: "2008-07-16",
		tagline: "Welcome to a world without rules.",
		genres: [
			g("drama"),
			g("action"),
			g("crime"),
			g("thriller")
		],
		duration: 152,
		badges: ["4K", "IMAX"],
		director: "Christopher Nolan",
		writers: ["Jonathan Nolan", "Christopher Nolan"],
		productionCompanies: [
			"Warner Bros. Pictures",
			"Legendary Pictures",
			"Syncopy"
		],
		trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
		featured: true
	},
	{
		id: "569094",
		tmdbId: 569094,
		imdbId: "tt9362722",
		title: "Spider-Man: Across the Spider-Verse",
		description: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.",
		posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
		mediaType: "movie",
		year: 2023,
		rating: 8.4,
		imdbRating: 8.6,
		voteCount: 6500,
		releaseDate: "2023-05-31",
		tagline: "It's how you wear the mask that matters.",
		genres: [
			g("animation"),
			g("action"),
			g("adventure"),
			g("sci-fi")
		],
		duration: 140,
		badges: ["4K", "Dolby Atmos"],
		director: "Joaquim Dos Santos",
		writers: ["Phil Lord", "Christopher Miller"],
		productionCompanies: [
			"Columbia Pictures",
			"Sony Pictures Animation",
			"Marvel Entertainment"
		],
		trailerUrl: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
		featured: true
	},
	{
		id: "361743",
		tmdbId: 361743,
		imdbId: "tt1745960",
		title: "Top Gun: Maverick",
		description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
		posterUrl: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
		mediaType: "movie",
		year: 2022,
		rating: 8.3,
		imdbRating: 8.3,
		voteCount: 8500,
		releaseDate: "2022-05-24",
		tagline: "Feel the need. The need for speed.",
		genres: [g("action"), g("drama")],
		duration: 131,
		badges: [
			"4K",
			"HDR",
			"Dolby Atmos"
		],
		director: "Joseph Kosinski",
		writers: [
			"Ehren Kruger",
			"Eric Warren Singer",
			"Christopher McQuarrie"
		],
		productionCompanies: [
			"Skydance Media",
			"Paramount Pictures",
			"Jerry Bruckheimer Films"
		],
		trailerUrl: "https://www.youtube.com/watch?v=giXco2jaZ_4"
	},
	{
		id: "414906",
		tmdbId: 414906,
		imdbId: "tt1877830",
		title: "The Batman",
		description: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
		posterUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/tRS6jvPM9qPrrnx2KRx3ew96Yot.jpg",
		mediaType: "movie",
		year: 2022,
		rating: 7.7,
		imdbRating: 7.8,
		voteCount: 9600,
		releaseDate: "2022-03-01",
		tagline: "Unmask the truth.",
		genres: [
			g("crime"),
			g("mystery"),
			g("thriller")
		],
		duration: 176,
		badges: ["4K", "Dolby Atmos"],
		director: "Matt Reeves",
		writers: ["Matt Reeves", "Peter Craig"],
		productionCompanies: [
			"Warner Bros. Pictures",
			"6th & Idaho",
			"DC Films"
		],
		trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4"
	},
	{
		id: "603692",
		tmdbId: 603692,
		imdbId: "tt10366206",
		title: "John Wick: Chapter 4",
		description: "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.",
		posterUrl: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2389.jpg",
		mediaType: "movie",
		year: 2023,
		rating: 7.8,
		imdbRating: 7.7,
		voteCount: 6100,
		releaseDate: "2023-03-22",
		tagline: "No way out, only one way through.",
		genres: [
			g("action"),
			g("thriller"),
			g("crime")
		],
		duration: 169,
		badges: ["4K", "HDR"],
		director: "Chad Stahelski",
		writers: ["Shay Hatten", "Michael Finch"],
		productionCompanies: [
			"Thunder Road Pictures",
			"87Eleven",
			"Lionsgate"
		],
		trailerUrl: "https://www.youtube.com/watch?v=qEVUtrk8_B4"
	},
	{
		id: "558449",
		tmdbId: 558449,
		imdbId: "tt9664108",
		title: "Gladiator II",
		description: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
		posterUrl: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/euYIwmwkmz95mnExloguf0MmlDC.jpg",
		mediaType: "movie",
		year: 2024,
		rating: 6.8,
		imdbRating: 6.7,
		voteCount: 2200,
		releaseDate: "2024-11-13",
		tagline: "What we do in life echoes in eternity.",
		genres: [
			g("action"),
			g("adventure"),
			g("drama")
		],
		duration: 148,
		badges: ["4K", "Dolby Atmos"],
		director: "Ridley Scott",
		writers: ["David Scarpa"],
		productionCompanies: ["Paramount Pictures", "Scott Free Productions"],
		trailerUrl: "https://www.youtube.com/watch?v=4rgYUipGJNo"
	},
	{
		id: "786892",
		tmdbId: 786892,
		imdbId: "tt12037194",
		title: "Furiosa: A Mad Max Saga",
		description: "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus.",
		posterUrl: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/wNAhuOZ3ZfFg49774vwctngqqKy.jpg",
		mediaType: "movie",
		year: 2024,
		rating: 7.6,
		imdbRating: 7.5,
		voteCount: 3400,
		releaseDate: "2024-05-22",
		tagline: "Out of the ashes, she will rise.",
		genres: [
			g("action"),
			g("adventure"),
			g("sci-fi")
		],
		duration: 148,
		badges: ["4K", "HDR"],
		director: "George Miller",
		writers: ["George Miller", "Nico Lathouris"],
		productionCompanies: ["Warner Bros. Pictures", "Kennedy Miller Mitchell"],
		trailerUrl: "https://www.youtube.com/watch?v=XJMuhwVlca4"
	},
	{
		id: "653346",
		tmdbId: 653346,
		imdbId: "tt11384580",
		title: "Kingdom of the Planet of the Apes",
		description: "Several generations following Caesar's reign, a young ape ventures on a journey that will lead him to question everything he has been taught about the past and make choices that will define a future for apes and humans alike.",
		posterUrl: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/fqvXv6q9quKt0QfU96hvq3vmh86.jpg",
		mediaType: "movie",
		year: 2024,
		rating: 7.1,
		imdbRating: 6.9,
		voteCount: 3100,
		releaseDate: "2024-05-08",
		tagline: "No one can stop the reign.",
		genres: [
			g("sci-fi"),
			g("adventure"),
			g("action")
		],
		duration: 145,
		badges: ["4K", "Dolby Atmos"],
		director: "Wes Ball",
		writers: ["Josh Friedman"],
		productionCompanies: ["20th Century Studios", "Oddball Entertainment"],
		trailerUrl: "https://www.youtube.com/watch?v=Xtfi7SNtVpY"
	},
	{
		id: "438631",
		tmdbId: 438631,
		imdbId: "tt1160419",
		title: "Dune",
		description: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
		posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/jYL2AepG5QpG7Qh4tWq76m1Jk.jpg",
		mediaType: "movie",
		year: 2021,
		rating: 7.9,
		imdbRating: 8,
		voteCount: 11e3,
		releaseDate: "2021-09-15",
		tagline: "It begins.",
		genres: [g("sci-fi"), g("adventure")],
		duration: 155,
		badges: [
			"4K",
			"IMAX",
			"Dolby Atmos"
		],
		director: "Denis Villeneuve",
		writers: [
			"Jon Spaihts",
			"Denis Villeneuve",
			"Eric Roth"
		],
		productionCompanies: ["Legendary Pictures", "Warner Bros. Pictures"],
		trailerUrl: "https://www.youtube.com/watch?v=8g18jFHCLXk"
	}
];
var anime = [
	{
		id: "16498",
		tmdbId: 1429,
		title: "Attack on Titan",
		description: "Several hundred years ago, humans were nearly exterminated by Titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source.",
		posterUrl: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg",
		mediaType: "anime",
		year: 2013,
		rating: 9,
		imdbRating: 9,
		malRating: 9,
		genres: [
			g("action"),
			g("fantasy"),
			g("animation")
		],
		duration: 24,
		badges: ["1080p", "HDR"],
		audioType: "both",
		totalSeasons: 4,
		totalEpisodes: 89,
		status: "completed",
		featured: true
	},
	{
		id: "101922",
		tmdbId: 85937,
		title: "Demon Slayer: Kimetsu no Yaiba",
		description: "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko has been transformed into a demon herself.",
		posterUrl: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/nTvM4mhqZlHIvUkIvd6vv79QOqv.jpg",
		mediaType: "anime",
		year: 2019,
		rating: 8.7,
		imdbRating: 8.7,
		malRating: 8.7,
		genres: [
			g("action"),
			g("fantasy"),
			g("animation"),
			g("supernatural")
		],
		duration: 24,
		badges: ["4K", "HDR"],
		audioType: "both",
		totalSeasons: 4,
		totalEpisodes: 55,
		status: "ongoing",
		featured: true
	},
	{
		id: "113415",
		tmdbId: 95479,
		title: "JUJUTSU KAISEN",
		description: "Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life. One day, to save a classmate who has been attacked by curses, he eats the finger of Ryomen Sukuna, taking the curse into his own soul.",
		posterUrl: "https://image.tmdb.org/t/p/w500/fHpHz3s7aA5Y6vFf3aM8N3xJkYn.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/gmECX1DvYt1U6ypgP9BmOXGfcT.jpg",
		mediaType: "anime",
		year: 2020,
		rating: 8.6,
		imdbRating: 8.6,
		malRating: 8.6,
		genres: [
			g("action"),
			g("fantasy"),
			g("animation"),
			g("supernatural")
		],
		duration: 24,
		badges: ["4K", "HDR"],
		audioType: "both",
		totalSeasons: 2,
		totalEpisodes: 47,
		status: "ongoing",
		featured: true
	},
	{
		id: "154587",
		tmdbId: 209867,
		title: "Frieren: Beyond Journey's End",
		description: "The adventure is over but life goes on for an elf mage just beginning to learn what living is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land.",
		posterUrl: "https://image.tmdb.org/t/p/w500/dqzenchTd7lp5zht7BdlqM7RBhD.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/2rmK7mnchsl935x82gunqpUm3ah.jpg",
		mediaType: "anime",
		year: 2023,
		rating: 8.9,
		imdbRating: 8.9,
		malRating: 8.9,
		genres: [
			g("adventure"),
			g("fantasy"),
			g("animation")
		],
		duration: 24,
		badges: ["1080p"],
		audioType: "both",
		totalSeasons: 1,
		totalEpisodes: 28,
		status: "completed",
		featured: false
	}
];
var tvShows = [
	{
		id: "1396",
		tmdbId: 1396,
		title: "Breaking Bad",
		description: "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years left to live. He chooses to enter a dangerous world of drugs and crime with Jesse Pinkman to secure his family's financial future.",
		posterUrl: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/9faGSFi5jam6pDWGNd0p8JcJgXQ.jpg",
		mediaType: "tv",
		year: 2008,
		rating: 9.5,
		imdbRating: 9.5,
		genres: [
			g("drama"),
			g("crime"),
			g("thriller")
		],
		duration: 47,
		badges: ["4K", "HDR"],
		totalSeasons: 5,
		totalEpisodes: 62,
		status: "completed",
		featured: true
	},
	{
		id: "66732",
		tmdbId: 66732,
		title: "Stranger Things",
		description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
		posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
		mediaType: "tv",
		year: 2016,
		rating: 8.6,
		imdbRating: 8.6,
		genres: [
			g("sci-fi"),
			g("mystery"),
			g("drama")
		],
		duration: 50,
		badges: ["4K", "Dolby Atmos"],
		totalSeasons: 4,
		totalEpisodes: 34,
		status: "ongoing",
		featured: true
	},
	{
		id: "100088",
		tmdbId: 100088,
		title: "The Last of Us",
		description: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.",
		posterUrl: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2V7JMrRI.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/9JztcEPjCqA8tZ4t7F8o6E9d87u.jpg",
		mediaType: "tv",
		year: 2023,
		rating: 8.6,
		imdbRating: 8.6,
		genres: [
			g("drama"),
			g("action"),
			g("adventure")
		],
		duration: 60,
		badges: ["4K", "HDR"],
		totalSeasons: 1,
		totalEpisodes: 9,
		status: "ongoing",
		featured: true
	},
	{
		id: "1399",
		tmdbId: 1399,
		title: "Game of Thrones",
		description: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
		posterUrl: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
		mediaType: "tv",
		year: 2011,
		rating: 8.4,
		imdbRating: 8.4,
		genres: [
			g("drama"),
			g("fantasy"),
			g("action")
		],
		duration: 55,
		badges: ["4K", "Dolby Atmos"],
		totalSeasons: 8,
		totalEpisodes: 73,
		status: "completed",
		featured: false
	},
	{
		id: "106379",
		tmdbId: 106379,
		title: "Fallout",
		description: "The story of haves and have-nots in a world in which there’s almost nothing left to have. 200 years after the apocalypse, a peaceful denizen of a cozy fallout shelter is forced to return to the surface.",
		posterUrl: "https://image.tmdb.org/t/p/w500/ansA65x3f3d7r4268e3b5e428e0.jpg",
		backdropUrl: "https://image.tmdb.org/t/p/original/ilKaYJEezvztndr7vmkI3B11w7f.jpg",
		mediaType: "tv",
		year: 2024,
		rating: 8.4,
		imdbRating: 8.4,
		genres: [
			g("sci-fi"),
			g("action"),
			g("adventure")
		],
		duration: 58,
		badges: ["4K", "HDR"],
		totalSeasons: 1,
		totalEpisodes: 8,
		status: "ongoing",
		featured: false
	}
];
var seasons = {
	"16498": [{
		id: "16498-s1",
		seriesId: "16498",
		seasonNumber: 1,
		title: "Season 1",
		episodeCount: 25,
		year: 2013
	}, {
		id: "16498-s2",
		seriesId: "16498",
		seasonNumber: 2,
		title: "Season 2",
		episodeCount: 12,
		year: 2017
	}],
	"1396": [{
		id: "1396-s1",
		seriesId: "1396",
		seasonNumber: 1,
		title: "Season 1",
		episodeCount: 7,
		year: 2008
	}, {
		id: "1396-s2",
		seriesId: "1396",
		seasonNumber: 2,
		title: "Season 2",
		episodeCount: 13,
		year: 2009
	}],
	"66732": [{
		id: "66732-s1",
		seriesId: "66732",
		seasonNumber: 1,
		title: "Season 1",
		episodeCount: 8,
		year: 2016
	}]
};
function generateEpisodes(seriesId, seasonId, seasonNumber, count, options) {
	return Array.from({ length: count }, (_, i) => ({
		id: `${seasonId}-ep${i + 1}`,
		seriesId,
		seasonId,
		seasonNumber,
		episodeNumber: i + 1,
		title: options.titles[i] ?? `Episode ${i + 1}`,
		description: `The story continues in episode ${i + 1}.`,
		thumbnailUrl: "https://image.tmdb.org/t/p/w500/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg",
		duration: options.avgDuration ?? 24,
		isFiller: options.fillerEps?.includes(i + 1) ?? false,
		audioType: "both",
		introStart: options.hasIntroOutro ? 0 : void 0,
		introEnd: options.hasIntroOutro ? 90 : void 0,
		outroStart: options.hasIntroOutro ? (options.avgDuration ?? 24) * 60 - 90 : void 0,
		outroEnd: options.hasIntroOutro ? (options.avgDuration ?? 24) * 60 : void 0
	}));
}
var episodes = {
	"16498-s1": generateEpisodes("16498", "16498-s1", 1, 25, {
		titles: [
			"To You, in 2000 Years",
			"That Day",
			"A Dim Light Amid Despair",
			"The Night of the Closing Ceremony",
			"First Battle",
			"The World the Girl Saw",
			"Small Blade",
			"I Can Hear His Heartbeat",
			"Where the Left Arm Went",
			"Response",
			"Idol",
			"Wound",
			"Primal Desire",
			"Can't Look Into His Eyes Yet",
			"Special Operations Squad",
			"What Should Be Done",
			"Female Titan",
			"Forest of Giant Trees",
			"Bite",
			"Erwin Smith",
			"Iron Hammer",
			"The Defeated",
			"Smile",
			"Mercy",
			"Wall"
		],
		hasIntroOutro: true
	}),
	"1396-s1": generateEpisodes("1396", "1396-s1", 1, 7, {
		titles: [
			"Pilot",
			"Cat's in the Bag...",
			"...And the Bag's in the River",
			"Cancer Man",
			"Gray Matter",
			"Crazy Handful of Nothin'",
			"A No-Rough-Stuff-Type Deal"
		],
		avgDuration: 47,
		hasIntroOutro: true
	})
};
var allMedia = [
	...movies,
	...anime,
	...tvShows
];
var featuredMedia = allMedia.filter((m) => m.featured);
function getMediaById(id) {
	return allMedia.find((m) => m.id === id || String(m.tmdbId) === id || m.imdbId === id);
}
function getMediaByType(type) {
	return allMedia.filter((m) => m.mediaType === type);
}
function getSeasonsForSeries(seriesId) {
	return seasons[seriesId] ?? [];
}
function getEpisodesForSeason(seasonId) {
	return episodes[seasonId] ?? [];
}
//#endregion
//#region src/lib/api/providers/tmdb.ts
var TMDB_BASE_URL = "https://api.themoviedb.org/3";
var TMDB_IMAGE_BASE_POSTER = "https://image.tmdb.org/t/p/w500";
var TMDB_IMAGE_BASE_BACKDROP = "https://image.tmdb.org/t/p/original";
var TMDB_IMAGE_BASE_PROFILE = "https://image.tmdb.org/t/p/w200";
var TMDB_GENRE_MAP = {
	action: 28,
	adventure: 12,
	animation: 16,
	comedy: 35,
	crime: 80,
	documentary: 99,
	drama: 18,
	family: 10751,
	fantasy: 14,
	history: 36,
	horror: 27,
	music: 10402,
	mystery: 9648,
	romance: 10749,
	"sci-fi": 878,
	"tv-movie": 10770,
	thriller: 53,
	war: 10752,
	western: 37
};
function getTmdbApiKey() {
	const envKey = typeof process !== "undefined" && process.env?.TMDB_API_KEY || typeof import.meta !== "undefined" && "04c35731a5ee918f014970082a0088b1" || "";
	if (envKey && envKey !== "your_api_key_here" && envKey.trim().length > 5) return envKey.trim();
	return "04c35731a5ee918f014970082a0088b1";
}
async function fetchViaHttpsFallback(url) {
	try {
		if (typeof process !== "undefined" && process.versions?.node) {
			const https = await import("node:https");
			return await new Promise((resolve) => {
				https.get(url, { headers: {
					Accept: "application/json",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
				} }, (res) => {
					let data = "";
					res.on("data", (chunk) => data += chunk);
					res.on("end", () => {
						resolve(new Response(data, {
							status: res.statusCode || 200,
							headers: { "Content-Type": "application/json" }
						}));
					});
				}).on("error", () => resolve(null));
			});
		}
	} catch {}
	return null;
}
async function fetchTmdbWithRetry(url, retries = 2) {
	let lastError;
	for (let attempt = 0; attempt <= retries; attempt++) try {
		const res = await fetch(url, { headers: {
			Accept: "application/json",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
		} });
		if (res.ok || res.status === 404) return res;
	} catch (err) {
		lastError = err;
		const fallbackRes = await fetchViaHttpsFallback(url);
		if (fallbackRes && (fallbackRes.ok || fallbackRes.status === 404)) return fallbackRes;
		if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
	}
	const finalFallback = await fetchViaHttpsFallback(url);
	if (finalFallback && (finalFallback.ok || finalFallback.status === 404)) return finalFallback;
	throw lastError || /* @__PURE__ */ new Error(`Failed to fetch ${url}`);
}
function formatTmdbMovie(raw, genreList = genres) {
	const tmdbId = Number(raw.id);
	const releaseDate = raw.release_date || "";
	const year = releaseDate ? parseInt(releaseDate.slice(0, 4), 10) : 2024;
	const rating = raw.vote_average ? Math.round(raw.vote_average * 10) / 10 : 0;
	let itemGenres = [];
	if (Array.isArray(raw.genres)) itemGenres = raw.genres.map((g) => ({
		id: `g-${g.id}`,
		name: g.name,
		slug: g.name.toLowerCase().replace(/\s+/g, "-")
	}));
	else if (Array.isArray(raw.genre_ids)) itemGenres = raw.genre_ids.map((gid) => {
		const found = Object.entries(TMDB_GENRE_MAP).find(([, id]) => id === gid);
		if (found) return genreList.find((g) => g.slug === found[0]) || {
			id: `g-${gid}`,
			name: found[0],
			slug: found[0]
		};
		return null;
	}).filter(Boolean);
	const posterUrl = raw.poster_path ? `${TMDB_IMAGE_BASE_POSTER}${raw.poster_path}` : raw.posterUrl || "https://picsum.photos/seed/placeholder/400/600";
	const backdropUrl = raw.backdrop_path ? `${TMDB_IMAGE_BASE_BACKDROP}${raw.backdrop_path}` : raw.backdropUrl || posterUrl;
	const badges = ["4K"];
	if (rating >= 7.5) badges.push("HDR");
	if (rating >= 8.2) badges.push("Dolby Atmos");
	let director;
	let writers = [];
	let cast = [];
	if (raw.credits) {
		if (Array.isArray(raw.credits.crew)) {
			const dirObj = raw.credits.crew.find((c) => c.job === "Director");
			if (dirObj) director = dirObj.name;
			writers = raw.credits.crew.filter((c) => c.job === "Writer" || c.job === "Screenplay" || c.department === "Writing").map((c) => c.name).slice(0, 3);
		}
		if (Array.isArray(raw.credits.cast)) cast = raw.credits.cast.slice(0, 8).map((c) => ({
			id: `c-${c.id}`,
			name: c.name,
			character: c.character || "Cast",
			image: c.profile_path ? `${TMDB_IMAGE_BASE_PROFILE}${c.profile_path}` : void 0
		}));
	}
	let trailerUrl;
	if (raw.videos && Array.isArray(raw.videos.results)) {
		const trailer = raw.videos.results.find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
		if (trailer?.key) trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
	}
	const imdbId = raw.external_ids?.imdb_id || raw.imdb_id || void 0;
	return {
		id: String(tmdbId),
		tmdbId,
		imdbId,
		title: raw.title || raw.original_title || "Untitled",
		description: raw.overview || "No synopsis available.",
		posterUrl,
		backdropUrl,
		mediaType: "movie",
		year,
		rating,
		voteCount: raw.vote_count,
		releaseDate,
		tagline: raw.tagline,
		duration: raw.runtime || 120,
		badges,
		genres: itemGenres.length > 0 ? itemGenres : [{
			id: "g-movie",
			name: "Movie",
			slug: "movie"
		}],
		director,
		writers,
		productionCompanies: raw.production_companies?.map((p) => p.name).slice(0, 3),
		cast: cast.length > 0 ? cast : void 0,
		trailerUrl: trailerUrl || raw.trailerUrl,
		imdbRating: rating,
		featured: rating >= 8
	};
}
async function fetchMovies(options = {}) {
	const { page = 1, query, genre, year, minRating, sortBy = "popular" } = options;
	const apiKey = getTmdbApiKey();
	try {
		let endpoint = "";
		const params = new URLSearchParams({
			api_key: apiKey,
			page: String(page),
			include_adult: "false"
		});
		if (query && query.trim()) endpoint = `${TMDB_BASE_URL}/search/movie?${params.toString()}&query=${encodeURIComponent(query.trim())}`;
		else {
			let tmdbSort = "popularity.desc";
			if (sortBy === "rating") {
				tmdbSort = "vote_average.desc";
				params.set("vote_count.gte", "100");
			} else if (sortBy === "latest") tmdbSort = "primary_release_date.desc";
			else if (sortBy === "oldest") tmdbSort = "primary_release_date.asc";
			else if (sortBy === "alphabetical") tmdbSort = "original_title.asc";
			params.set("sort_by", tmdbSort);
			if (genre) {
				const gid = TMDB_GENRE_MAP[genre.toLowerCase()] || Number(genre);
				if (gid) params.set("with_genres", String(gid));
			}
			if (year) params.set("primary_release_year", String(year));
			if (minRating) params.set("vote_average.gte", String(minRating));
			endpoint = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
		}
		const res = await fetchTmdbWithRetry(endpoint, 2);
		if (res.ok) {
			const json = await res.json();
			const items = (json.results || []).map((m) => formatTmdbMovie(m));
			return {
				items,
				page: json.page || page,
				totalPages: json.total_pages || 1,
				totalResults: json.total_results || items.length,
				source: "tmdb"
			};
		}
	} catch (err) {
		console.warn("TMDB fetch encountered error, using local fallback:", err);
	}
	let list = [...movies];
	if (query) {
		const q = query.toLowerCase();
		list = list.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.genres.some((g) => g.name.toLowerCase().includes(q)));
	}
	if (genre) list = list.filter((m) => m.genres.some((g) => g.slug === genre));
	if (year) list = list.filter((m) => m.year === year);
	if (minRating) list = list.filter((m) => m.rating >= minRating);
	switch (sortBy) {
		case "rating":
			list.sort((a, b) => b.rating - a.rating);
			break;
		case "latest":
			list.sort((a, b) => b.year - a.year);
			break;
		case "oldest":
			list.sort((a, b) => a.year - b.year);
			break;
		case "alphabetical":
			list.sort((a, b) => a.title.localeCompare(b.title));
			break;
		default: list.sort((a, b) => b.rating - a.rating);
	}
	const pageSize = 12;
	const startIndex = (page - 1) * pageSize;
	return {
		items: list.slice(startIndex, startIndex + pageSize),
		page,
		totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
		totalResults: list.length,
		source: "catalog"
	};
}
async function fetchMovieDetails(id) {
	const apiKey = getTmdbApiKey();
	const idStr = String(id).trim();
	if (apiKey) try {
		let tmdbId = idStr;
		if (idStr.startsWith("tt")) {
			const findRes = await fetchTmdbWithRetry(`${TMDB_BASE_URL}/find/${idStr}?api_key=${apiKey}&external_source=imdb_id`, 2);
			if (findRes.ok) {
				const firstMovie = (await findRes.json()).movie_results?.[0];
				if (firstMovie) tmdbId = String(firstMovie.id);
			}
		}
		const res = await fetchTmdbWithRetry(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${apiKey}&append_to_response=credits,videos,external_ids`, 2);
		if (res.ok) {
			const formatted = formatTmdbMovie(await res.json());
			return {
				...formatted,
				mediaType: "movie",
				duration: formatted.duration || 120,
				director: formatted.director || "Unknown Director"
			};
		}
	} catch (err) {
		console.warn("Failed to fetch TMDB movie details, falling back:", err);
	}
	const found = movies.find((m) => m.id === idStr || String(m.tmdbId) === idStr || m.imdbId === idStr);
	if (found) return {
		...found,
		mediaType: "movie",
		duration: found.duration || 120,
		director: found.director || "Unknown Director"
	};
	return null;
}
var tmdbProvider = {
	fetchMovies,
	fetchMovieDetails,
	getTmdbApiKey
};
//#endregion
export { genres as a, getMediaByType as c, tvShows as d, featuredMedia as i, getSeasonsForSeries as l, tmdbProvider as n, getEpisodesForSeason as o, allMedia as r, getMediaById as s, getTmdbApiKey as t, movies as u };
