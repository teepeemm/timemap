
/*global TimeMap, LoadSpec, describe */
/*jslint es6 */

(function () {

"use strict";

function setUpPage() {
    const values = [
        {
            "start" : "1980-01-02",
            "end" : "2000-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event",
            "options" : { "description": "Test Description" }
        },{
            "start" : "1980-01-02",
            "polyline" : [
                {
                    "lat" : 45.256,
                    "lon" : -110.45
                },{
                    "lat" : 46.46,
                    "lon" : -109.48
                },{
                    "lat" : 43.84,
                    "lon" : -109.86
                }
            ],
            "title" : "Test Event 2"
        }
    ];
    LoadSpec.tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                // this syntax should still work
                data: {
                    type: "basic",
                    value: values
                }
            }
        ]
    });
}

function dataloader() {
    throw '$.ajax should not be called';
}

describe("basic loading", function() {
    LoadSpec.specs(setUpPage,dataloader);
});

}());
