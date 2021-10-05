
jasmine.getEnv().configure({ random: false });

const
    tmOptions = {
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset A",
                id: "testA",
                type: "basic",
                options: {
                    items: [
                        {
                            "start" : "1980-01-02",
                            "end" : "1990-01-02",
                            "point" : {
                                "lat" : 23.456,
                                "lon" : 12.345
                            },
                            "title" : "Test Event A1"
                        }, {
                            "start" : "1980-01-02",
                            "end" : "1990-01-02",
                            "point" : {
                                "lat" : 23.456,
                                "lon" : 12.345
                            },
                            "title" : "Test Event A2"
                        }
                    ]
                }
            }, {
                title: "Test Dataset B",
                id: "testB",
                type: "basic",
                options: {
                    items: [
                        {
                            "start" : "1980-01-02",
                            "end" : "1990-01-02",
                            "point" : {
                                "lat" : 23.456,
                                "lon" : 12.345
                            },
                            "title" : "Test Event B1"
                        }, {
                            "start" : "1980-01-02",
                            "end" : "1990-01-02",
                            "point" : {
                                "lat" : 23.456,
                                "lon" : 12.345
                            },
                            "title" : "Test Event B2"
                        }
                    ]
                }
            }, {
                title: "Test Dataset C",
                id: "testC",
                type: "basic",
                options: { items: [] }
            }
        ]
    },
    orgNumItems = tmOptions.datasets
        .map( (ds) => ds.options.items.length ).reduce( (a,b) => a+b );

let tm, ds, item;

function setUpPage() {
    tm = TimeMap.init(tmOptions);
    const mainBand = tm.timeline.getBand(0),
        eventSource = mainBand.getEventSource();
    mainBand.setCenterVisibleDate(eventSource.getEarliestDate());
    tm.showDatasets();
    ds = tm.datasets["testA"];
    item = ds.getItems()[0];
}

describe("deletion", () => {
    beforeAll(setUpPage);
    it("has the right number of items", () => {
        expect( ds.getItems().length )
            .toBe(tmOptions.datasets.find( (ds) => ds.id==="testA" )
                  .options.items.length);
        expect( tm.timeline.getBand(0).getEventSource().getCount() )
            .toBe(orgNumItems);
    });
    describe("delete an item", () => {
        beforeAll( () => {
            ds.deleteItem(item);
        });
        it("still has the right number of items", () => {
            expect( ds.getItems().length )
                .toBe(tmOptions.datasets
                      .find( (ds) => ds.id==="testA" )
                      .options.items.length-1);
            expect( tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe(orgNumItems-1);
        });
    });
    describe("delete a dataset", () => {
        beforeAll( () => {
            tm.deleteDataset("testC");
        });
        it("has deleted the dataset", () => {
            expect( tm.datasets["testC"] ).toBeUndefined();
        });
    });
});

describe("clearing", () => {
    beforeAll( () => {
        ds = tm.datasets["testB"];
    });
    it("has the right number of items", () => {
        expect( ds.getItems().length )
            .toBe(tmOptions.datasets.find( (ds) => ds.id==="testB" )
                  .options.items.length);
    });
    describe("clear an item", () => {
        beforeAll( () => {
            item = ds.getItems()[0];
            item.clear();
        });
        it("no longer has the item", () => {
            expect( item.placemark ).toBeNull();
            expect( item.event ).toBeNull();
        });
        it("still has the right number of events", () => {
            expect( tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe( tmOptions.datasets
                       .map( (ds) => ds.options.items.length )
                       .reduce( (a,b) => a+b ) -2 );
        });
    });
    describe("clear the dataset", () => {
        beforeAll( () => {
            ds.clear();
        });
        it("has no items but one event", () => {
            expect( ds.getItems().length ).toBe(0);
            expect( tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe( tmOptions.datasets
                        .filter( (ds) => ds.id!=="testB" )
                        .map( (ds) => ds.options.items.length )
                        .reduce( (a,b) => a+b ) -1);
        });
    });
    describe("clear the timeline", () => {
        beforeAll( () => {
            tm.clear();
        });
        it("has been emptied", () => {
            expect( tm.datasets["testA"] ).toBeUndefined();
            expect( tm.datasets["testB"] ).toBeUndefined();
            expect( tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe(0);
        });
    });
});
