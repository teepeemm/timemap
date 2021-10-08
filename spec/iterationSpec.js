
/*global TimeMap, describe, beforeAll, it, expect, $, afterAll */
/*jslint es6 */

(function () {

"use strict";

const datasetA = {
        title: "Test Dataset 1",
        id: "test1",
        type: "basic",
        options: {
            items: [
                {
                  "start" : "1980-01-02",
                  "point" : {
                      "lat" : 23.456,
                      "lon" : 12.345
                   },
                  "title" : "Test 2"
                },{
                  "start" : "1980-01-01",
                  "point" : {
                      "lat" : 23.456,
                      "lon" : 12.345
                   },
                  "title" : "Test 1"
                }
            ]
        }
    },
    datasetB = {
        title: "Test Dataset 2",
        id: "test2",
        type: "basic",
        options: {
            items: [
                {
                  "start" : "1980-01-05",
                  "point" : {
                      "lat" : 23.456,
                      "lon" : 12.345
                   },
                  "title" : "Test 4"
                },{
                  "start" : "1980-01-04",
                  "point" : {
                      "lat" : 23.456,
                      "lon" : 12.345
                   },
                  "title" : "Test 3"
                }
            ]
        }
    },
    tmOptions = {
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [ datasetA, datasetB ]
    };

let eventSource, tm;

function setUp() {
    tm = TimeMap.init(tmOptions);
    const eSource = tm.timeline.getBand(0).getEventSource();
    tm.timeline.getBand(0).setCenterVisibleDate(eSource.getEarliestDate());
    tm.showDatasets();
    eventSource = tm.timeline.getBand(0).getEventSource();
}

function flagwith(num) {
    return function (input) { input.flag = num; };
}

describe("iteration tests", function() {
    beforeAll(setUp);
    it("has the right number of items", function() {
        const numItems = tmOptions.datasets
            .map( (ds) => ds.options.items.length ).reduce( (a,b) => a+b );
        expect( eventSource.getCount() ).toBe( numItems );
        expect( tm.getItems().length ).toBe( numItems );
        expect( tm.datasets.test1.getItems().length )
            .toBe( tmOptions.datasets.find( (ds) => ds.id==='test1' )
                        .options.items.length );
        expect( tm.datasets.test2.getItems().length )
            .toBe( tmOptions.datasets.find( (ds) => ds.id==='test2' )
                        .options.items.length );
        expect( tm.datasets.test1.getItems(1).getTitle() )
            .toBe( tmOptions.datasets.find( (ds) => ds.id==='test1' )
                        .options.items[1].title );
    });
    it("has the right next item", function() {
        expect( tm.datasets.test1.getItems(1).getNext() )
            .toBe( tm.datasets.test1.getItems(0) );
        expect( tm.datasets.test1.getItems(0).getNext() )
            .toBe( tm.datasets.test2.getItems(1) );
        expect( tm.datasets.test2.getItems(0).getNext() ).toBeNull();
    });
    it("has the right previous item", function() {
        // getPrev requires Timeline 2.2.0+
        const timelineVersion = TimeMap.util.TimelineVersion();
        if ( 2.2 <= Number(timelineVersion.replace(/^\D*(\d(\.\d)).*$/,'$1')) ) {
            expect( tm.datasets.test1.getItems(0).getPrev() )
                .toBe( tm.datasets.test1.getItems(1) );
            expect( tm.datasets.test2.getItems(1).getPrev() )
                .toBe( tm.datasets.test1.getItems(0) );
            expect( tm.datasets.test1.getItems(1).getPrev() ).toBeNull();
//        } else {
//            expect( tm.datasets.test1.getItems(0).getPrev ).toBeUndefined();
        }
    });
    it("can flag each item in a dataset", function() {
        tm.datasets.test1.each(flagwith(1));
        expect( tm.datasets.test1.getItems().every( (item) => item.flag===1 ) )
            .toBeTrue();
    });
    it("can flag each item in the timemap", function() {
        tm.eachItem(flagwith(2));
        expect( tm.getItems().every( (item) => item.flag===2 ) ).toBeTrue();
    });
    it("can flag each dataset", function() {
        tm.each(flagwith(3));
        expect( Object.values(tm.datasets).every( (ds) => ds.flag===3 ) )
            .toBeTrue();
    });
    afterAll( function() {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

}());
