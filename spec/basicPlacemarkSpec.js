function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                data: {
                    type: "basic",
                    value: values
                }
            }
        ]
    });
    correctMultiplePlacemarkCount = 3; // 4; -- omit overlay until I can make it work
}
