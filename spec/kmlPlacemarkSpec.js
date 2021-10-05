function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset: KML",
                id: "test",
                type: "kml",
                options: {
                    url: "data/placemarks.kml"
                }
            }
        ]
    });
    correctMultiplePlacemarkCount = 3; // no overlay possible in KML
    setUpPageStatus = "complete";
}
