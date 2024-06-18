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
});
