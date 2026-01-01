import type { PageServerLoad } from './$types';

const LOCATION = { lat: 4.359, lon: 100.9849 };
const TIMEZONE = 'Asia/Singapore';

// Cache for weather data (5 minutes)
let weatherCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

export const load: PageServerLoad = async ({ setHeaders }) => {
	const now = Date.now();

	// Check cache
	if (weatherCache && now - weatherCache.timestamp < CACHE_DURATION) {
		setHeaders({
			'cache-control': 'public, max-age=300'
		});
		return weatherCache.data;
	}

	try {
		// Weather API parameters
		const weatherParams = new URLSearchParams({
			latitude: LOCATION.lat.toString(),
			longitude: LOCATION.lon.toString(),
			past_days: '5',
			models: 'best_match',
			current: [
				'temperature_2m',
				'relative_humidity_2m',
				'apparent_temperature',
				'is_day',
				'precipitation',
				'rain',
				'showers',
				'snowfall',
				'weather_code',
				'cloud_cover',
				'pressure_msl',
				'surface_pressure',
				'wind_speed_10m',
				'wind_direction_10m',
				'wind_gusts_10m'
			].join(','),
			hourly: [
				'temperature_2m',
				'relative_humidity_2m',
				'dew_point_2m',
				'apparent_temperature',
				'precipitation_probability',
				'precipitation',
				'rain',
				'showers',
				'snowfall',
				'snow_depth',
				'weather_code',
				'pressure_msl',
				'surface_pressure',
				'cloud_cover',
				'cloud_cover_low',
				'cloud_cover_mid',
				'cloud_cover_high',
				'visibility',
				'evapotranspiration',
				'et0_fao_evapotranspiration',
				'vapour_pressure_deficit',
				'wind_speed_10m',
				'wind_speed_80m',
				'wind_speed_120m',
				'wind_speed_180m',
				'wind_direction_10m',
				'wind_direction_80m',
				'wind_direction_120m',
				'wind_direction_180m',
				'wind_gusts_10m',
				'temperature_80m',
				'temperature_120m',
				'temperature_180m',
				'soil_temperature_0cm',
				'soil_temperature_6cm',
				'soil_temperature_18cm',
				'soil_temperature_54cm',
				'soil_moisture_0_to_1cm',
				'soil_moisture_1_to_3cm',
				'soil_moisture_3_to_9cm',
				'soil_moisture_9_to_27cm',
				'soil_moisture_27_to_81cm',
				'uv_index',
				'uv_index_clear_sky',
				'is_day',
				'sunshine_duration',
				'wet_bulb_temperature_2m',
				'total_column_integrated_water_vapour',
				'cape',
				'lifted_index',
				'convective_inhibition',
				'freezing_level_height',
				'boundary_layer_height',
				'shortwave_radiation',
				'direct_radiation',
				'diffuse_radiation',
				'direct_normal_irradiance',
				'global_tilted_irradiance',
				'terrestrial_radiation',
				'shortwave_radiation_instant',
				'direct_radiation_instant',
				'diffuse_radiation_instant',
				'direct_normal_irradiance_instant',
				'global_tilted_irradiance_instant',
				'terrestrial_radiation_instant',
				'temperature_600hPa',
				'relative_humidity_600hPa',
				'cloud_cover_600hPa',
				'wind_speed_600hPa',
				'wind_direction_600hPa',
				'geopotential_height_600hPa'
			].join(','),
			daily: 'uv_index_max',
			timezone: TIMEZONE
		});

		// Air Quality API parameters
		const airParams = new URLSearchParams({
			latitude: LOCATION.lat.toString(),
			longitude: LOCATION.lon.toString(),
			current: [
				'us_aqi',
				'pm10',
				'pm2_5',
				'carbon_monoxide',
				'nitrogen_dioxide',
				'sulphur_dioxide',
				'ozone',
				'aerosol_optical_depth',
				'dust',
				'uv_index'
			].join(','),
			timezone: TIMEZONE
		});

		// Fetch all data in parallel
		const [weatherRes, airRes, quakeRes] = await Promise.allSettled([
			fetch(`https://api.open-meteo.com/v1/forecast?${weatherParams.toString()}`),
			fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${airParams.toString()}`),
			fetch(
				`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${new Date().toISOString().split('T')[0]}&minmagnitude=4&limit=5&orderby=time`
			)
		]);

		const weather = weatherRes.status === 'fulfilled' ? await weatherRes.value.json() : null;
		const air = airRes.status === 'fulfilled' ? await airRes.value.json() : null;
		const quakeJson =
			quakeRes.status === 'fulfilled' ? await quakeRes.value.json() : { features: [] };

		// Generate news feed
		const news: string[] = [];
		if (weather?.current) {
			const cur = weather.current;
			if (cur.temperature_2m > 33) {
				news.push(`HEAT ALERT: SURFACE TEMP ${cur.temperature_2m}°C`);
			} else {
				news.push(`AMBIENT TEMP: ${cur.temperature_2m}°C`);
			}

			if (cur.surface_pressure < 1000) {
				news.push(`LOW PRESSURE SYSTEM DETECTED (${cur.surface_pressure}hPa)`);
			}
			if (cur.precipitation > 0) {
				news.push(`PRECIPITATION DETECTED: ${cur.precipitation}mm/h`);
			}
			if (air?.current?.us_aqi > 100) {
				news.push(`HAZE WARNING: AQI ${air.current.us_aqi}`);
			}
		}

		if (quakeJson.features?.length > 0 && quakeJson.features[0]?.properties) {
			news.push(
				`SEISMIC EVENT: M${quakeJson.features[0].properties.mag} ${quakeJson.features[0].properties.place.toUpperCase()}`
			);
		}

		if (news.length === 0) {
			news.push('ALL SYSTEMS NOMINAL. MONITORING...');
		}

		const data = {
			weather,
			air,
			quakes: quakeJson.features || [],
			news,
			fetchedAt: now
		};

		// Update cache
		weatherCache = { data, timestamp: now };

		setHeaders({
			'cache-control': 'public, max-age=300'
		});

		return data;
	} catch (err) {
		console.error('Weather API Error:', err);
		return {
			weather: null,
			air: null,
			quakes: [],
			news: ['DATA FETCH ERROR'],
			fetchedAt: now,
			error: true
		};
	}
};
