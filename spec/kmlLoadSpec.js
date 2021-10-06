
function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                type: "kml",
                options: { url: "data/data.kml" }
            }
        ]
    });
}

function dataloader(args) {
    if ( args.url.indexOf("data/data.kml") >= 0 ) {
        args.success($.parseXML(`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.1"><Document><Placemark><Point><coordinates>12.345,23.456</coordinates></Point><name>Test Event</name><TimeSpan><begin>1980-01-02</begin><end>2000-01-02</end></TimeSpan><description>Test Description</description></Placemark><Placemark><LineString><coordinates>-110.45,45.256 -109.48,46.46 -109.86,43.84</coordinates></LineString><name>Test Event 2</name><TimeStamp><when>1980-01-02</when></TimeStamp></Placemark></Document></kml>
`));
    } else {
        throw 'illegal argument';
    }
}
