
/*global $, expect, describe, TimeMap, beforeAll, it, afterAll */
/*jslint es6, this */

(function () {

"use strict";

let tm;
    
const timeoutInterval = 100,
    maxAttempts = 30,
    items = [
        {
            "start" : "1980-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event 1",
            "options" : {
                "description": "Test Description",
                "extra": "spam",
                "infoTemplate": '<span id="custom">{{title}} - {{description}} - {{extra}}</span>'
            }
        },{
            "start" : "1980-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event 2",
            "options" : {
                // TODO these are not good ways to open the info windows
                // there's no way to close it naturally, only programmatically
                "openInfoWindow": function() {
                    $('body').append('<div id="custom2" class="extrawindows">' + this.opts.title + '<div>');
                },
                "closeInfoWindow": function() {
                    $('#custom2').remove();
                }
            }
        },{
            "start" : "1980-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event 3",
            "options" : {
                "description": "Test Description",
                // TODO bettter opening to allow natural closing
                "openInfoWindow": function() {
                    $('body').append('<div id="custom3" class="extrawindows">' + this.getInfoHtml() + '<div>');
                },
                "closeInfoWindow": function() {
                    $('#custom3').remove();
                }
            }
        }
    ],
    dataset = {
        id: "test",
        type: "basic",
        options: { items: items }
    };

function infoWindowOpen(done,attempts) {
    if ( setupTest() ) {
        done();
    } else if ( attempts < maxAttempts ) {
        setTimeout(infoWindowOpen, timeoutInterval, done, attempts+1);
    } else {
        throw 'took too long to set up';
    }
}

function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [ dataset ]
    });
}

function setupTest() {
    // this is effectively the assertion
    return $('span#custom').length === 1;
}

function expectNoOpenWindows() {
    if ( tm.map.api === 'microsoft' ) {
        expect( $('span#custom').css('visibility') ).toBe("hidden");
    } else {
        expect( $('span#custom').length ).toBe(0);
    }
    expect( $('div.extrawindows').length ).toBe(0);
}

// I'd like itHasNoOpenWindows to be "beforeEach" and "afterEach" describe,
// but then it fires in the wrong order from the inner before/after all.
describe("custom info windows", function() {
    beforeAll(setUpPage);
    describe("info template", function() {
        beforeAll( function(done) {
            expectNoOpenWindows();
            tm.datasets.test.getItems()[0].openInfoWindow();
            infoWindowOpen(done,0);
        });
        it("should have the correct info window", function() {
            expect( setupTest() ).toBeTrue();
            expect( $('span#custom').text() )
                .toBe( 'Test Event 1 - Test Description - spam' );
            tm.datasets.test.getItems()[0].hidePlacemark();
            expectNoOpenWindows();
        });
    });
    describe("custom open", function() {
        it("should open the window", function() {
            expectNoOpenWindows();
            tm.datasets.test.getItems()[1].openInfoWindow();
            expect( $('div#custom2').length ).toBe(1);
            tm.datasets.test.getItems()[1].closeInfoWindow();
            expectNoOpenWindows();
        });
    });
    describe("custom info html", function() {
        it("should have opened the window", function() {
            expectNoOpenWindows();
            tm.datasets.test.getItems()[2].openInfoWindow();
            expect( $('div#custom3').length ).toBe(1);
            expect( $('div#custom3 div.infotitle').text() )
                .toBe( dataset.options.items[2].title );
            expect( $('div#custom3 div.infodescription').text() )
                .toBe( dataset.options.items[2].options.description );
            tm.datasets.test.getItems()[2].closeInfoWindow();
            expectNoOpenWindows();
        });
    });
    afterAll( function() {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

}());
