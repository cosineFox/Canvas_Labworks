<script lang="ts">
	let { data } = $props();

	function getCurrentHourData(param: string): string | number {
		if (!data.weather?.hourly?.[param] || !data.weather?.hourly?.time) return '--';
		const nowStr = new Date().toISOString().slice(0, 13);
		const index = data.weather.hourly.time.findIndex((t: string) => t.startsWith(nowStr));
		const val = index !== -1
			? data.weather.hourly[param][index]
			: data.weather.hourly[param][data.weather.hourly[param].length - 1];
		if (typeof val === 'object') return JSON.stringify(val);
		return val ?? '--';
	}
</script>

<svelte:head>
	<title>~*~ WEATHER DASHBOARD ~*~ Real-time Data ~*~</title>
</svelte:head>

<div class="page">
	<!-- Header -->
	<div class="header">
		<h1 class="title">
			<span class="rainbow-text">~*~ WEATHER DASHBOARD ~*~</span>
		</h1>
		<p class="subtitle">Real-time Environmental Monitoring - Tronoh, Malaysia</p>
	</div>

	<!-- Navigation -->
	<div class="nav-container">
		<table class="nav-table" cellpadding="5" cellspacing="0">
			<tr>
				<td class="nav-cell"><a href="/main">HOME</a></td>
				<td class="nav-cell"><a href="/imageworks">IMAGEWORKS</a></td>
				<td class="nav-cell"><a href="/maker">MAKER</a></td>
				<td class="nav-cell active"><a href="/maker/dashboard">WEATHER</a></td>
			</tr>
		</table>
	</div>

	<!-- News Ticker -->
	<marquee class="ticker" scrollamount="4">
		{#each data.news as item}
			*** {item} ***
		{/each}
	</marquee>

	<!-- Content -->
	<div class="content">
		{#if data.weather}
			<!-- Two Column Grid -->
			<table class="grid-table" cellpadding="10" cellspacing="10">
				<tr>
					<!-- Atmosphere -->
					<td class="grid-cell">
						<table class="section-table" cellpadding="5" cellspacing="0" width="100%">
							<tr><td class="section-header">ATMOSPHERE.DAT</td></tr>
							<tr><td>
								<table class="data-table" width="100%">
									<tr><td>Temp (2m)</td><td>{data.weather.current.temperature_2m}°C</td></tr>
									<tr><td>Apparent</td><td>{data.weather.current.apparent_temperature}°C</td></tr>
									<tr><td>Pressure</td><td>{data.weather.current.surface_pressure} hPa</td></tr>
									<tr><td>Humidity</td><td>{data.weather.current.relative_humidity_2m}%</td></tr>
									<tr><td>Cloud Cover</td><td>{data.weather.current.cloud_cover}%</td></tr>
									<tr><td>Visibility</td><td>{getCurrentHourData('visibility')} m</td></tr>
								</table>
							</td></tr>
						</table>
					</td>

					<!-- Solar -->
					<td class="grid-cell">
						<table class="section-table" cellpadding="5" cellspacing="0" width="100%">
							<tr><td class="section-header">SOLAR.DAT</td></tr>
							<tr><td>
								<table class="data-table" width="100%">
									<tr><td>UV Index</td><td>{getCurrentHourData('uv_index')}</td></tr>
									<tr><td>UV Clear Sky</td><td>{getCurrentHourData('uv_index_clear_sky')}</td></tr>
									<tr><td>Shortwave</td><td>{getCurrentHourData('shortwave_radiation_instant')} W/m²</td></tr>
									<tr><td>Direct Normal</td><td>{getCurrentHourData('direct_normal_irradiance_instant')} W/m²</td></tr>
									<tr><td>Diffuse</td><td>{getCurrentHourData('diffuse_radiation_instant')} W/m²</td></tr>
								</table>
							</td></tr>
						</table>
					</td>
				</tr>

				<tr>
					<!-- Wind -->
					<td class="grid-cell">
						<table class="section-table" cellpadding="5" cellspacing="0" width="100%">
							<tr><td class="section-header">WIND.DAT</td></tr>
							<tr><td>
								<table class="data-table" width="100%">
									<tr><td>Wind (10m)</td><td>{data.weather.current.wind_speed_10m} km/h</td></tr>
									<tr><td>Wind (80m)</td><td>{getCurrentHourData('wind_speed_80m')} km/h</td></tr>
									<tr><td>Wind (120m)</td><td>{getCurrentHourData('wind_speed_120m')} km/h</td></tr>
									<tr><td>Gusts</td><td>{data.weather.current.wind_gusts_10m} km/h</td></tr>
								</table>
							</td></tr>
						</table>
					</td>

					<!-- Stability -->
					<td class="grid-cell">
						<table class="section-table" cellpadding="5" cellspacing="0" width="100%">
							<tr><td class="section-header">STABILITY.DAT</td></tr>
							<tr><td>
								<table class="data-table" width="100%">
									<tr><td>CAPE</td><td>{getCurrentHourData('cape')} J/kg</td></tr>
									<tr><td>Lifted Index</td><td>{getCurrentHourData('lifted_index')}</td></tr>
									<tr><td>Conv. Inhibition</td><td>{getCurrentHourData('convective_inhibition')} J/kg</td></tr>
									<tr><td>Freezing Lvl</td><td>{getCurrentHourData('freezing_level_height')} m</td></tr>
								</table>
							</td></tr>
						</table>
					</td>
				</tr>
			</table>

			<!-- Wide Sections -->
			<!-- Soil -->
			<table class="section-table" cellpadding="10" cellspacing="0">
				<tr><td class="section-header">SOIL.DAT - Agronomy Data</td></tr>
				<tr><td>
					<table class="data-table" width="100%">
						<tr>
							<td>Soil Temp 0cm</td><td>{getCurrentHourData('soil_temperature_0cm')}°C</td>
							<td>Moisture 0-1cm</td><td>{getCurrentHourData('soil_moisture_0_to_1cm')} m³/m³</td>
						</tr>
						<tr>
							<td>Soil Temp 6cm</td><td>{getCurrentHourData('soil_temperature_6cm')}°C</td>
							<td>Moisture 1-3cm</td><td>{getCurrentHourData('soil_moisture_1_to_3cm')} m³/m³</td>
						</tr>
						<tr>
							<td>Evapotranspiration</td><td colspan="3">{getCurrentHourData('et0_fao_evapotranspiration')} mm</td>
						</tr>
					</table>
				</td></tr>
			</table>

			<!-- Air Quality -->
			<table class="section-table" cellpadding="10" cellspacing="0">
				<tr><td class="section-header">AIR_QUALITY.DAT (AQI: <font color="#00FF00">{data.air?.current?.us_aqi ?? '--'}</font>)</td></tr>
				<tr><td>
					<table class="data-table" width="100%">
						<tr>
							<td>PM2.5 / PM10</td>
							<td>{data.air?.current?.pm2_5 ?? '--'} / {data.air?.current?.pm10 ?? '--'} µg/m³</td>
							<td>Ozone (O3)</td>
							<td>{data.air?.current?.ozone ?? '--'} µg/m³</td>
						</tr>
						<tr>
							<td>NO2 / SO2</td>
							<td>{data.air?.current?.nitrogen_dioxide ?? '--'} / {data.air?.current?.sulphur_dioxide ?? '--'}</td>
							<td>CO</td>
							<td>{data.air?.current?.carbon_monoxide ?? '--'} µg/m³</td>
						</tr>
					</table>
				</td></tr>
			</table>

			<!-- Seismic -->
			<table class="section-table" cellpadding="10" cellspacing="0">
				<tr><td class="section-header">SEISMIC.DAT - Global Earthquake Activity</td></tr>
				<tr><td>
					{#if data.quakes.length > 0}
						<table class="data-table quake-table" width="100%">
							{#each data.quakes as quake}
								<tr class="quake-row">
									<td class="quake-loc">{quake.properties.place}</td>
									<td class="quake-mag">M{quake.properties.mag}</td>
								</tr>
							{/each}
						</table>
					{:else}
						<p>No recent earthquake data available</p>
					{/if}
				</td></tr>
			</table>

		{:else}
			<table class="section-table" cellpadding="20" cellspacing="0">
				<tr><td class="section-header">ERROR.LOG</td></tr>
				<tr><td align="center">
					<p class="error"><span class="blink">*** DATA FETCH ERROR ***</span></p>
					<p>Please try again later</p>
				</td></tr>
			</table>
		{/if}

		<!-- Footer -->
		<div class="footer">
			<hr class="rainbow-hr">
			<p>Last fetched: {new Date(data.fetchedAt).toLocaleString()} | Source: Open-Meteo API</p>
			<p><a href="/maker">&lt;&lt; Back to Maker</a></p>
			<hr class="rainbow-hr">
		</div>
	</div>
</div>

<style>
	/* Geocities Theme */
	.page {
		min-height: 100vh;
		background: #000033 url('data:image/gif;base64,R0lGODlhCgAKAIABAP///wAAACH5BAEKAAEALAAAAAAKAAoAAAIRjI+py+0Po5y02ouz3rz7DxYAOw==') repeat;
		color: #FFFFFF;
		font-family: 'Courier New', monospace;
		font-size: 12px;
	}

	.header {
		text-align: center;
		padding: 15px;
		background: linear-gradient(to bottom, #000066, #000033);
		border-bottom: 3px solid #FFFF00;
	}

	.title {
		font-size: 24px;
		margin: 0;
		text-shadow: 2px 2px #FF00FF;
	}

	.rainbow-text {
		background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.subtitle {
		color: #FFFF00;
		font-size: 12px;
		margin-top: 5px;
	}

	/* Navigation */
	.nav-container {
		text-align: center;
		padding: 8px;
		background: #000066;
	}

	.nav-table {
		margin: 0 auto;
		border: 2px solid #FFFF00;
		background: #000033;
	}

	.nav-cell {
		padding: 4px 12px;
		border: 1px solid #0066FF;
	}

	.nav-cell a {
		color: #00FFFF;
		font-weight: bold;
		text-decoration: none;
		font-size: 11px;
	}

	.nav-cell a:hover { color: #FFFF00; }
	.nav-cell.active { background: #0066FF; }
	.nav-cell.active a { color: #FFFFFF; }

	/* Ticker */
	.ticker {
		background: #AA0000;
		color: #FFFF00;
		padding: 4px;
		font-weight: bold;
		font-size: 11px;
		border-top: 2px solid #FFFF00;
		border-bottom: 2px solid #FFFF00;
	}

	.content {
		max-width: 900px;
		margin: 0 auto;
		padding: 15px;
	}

	/* Grid */
	.grid-table {
		width: 100%;
		margin-bottom: 15px;
	}

	.grid-cell {
		width: 50%;
		vertical-align: top;
	}

	/* Section Tables */
	.section-table {
		width: 100%;
		margin-bottom: 15px;
		border: 2px solid #0066FF;
		background: #000066;
	}

	.section-header {
		background: linear-gradient(to right, #0066FF, #000066);
		color: #FFFF00;
		font-weight: bold;
		padding: 6px;
		border-bottom: 2px solid #FFFF00;
	}

	/* Data Table */
	.data-table {
		background: #000033;
		border-collapse: collapse;
	}

	.data-table td {
		padding: 4px 8px;
		border: 1px solid #003366;
	}

	.data-table td:nth-child(odd) {
		color: #00FFFF;
		width: 40%;
	}

	.data-table td:nth-child(even) {
		color: #00FF00;
	}

	/* Quake */
	.quake-table .quake-row:hover {
		background: #660000;
	}

	.quake-loc {
		color: #FFFFFF !important;
	}

	.quake-mag {
		color: #FF6666 !important;
		font-weight: bold;
		text-align: right;
		width: 80px !important;
	}

	.error {
		color: #FF6666;
		font-size: 16px;
	}

	/* Footer */
	.footer {
		text-align: center;
		margin-top: 20px;
		font-size: 11px;
		color: #808080;
	}

	.footer a {
		color: #00FFFF;
	}

	.footer a:hover {
		color: #FFFF00;
	}

	.rainbow-hr {
		height: 4px;
		border: none;
		background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF);
	}

	.blink {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}

	@media (max-width: 700px) {
		.grid-cell {
			display: block;
			width: 100%;
		}
	}
</style>
