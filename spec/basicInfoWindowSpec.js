
/*global TimeMap, $, describe, expect, beforeAll, it, afterAll */
/*jslint es6, this */

(function () {

"use strict";

let tm;
    
const timeoutInterval = 100,
    maxAttempts = 30,
    dataset = {
        id: "test",
        type: "basic",
        options: {
            items: [
                {
                    "start" : "1980-01-02",
                    "point" : {
                        "lat" : 23.456,
                        "lon" : 12.345
                    },
                    "title" : "Test Event",
                    "options" : { "description": "Test Description" }
                }
            ]
        }
    };

function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [ dataset ]
    });
}

function windowIsOpen() {
    // this is effectively the assertion
    return $('div.infotitle, div.infodescription').length === 2;
}

function testWindowOpen(done,attempts) {
    if ( windowIsOpen() ) {
        done();
    } else if ( attempts < maxAttempts ) {
        setTimeout(testWindowOpen, timeoutInterval, done, attempts+1);
    } else {
        throw 'took too long';
    }
}

function openWindow(done) {
    tm.datasets.test.getItems()[0].openInfoWindow();
    testWindowOpen(done,0);
}

function expectNoWindowsOpen() {
    if ( tm.map.api === "microsoft" ) {
        expect( $("div.infotitle").css("visibility") ).toBe( "hidden" );
        expect( $("div.infodescription").css("visibility") )
            .toBe( "hidden" );
    } else {
        expect( $('div.infotitle, div.infodescription').length ).toBe(0);
    }
}

describe("basic info window", function() {
    beforeAll(setUpPage);
    describe("default open", function() {
        beforeAll( function(done) {
            expectNoWindowsOpen();
            openWindow(done);
        });
        it("should find the info window divs", function() {
            expect( windowIsOpen() ).toBeTrue();
            expect( $('div.infotitle').text() )
                .toBe( dataset.options.items[0].title );
            expect( $('div.infodescription').text() )
                .toBe( dataset.options.items[0].options.description );
            tm.datasets.test.getItems()[0].closeInfoWindow();
            expectNoWindowsOpen();
        });
    });
    afterAll( function() {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

}());
