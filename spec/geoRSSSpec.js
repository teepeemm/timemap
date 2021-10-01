
jasmine.getEnv().configure({ random: false });

const tmHolder = {};

tmHolder.tmOptions = {
    mapId: "map",               // Id of map div element (required)
    timelineId: "timeline",     // Id of timeline div element (required)
    datasets: [
        {
            title: "Test Dataset: RSS",
            id: "rss",
            type: "georss",
            options: {
                url: "../tests/data/data.rss"
            }
        },{
            title: "Test Dataset: Atom",
            id: "atom",
            type: "georss",
            options: {
                url: "../tests/data/data-atom.xml"
            }
        },{
            title: "Test Dataset: RSS, mixed formats",
            id: "mixed",
            type: "georss",
            options: {
                url: "../tests/data/data-mixed.xml",
                extraTags: ['link', 'dc:subject', 'author', 'dc:publisher'],
                tagMap: {
                    'author':'email',
                    'dc:publisher':'issuer'
                }
            }
        }
    ],
    dataDisplayedFunction: function() { setUpPageStatus = "complete"; }
}

function setUpPage(donecb) {
    TimeMap.util.nsMap['dc'] = 'http://purl.org/dc/elements/1.1/';
    tmHolder.tm = TimeMap.init(tmHolder.tmOptions);
    readyTest(donecb);
}

function readyTest(done) {
    if ( tmHolder.tm && tmHolder.tm.datasets ) {
        done();
    } else {
        setTimeout(readyTest,100,done);
    }
}

describe("datasets are defined", () => {
    beforeAll(setUpPage);
    it("has defined the datasets", () => {
        expect( tmHolder.tm.datasets["rss"] ).toBeTruthy();
        expect( tmHolder.tm.datasets["atom"] ).toBeTruthy();
        expect( tmHolder.tm.datasets["mixed"] ).toBeTruthy();
    });
});

describe("rss loading", () => {
    it("has loaded the rss dataset", () => {
        expect( tmHolder.tm.datasets["rss"].getItems().length ).toBe(1);
    });
    describe("earliest date", () => {
        it("has the correct earliest date", () => {
            expect( tmHolder.tm.datasets["rss"].eventSource.getEarliestDate().getUTCFullYear() )
                .toBe(1980);
            expect( tmHolder.tm.datasets["rss"].eventSource.getEarliestDate().getUTCMonth() )
                .toBe(0);
            // Timeline seems to adjust for the timezone after parsing :(
            expect( tmHolder.tm.datasets["rss"].eventSource.getEarliestDate().getUTCDate() )
                .toBe(2);
        });
    });
    describe("item attributes", () => {
        beforeAll( () => {
            const item = tm.datasets["rss"].getItems()[0],
                point = new mxn.LatLonPoint(23.456, 12.345);
        });
        it("has the right item", () => {
            expect( item.getTitle() ).toBe("Test Event");
            expect( item.getType() ).toBe("marker");
            expect( item.getInfoPoint() ).toBe(point);
        });
    });
});

describe("atom loading", () => {
    it("has loaded the atom dataset", () => {
        expect( tm.datasets["atom"].getItems().length ).toBe(1);
    });
    describe("earliest date", () => {
        it("has the correct earliest date", () => {
            expect( tm.datasets["atom"].eventSource.getEarliestDate().getUTCFullYear() )
                .toBe(1980);
            expect( tm.datasets["atom"].eventSource.getEarliestDate().getUTCMonth() )
                .toBe(0);
            // Timeline seems to adjust for the timezone after parsing :(
            expect( tm.datasets["atom"].eventSource.getEarliestDate().getUTCDate() )
                .toBe(2);
        });
    });
    describe("item attributes", () => {
        beforeAll( () => {
            const item = tm.datasets["atom"].getItems()[0],
                point = new mxn.LatLonPoint(23.456, 12.345);
        });
        it("has the right item", () => {
            expect( item.getTitle() ).toBe("Test Event");
            expect( item.getType() ).toBe("marker");
            expect( item.getInfoPoint() ).toBe(point);
        });
    });
});

describe("mixed loading", () => {
    it("has loaded the mixed dataset", () => {
        expect( tm.datasets["mixed"].getItems().length ).toBe(14);
    });
    describe("placemarks", () => {
        beforeAll( () => {
            const items = tm.datasets["mixed"].getItems(),
                point = new mxn.LatLonPoint(23.456, 12.345),
                points = [
                    new mxn.LatLonPoint(45.256, -110.45),
                    new mxn.LatLonPoint(46.46, -109.48),
                    new mxn.LatLonPoint(43.84, -109.86)
                ],
                centerPoint = new mxn.LatLonPoint(45.150000000000006, -109.965);
        });
        it("has the right placemarks", () => {
            items.slice(0,4).forEach( (item) => {
                expect( item.getType() ).toBe("marker");
                expect( item.getInfoPoint() ).toBe(point);
            });
        });
        it("has the right polylines", () => {
            items.slice(4,6).forEach( (item) => {
                expect( item.getType() ).toBe("polyline");
                expect( TimeMap.util.getPlacemarkType(item.placemark) )
                    .toBe("polyline");
                expect( item.placemark.points ).toBeTruthy();
                expect( item.placemark.points.length ).toBe(3);
                expect( item.getInfoPoint() ).toBe(points[1]);
                points.forEach( (point,index) => {
                    expect( item.placemark.points[index] ).toBe(point);
                });
            });
        });
        it("has the right polygons", () => {
            items.slice(6,8).forEach( (item) => {
                expect( item.getType() ).toBe("polygon");
                expect( TimeMap.util.getPlacemarkType(item.placemark) )
                    .toBe("polygon");
                // Google seems to count the last vertex of a closed polygon
                expect( item.placemark.points ).toBeTruthy();
                expect( item.placemark.points.length ).toBe(4);
                expect( item.getInfoPoint() ).toBe( centerPoint );
                points.forEach( (point,index) => {
                    expect( item.placemark.points[index] ).toBe(point);
                });
            });
        });
    });
});

describe("mixed KML time", () => {
    beforeAll( () => {
        const items = tm.datasets["mixed"].getItems();
        let item = items[8],
            d = item.event.getStart(),
            prefix = item.getTitle() + " start ";
    });
    it("has the right start", () => {
        expect( d.getUTCFullYear() ).toBe(1985);
        expect( d.getUTCMonth() ).toBe(0);
        expect( d.getUTCDate() ).toBe(2);
    });
    describe("end date", () => {
        beforeAll( () => {
            d = item.event.getEnd();
            prefix = item.getTitle() + " end ";
        });
        it("has the right end", () => {
            expect( d.getUTCFullYear() ).toBe(2000);
            expect( d.getUTCMonth() ).toBe(0);
            expect( d.getUTCDate() ).toBe(2);
        });
    });
    describe("instant date", () => {
        beforeAll( () => {
            d = item.event.getStart();
            prefix = item.getTitle() + " start ";
        });
        it("has the right instant date", () => {
            expect( d.getUTCFullYear() ).toBe(1985);
            expect( d.getUTCMonth() ).toBe(0);
            expect( d.getUTCDate() ).toBe(2);
            expect( item.event.isInstant() ).toBeTruthy();
        });
    });
});

describe("mixed extra tags", () => {
    beforeAll( () => {
        const items = tm.datasets["mixed"].getItems();
    });
    it("has read the extra tags", () => {
        expect( items[10].opts.link ).toBe( "http://www.example.com/" );
        expect( items[11].opts['dc:subject'] ).toBe( "Testing" );
        expect( items[12].opts.email ).toBe( "nick@example.com" );
        expect( items[13].opts.issuer ).toBe( "Nick" );
    });
});
