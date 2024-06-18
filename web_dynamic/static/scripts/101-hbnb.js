$(document).ready(function() {
	const selectedAmenities = {};
	const selectedStates = {};
	const selectedCities = {};

	$('input[type="checkbox"]').change(function() {
		const type = $(this).closest('div').attr('class');
		const id = $(this).data('id');
		const name = $(this).data('name');

		if ($(this).is(':checked')) {
			if (type === 'amenities') {
				selectedAmenities[id] = name;
			} else if (type === 'locations') {
				if ($(this).parent().parent().is('ul')) {
					selectedCities[id] = name;
				} else {
					selectedStates[id] = name;
				}
			}
		} else {
			if (type === 'amenities') {
				delete selectedAmenities[id];
			} else if (type === 'locations') {
				if ($(this).parent().parent().is('ul')) {
					delete selectedCities[id];
				} else {
					delete selectedStates[id];
				}
			}
		}

		const amenityNames = Object.values(selectedAmenities).join(', ');
		const locationNames = [...Object.values(selectedStates), ...Object.values(selectedCities)].join(', ');

		$('.amenities h4').text(amenityNames);
		$('.locations h4').text(locationNames);
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
			data: JSON.stringify(filters),
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

				$('.show-hide').click(function() {
					const $reviewsDiv = $(this).parent().next('.reviews');
					if ($(this).text() === 'show') {
						$.get(`http://0.0.0.0:5001/api/v1/places/${place.id}/reviews`, function(data) {
							$reviewsDiv.empty();
							for (const review of data) {
							const reviewHTML = `
							<div class="review">
							<h3>
							From ${review.user.first_name} ${review.user.last_name} on ${new Date(review.created_at).toLocaleString()}</h3>
							<p>${review.text}</p>
							</div>
							`;
							$reviewsDiv.append(reviewHTML);
							}
							$(this).text('hide');
						}.bind(this));
					} else {
						$reviewsDiv.empty();
						$(this).text('show');
					}
				});
			}
		});
	}

	$('button').click(function() {
	const filters = {
		amenities: Object.keys(selectedAmenities),
		states: Object.keys(selectedStates),
		cities: Object.keys(selectedCities)
	};
	fetchPlaces(filters);
});

fetchPlaces();
});
