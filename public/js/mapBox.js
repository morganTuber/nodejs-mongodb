const MAP_BOX_TOKEN =
	'pk.eyJ1Ijoic2FjaGluNTUiLCJhIjoiY2t3dnVjZGhuMjNzYTJ2bGMxemVyaWd6MCJ9.8HfTVTWt-JrfeeVwmWqeQA'
/**
 *
 * @param {HTMLDivElement} container
 * @param {any[]} locations
 */
export const displayMap = (container, locations) => {
	mapboxgl.accessToken = MAP_BOX_TOKEN
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/sachin55/ckwvuijkn35zq14n24kc85bso',
		scrollZoom: false,
	})

	const bounds = new mapboxgl.LngLatBounds()

	locations.forEach(location => {
		const el = document.createElement('div')
		el.className = 'marker'
		new mapboxgl.Marker({
			element: el,
			anchor: 'bottom',
		})
			.setLngLat(location.coordinates)
			.addTo(map)
		new mapboxgl.Popup({ offset: 30 })
			.setLngLat(location.coordinates)
			.setHTML(`<p>Day ${location.day} : ${location.description}</p>`)
			.addTo(map)
		bounds.extend(location.coordinates)
	})
	map.fitBounds(bounds, {
		padding: {
			top: 200,
			bottom: 200,
			left: 100,
			right: 100,
		},
	})
}
