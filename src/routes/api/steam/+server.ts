import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { STEAM_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {
	const steamid = url.searchParams.get('steamid');

	if (!steamid) {
		return json({ error: 'Missing steamid' }, { status: 400 });
	}

	if (!STEAM_API_KEY) {
		return json({ error: 'Steam API key missing on server' }, { status: 503 });
	}

	try {
		// 1. Fetch Recently Played Games
		const recentRes = await fetch(
			`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamid}&count=10`
		);
		const recentData = await recentRes.json();
		let games = recentData.response?.games || [];

		// 2. Fallback: If no recent games, fetch owned games (this usually includes ALL games)
		if (games.length === 0) {
			const ownedRes = await fetch(
				`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamid}&format=json&include_appinfo=1&include_played_free_games=1`
			);
			if (ownedRes.ok) {
				const ownedData = await ownedRes.json();
				const allGames = ownedData.response?.games || [];
				
				// Sort by playtime_forever descending and take top 5
				games = allGames
					.filter((g: any) => g.name && g.playtime_forever > 0)
					.sort((a: any, b: any) => b.playtime_forever - a.playtime_forever)
					.slice(0, 5);
			}
		}

		// 3. Fetch Player Profile
		const profileRes = await fetch(
			`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamid}`
		);
		const profileData = await profileRes.json();
		const profile = profileData.response?.players?.[0] || null;

		return json({
			games,
			profile,
			timestamp: Date.now()
		}, {
			headers: { 
                'Cache-Control': 'public, max-age=600',
                'Access-Control-Allow-Origin': '*' 
            }
		});
	} catch (error: any) {
		console.error('Steam API Exception:', error.message);
		return json({ error: 'External API failure', games: [] }, { status: 502 });
	}
};