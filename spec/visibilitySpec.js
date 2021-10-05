
jasmine.getEnv().configure({ random: false });

const parser = Timeline.DateTime.parseIso8601DateTime;

let tm, ds, item, placemark, eventSource;

function expectItemVisible(flag) {
    expect( item.visible ).toBe(flag);
    expectEventVisible(flag);
    expectPlacemarkVisible(flag);
}

function expectPlacemarkVisible(flag) {
    expect( placemark.isHidden() ).toBe(!flag);
    expect( item.placemarkVisible ).toBe(flag);
}

// no great way to test item visibility
function expectEventVisible(flag) {
    expect( eventSource.getCount() ).toBe(flag?1:0);
    expect( item.eventVisible ).toBe(flag);
}

function expectDatasetVisible(flag) {
    expect( ds.visible ).toBe(flag);
    expectPlacemarkVisible(flag);
    expectEventVisible(flag);
}

describe("visibility", () => {
    beforeAll(setUp);
    it("has the right visibility for items", () => {
        expect( placemark ).toBeDefined();
        expect( item.event ).toBeDefined();
        expectItemVisible(true);
    });
    describe("hiding an item", () => {
        beforeAll( () => { item.hide(); } );
        afterAll( () => { item.show(); } );
        it("can hide items", () => {
            expectItemVisible(false);
        });
    });
    it("still has the right visibility for items", () => {
        expectItemVisible(true);
    });
    it("has the right visibility for placemarks", () => {
        expectPlacemarkVisible(true);
    });
    describe("hiding a placemark", () => {
        beforeAll( () => { item.hidePlacemark(); } );
        afterAll( () => { item.showPlacemark(); } );
        it("can hide placemarks", () => {
            expectPlacemarkVisible(false);
        });
    });
    it("still has the right visibility for placemarks", () => {
        expectPlacemarkVisible(true);
    });
    it("has the right visibility for events", () => {
        expectEventVisible(true);
    });
    describe("hiding an event", () => {
        beforeAll( () => { item.hideEvent(); } );
        afterAll( () => { item.showEvent(); } );
        it("can hide events", () => {
            expectEventVisible(false);
        });
    });
    it("still has the right visibility for events", () => {
        expectEventVisible(true);
    });
    it("has the right visibility for datasets", () => {
        expectDatasetVisible(true);
    });
    describe("hiding a dataset", () => {
        beforeAll( () => { ds.hide(); } );
        afterAll( () => { ds.show(); } );
        it("can hide a dataset", () => {
            expectDatasetVisible(false);
        });
    });
    it("still has the right visibility for datasets", () => {
        expectDatasetVisible(true);
    });
    it("has the right global visibility", () => {
        expectDatasetVisible(true);
    });
    describe("TimeMap.hideDatasets()", () => {
        beforeAll( () => { tm.hideDatasets(); } );
        afterAll( () => { tm.showDatasets(); } );
        it("can hide all datasets", () => {
            expectDatasetVisible(false);
        });
    });
    it("still has the right global visibility", () => {
        expectDatasetVisible(true);
    });
    describe("TimeMap.hideDataset(id)", () => {
        beforeAll( () => { tm.hideDataset("test"); } );
        afterAll( () => {
            tm.showDatasets();
            tm.hideDataset("notarealid");
        });
        it("has hidden the dataset by id", () => {
            expectDatasetVisible(false);
        });
    });
    it("still has the expected visibility", () => {
        expectDatasetVisible(true);
    });
    describe("hiding the past", () => {
        beforeAll( () => {
            tm.timeline.getBand(0).setCenterVisibleDate(parser("2000-01-01"));
        });
        afterAll( () => {
            tm.timeline.getBand(0).setCenterVisibleDate(parser("1980-01-01"));
        });
        it("has hidden the past", () => {
            expect( placemark.isHidden() ).toBeTrue();
        });
    });
    it("has the expected visibility", () => {
        expect( placemark.isHidden() ).toBeFalse();
    });
    describe("hiding the future", () => {
        beforeAll( () => {
            tm.timeline.getBand(0).setCenterVisibleDate(parser("1970-01-01"));
        });
        afterAll( () => {
            tm.timeline.getBand(0).setCenterVisibleDate(parser("1980-01-01"));
        });
        it("has hidden the future", () => {
            expect( placemark.isHidden() ).toBeTrue();
        });
    });
    it("has the expected visibility", () => {
        expect( placemark.isHidden() ).toBeFalse();
    })
});

function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required) 
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                type: "basic",
                options: {
                    items: [
                        {
                            "start" : "1980-01-02",
                            "end" : "1990-01-02",
                            "point" : {
                                "lat" : 40.0,
                                "lon" : 12.0
                            },
                            "title" : "Test Event",
                            "options" : { "description": "Test Description" }
                        }
                    ]
                }
            }
        ]
    });
    setUpPageStatus = "complete";
}

function setUp() {
    setUpPage();
    eventSource = tm.timeline.getBand(0).getEventSource();
    tm.timeline.getBand(0).setCenterVisibleDate(eventSource.getEarliestDate());
    tm.showDatasets();
    ds = tm.datasets["test"];
    item = ds.getItems()[0];
    placemark = item.placemark;
}
