
/*global LoadSpec, TimeMap, describe */
/*jslint es6 */

(function () {

"use strict";

function setUpPage() {
    LoadSpec.tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                type: "jsonp",
                options: { url: "data/data.js?cb=" }
            }
        ]
    });
}

function dataloader(args) {
    if ( args.url.indexOf("data/data.js?cb=") >= 0 ) {
//        TimeMap.loaders.cb._0([/*json*/]);
        // it looks like there's only one loader at a time, so this should work
        Object.values(TimeMap.loaders.cb)[0]([
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
        ]);
    } else {
        throw 'incorrect url';
    }
}

describe("jsonp loading", function() {
    LoadSpec.specs(setUpPage,dataloader);
});

}());
