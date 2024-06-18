$(document).ready(function() {
	const selectedAmenities = {};

	$('input[type="checkbox"]').change(function() {
		if ($(this).is(':checked')) {
			selectedAmenities[$(this).data('id')] = $(this).data('name');
		} else {
			delete selectedAmenities[$(this).data('id')];
		}
		const amenityNames = Object.values(selectedAmenities).join(', ');
		$('.amenities h4').text(amenityNames);
	});

	$.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
		if (data.status === 'OK') {
			$('#api_status').addClass('available');
		} else {
			$('#api_status').removeClass('available');
		}
	});

	function fetchPlaces(amenities = {}) {
		$.ajax({
			url: 'http://0.0.0.0:5001/api/v1/places_search/',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ amenities: Object.keys(amenities) }}),
			success: function(data) {
				$('section.places').empty();
				for (const place of data) {
				const article = `
				<article>
				<div class="title_box">
				<h2>${place.name}</h2>
				<div class="price_by_night">$${place.price_by_night}</div>
				</div>
				<div class="information">
				<div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
				<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
				<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
					</div>
					<div class="description">
					${place.description}
				</div>
					</article>
					`;
				$('section.places').append(article);
			}
		}
	});
}

$('button').click(function() {
	fetchPlaces(selectedAmenities);
});

fetchPlaces();
});
