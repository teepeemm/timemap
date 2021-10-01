
jasmine.getEnv().configure({ random: false });

const tmHolder = {};

tmHolder.tmOptions = {
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
};

tmHolder.setUpPage = function (donecb) {
    tmHolder.tm = TimeMap.init(tmHolder.tmOptions);
    const mainBand = tmHolder.tm.timeline.getBand(0),
        eventSource = mainBand.getEventSource();
    mainBand.setCenterVisibleDate(eventSource.getEarliestDate());
    tmHolder.tm.showDatasets();
    tmHolder.ds = tmHolder.tm.datasets["testA"],
    tmHolder.item = tmHolder.ds.getItems()[0],
    tmHolder.orgNumItems = tmHolder.tmOptions.datasets
        .map( (ds) => ds.options.items.length ).reduce( (a,b) => a+b );
    setTimeout(readyTest,100,donecb);
}

function readyTest(done) {
    if ( tmHolder.tm && tmHolder.tm.datasets ) {
        done();
    } else {
        setTimeout(readyTest,100,done);
    }
}

describe("deletion", () => {
    beforeAll(tmHolder.setUpPage);
    it("has the right number of items", () => {
        expect( tmHolder.ds.getItems().length )
            .toBe(tmHolder.tmOptions.datasets.find( (ds) => ds.id==="testA" )
                  .options.items.length);
        expect( tmHolder.tm.timeline.getBand(0).getEventSource().getCount() )
            .toBe(tmHolder.orgNumItems);
    });
    describe("delete an item", () => {
        beforeAll( () => {
            tmHolder.ds.deleteItem(tmHolder.item);
        });
        it("still has the right number of items", () => {
            expect( tmHolder.ds.getItems().length )
                .toBe(tmHolder.tmOptions.datasets
                      .find( (ds) => ds.id==="testA" )
                      .options.items.length-1);
            expect( tmHolder.tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe(tmHolder.orgNumItems-1);
        });
    });
    describe("delete a dataset", () => {
        beforeAll( () => {
            tmHolder.tm.deleteDataset("testC");
        });
        it("has deleted the dataset", () => {
            expect( tmHolder.tm.datasets["testC"] ).toBeFalsy();
        });
    });
});

describe("clearing", () => {
    beforeAll( () => {
        tmHolder.ds = tmHolder.tm.datasets["testB"];
    });
    it("has the right number of items", () => {
        expect( tmHolder.ds.getItems().length )
            .toBe(tmHolder.tmOptions.datasets.find( (ds) => ds.id==="testB" )
                  .options.items.length);
    });
    describe("clear an item", () => {
        beforeAll( () => {
            tmHolder.item = tmHolder.ds.getItems()[0];
            tmHolder.item.clear();
        });
        it("no longer has the item", () => {
            expect( tmHolder.item.placemark ).toBeFalsy();
            expect( tmHolder.item.event ).toBeFalsy();
        });
        it("still has the right number of events", () => {
            expect( tmHolder.tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe( tmHolder.tmOptions.datasets
                       .map( (ds) => ds.options.items.length )
                       .reduce( (a,b) => a+b ) -2 );
        });
    });
    describe("clear the dataset", () => {
        beforeAll( () => {
            tmHolder.ds.clear();
        });
        it("has no items but one event", () => {
            expect( tmHolder.ds.getItems().length ).toBe(0);
            expect( tmHolder.tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe( tmHolder.tmOptions.datasets
                        .filter( (ds) => ds.id!=="testB" )
                        .map( (ds) => ds.options.items.length )
                        .reduce( (a,b) => a+b ) -1);
        });
    });
    describe("clear the timeline", () => {
        beforeAll( () => {
            tmHolder.tm.clear();
        });
        it("has been emptied", () => {
            expect( tmHolder.tm.datasets["testA"] ).toBeFalsy();
            expect( tmHolder.tm.datasets["testB"] ).toBeFalsy();
            expect( tmHolder.tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe(0);
        });
    });
});
