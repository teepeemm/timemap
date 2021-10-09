
/*global TimeMap, describe, beforeAll, it, expect, afterAll, $ */
/*jslint es6 */

(function () {

"use strict";

const items = [
        {
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event 1",
            "options" : { "description": "Test Description" }
        },{ // missing event
            "point" : {
                "lat" : 23.456,
                "lon" : 12.3453
            },
            "title" : "Test Event 2",
            "options" : { "description": "Test Description" }
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "title" : "missing placemark",
            "options" : { "description": "Test Description" }
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "title" : "missing point data",
            "point" : {}
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "title" : "missing polygon data",
            "polygon" : []
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "title" : "empty placemark array",
            "placemarks" : []
        }
    ],
    tmOptions = {
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                type: "basic",
                options: { items: items }
            }
        ]
    };

let tm;

function setUp() {
    tm = TimeMap.init(tmOptions);
    const eventSource = tm.timeline.getBand(0).getEventSource();
    tm.timeline.getBand(0).setCenterVisibleDate(eventSource.getEarliestDate());
    tm.showDatasets();
}

describe("missing element tests", function() {
    beforeAll(setUp);
    it("has the right number of items", function() {
        const tmItems = tm.datasets.test.getItems();
        expect( tmItems.length )
            .toBe( tmOptions.datasets[0].options.items.length );
    });
    it("has the right number of events", function() {
        const tmItems = tm.datasets.test.getItems();
        expect( tm.datasets.test.eventSource.getCount() )
            .toBe( tmOptions.datasets[0].options.items
                    .filter( (item) => item.start ).length );
        expect( tmItems.filter( (item) => !item.event ).length ).toBe(1);
        expect( tmItems.findIndex( (item) => !item.event ) ).toBe(1);
    });
    it("has the right number of placemarks", function() {
        const tmItems = tm.datasets.test.getItems();
        expect( tmItems.filter( (item) => item.placemark ).length ).toBe(2);
        expect( tmItems[0].placemark ).toBeDefined();
        expect( tmItems[1].placemark ).toBeDefined();
    });
    afterAll( function() {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});
// how else should we check the missing data?

}());
