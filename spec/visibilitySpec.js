
(function () {

const parser = Timeline.DateTime.parseIso8601DateTime;

let tm, ds, item, placemark, eventSource;

function expectItemVisible(flag) {
    expect( item.visible ).toBe(flag);
    expectEventVisible(flag);
    expectPlacemarkVisible(flag);
}

function expectPlacemarkVisible(flag) {
    expect( placemark ).toBeDefined();
    expect( placemark.isHidden() ).toBe(!flag);
    expect( item.placemarkVisible ).toBe(flag);
}

// no great way to test item visibility
function expectEventVisible(flag) {
    expect( item.event ).toBeDefined();
    expect( eventSource.getCount() ).toBe(flag?1:0);
    expect( item.eventVisible ).toBe(flag);
}

function expectDatasetVisible(flag) {
    expect( ds.visible ).toBe(flag);
    expectPlacemarkVisible(flag);
    expectEventVisible(flag);
}

function expectAllVisible(flag) {
    expectItemVisible(flag);
    expectPlacemarkVisible(flag);
    expectEventVisible(flag);
    expectDatasetVisible(flag);
}

describe("visibility", () => {
    beforeAll(setUp);
    beforeEach( () => {
        expectAllVisible(true);
    });
    afterEach( () => {
        expectAllVisible(true);
    });
    it("can hide items", () => {
        item.hide();
        expectItemVisible(false);
        item.show();
    });
    it("can hide placemarks", () => {
        item.hidePlacemark();
        expectPlacemarkVisible(false);
        item.showPlacemark();
    });
    it("can hide events", () => {
        item.hideEvent();
        expectEventVisible(false);
        item.showEvent();
    });
    it("can hide a dataset", () => {
        ds.hide();
        expectDatasetVisible(false);
        ds.show();
    });
    it("can hide all datasets", () => {
        tm.hideDatasets();
        expectDatasetVisible(false);
        tm.showDatasets();
    });
    it("can hide a dataset by id", () => {
        tm.hideDataset("test");
        expectDatasetVisible(false);
        tm.showDatasets();
        tm.hideDataset("notarealid");
    });
    it("can hide the past", () => {
        tm.timeline.getBand(0).setCenterVisibleDate(parser("2000-01-01"));
        expect( placemark.isHidden() ).toBeTrue();
        tm.timeline.getBand(0).setCenterVisibleDate(parser("1980-01-01"));
    });
    it("can hide the future", () => {
        tm.timeline.getBand(0).setCenterVisibleDate(parser("1970-01-01"));
        expect( placemark.isHidden() ).toBeTrue();
        tm.timeline.getBand(0).setCenterVisibleDate(parser("1980-01-01"));
    });
    afterAll( () => {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
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

}());
