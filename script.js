$(document).ready(function() {
    if ("geolocation" in navigator) {
        $('#logButton').click(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                $('#latitude').text(latitude.toFixed(6));
                $('#longitude').text(longitude.toFixed(6));

                sendDataToThingSpeak(latitude, longitude);
            }, function(error) {
                alert('Error occurred: ' + error.message);
            });
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }

    fetchThingSpeakData();
});

function sendDataToThingSpeak(latitude, longitude) {
    var apiUrl = "https://api.thingspeak.com/update?api_key=CK8DIW5ED7KXUJGN&field1=" + latitude + "&field2=" + longitude;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function(response) {
            console.log('Data sent to ThingSpeak successfully.');

            // Display ThingSpeak chart
            displayThingSpeakChart();
        },
        error: function(error) {
            console.log('Error sending data to ThingSpeak: ' + error);
        }
    });
}

function fetchThingSpeakData() {
    var apiUrl = "https://api.thingspeak.com/channels/2527776/feeds.json?api_key=CK8DIW5ED7KXUJGN&results=1";

    $.getJSON(apiUrl, function(data) {
        var feeds = data.feeds;
        if (feeds.length > 0) {
            var latestData = feeds[0];
            $('#tsLatitude').text(latestData.field1);
            $('#tsLongitude').text(latestData.field2);
        } else {
            console.log('No data available from ThingSpeak.');
        }
    });
}

function displayThingSpeakChart() {
    var iframe = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2527776/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>    ';
    $('#thingSpeakChart').html(iframe);
}