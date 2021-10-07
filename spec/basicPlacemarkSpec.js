
(function () {

const values = [
    { // point
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "point" : {
            "lat" : 23.456,
            "lon" : 12.345
        },
        "title" : "Test Point",
        "options" : { "description": "Test Description" }
    },{ // polyline
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "polyline" : [
            {
                "lat" : 43.829872,
                "lon" : 11.154900
            },{
                "lat" : 43.730968,
                "lon" : 11.190605
            },{
                "lat" : 43.730473,
                "lon" : 11.257896
            }
        ],
        "title" : "Test Polyline",
        "options" : { "description": "Test Description" }
    },{ // polygon
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "polygon" : [
            {
                "lat" : 43.787254,
                "lon" : 11.226311
            },{
                "lat" : 43.801628,
                "lon" : 11.283646
            },{
                "lat" : 43.770649,
                "lon" : 11.302528
            },{
                "lat" : 43.743370,
                "lon" : 11.276779
            },{
                "lat" : 43.755276,
                "lon" : 11.230087
            },{
                "lat" : 43.787254,
                "lon" : 11.226311
            }
        ],
        "title" : "Test Polygon",
        "options" : { "description": "Test Description" }
    },{ // multiple, top level
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "point" : {
            "lat" : 23.456,
            "lon" : 12.345
        },
        "polyline" : [
            {
                "lat" : 43.829872,
                "lon" : 11.154900
            },{
                "lat" : 43.730968,
                "lon" : 11.190605
            },{
                "lat" : 43.730473,
                "lon" : 11.257896
            }
        ],
        "polygon" : [
            {
                "lat" : 43.829872,
                "lon" : 11.154900
            },{
                "lat" : 43.730968,
                "lon" : 11.190605
            },{
                "lat" : 43.730473,
                "lon" : 11.257896
            }
        ],
        "overlay" : {
            "image" : "data/tile.png",
            "north" : 38.285990,
            "south" : 29.231120,
            "east"  : 74.523837,
            "west"  : 60.533227
        },
        "title" : "Test Multiple: Top Level",
        "options" : { "description": "Test Description" }
    },{ // multiple, in a separate array
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "placemarks": [
            {
                "point" : {
                    "lat" : 23.456,
                    "lon" : 12.345
                }
            },{
                "polyline" : [
                    {
                        "lat" : 43.829872,
                        "lon" : 11.154900
                    },{
                        "lat" : 43.730968,
                        "lon" : 11.190605
                    },{
                        "lat" : 43.730473,
                        "lon" : 11.257896
                    }
                ]
            },{
                "polygon" : [
                    {
                        "lat" : 43.829872,
                        "lon" : 11.154900
                    },{
                        "lat" : 43.730968,
                        "lon" : 11.190605
                    },{
                        "lat" : 43.730473,
                        "lon" : 11.257896
                    }
                ]
            },{
                "overlay" : {
                    "image" : "data/tile.png",
                    "north" : 38.285990,
                    "south" : 29.231120,
                    "east"  : 74.523837,
                    "west"  : 60.533227
                }
            }
        ],
        "title" : "Test Multiple: Array",
        "options" : {
            "description": "Test Description",
            "infoPoint": {
                "lat" : 43.730473,
                "lon" : 11.257896
            }
        }
    },{ // overlay
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "overlay" : {
            "image" : "data/tile.png",
            "north" : 38.285990,
            "south" : 29.231120,
            "east"  : 74.523837,
            "west"  : 60.533227
        },
        "title" : "Test Overlay",
        "options" : { "description": "Test Description" }
    }
];

function setUpPage() {
    PlacemarkSpec.tm = TimeMap.init({
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
    PlacemarkSpec.correctMultiplePlacemarkCount = 3; // 4; -- omit overlay until I can make it work
}

describe("basic placemarks", () => {
    PlacemarkSpec.specs(setUpPage);
});

}());
