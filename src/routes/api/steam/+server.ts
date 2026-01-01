import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// IMPORTANT: Set STEAM_API_KEY in your environment variables on Render
// Never commit API keys to source control!
const STEAM_API_KEY = process.env.STEAM_API_KEY;

if (!STEAM_API_KEY) {
	console.warn('STEAM_API_KEY environment variable not set');
}

export const GET: RequestHandler = async ({ url }) => {
	const steamid = url.searchParams.get('steamid');

	if (!steamid) {
		return json({ error: 'Missing steamid parameter' }, { status: 400 });
	}

	if (!STEAM_API_KEY) {
		return json({
			error: 'Steam API not configured',
			games: [],
			profile: null
		}, { status: 503 });
	}

	try {
		// Fetch recent games
		const gamesResponse = await fetch(
			`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamid}&count=10`
		);

		let games: any[] = [];
		if (gamesResponse.ok) {
			const gamesData = await gamesResponse.json();
			games = gamesData.response?.games || [];
		}

		// Fetch player profile
		const profileResponse = await fetch(
			`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamid}`
		);

		let profile = null;
		if (profileResponse.ok) {
			const profileData = await profileResponse.json();
			profile = profileData.response?.players?.[0] || null;
		}

		return json({
			games,
			profile
		}, {
			headers: {
				'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
			}
		});
	} catch (error) {
		console.error('Steam API error:', error);
		return json({ error: 'Failed to fetch Steam data', games: [], profile: null }, { status: 500 });
	}
};
