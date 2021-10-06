
// this can't be random because we slowly delete items and
// need to count how many are left
jasmine.getEnv().configure({ random: false });

const datasetA = {
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
    },
    datasetB = {
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
    },
    tmOptions = {
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [ datasetA, datasetB, {
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
        it("still has the right number of items", () => {
            ds.deleteItem(item);
            expect( ds.getItems().length )
                .toBe(tmOptions.datasets
                      .find( (ds) => ds.id==="testA" )
                      .options.items.length-1);
            expect( tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe(orgNumItems-1);
        });
    });
    describe("delete a dataset", () => {
        it("has deleted the dataset", () => {
            tm.deleteDataset("testC");
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
        it("no longer has the item, but does have events", () => {
            ds.getItems()[0].clear();
            expect( item.placemark ).toBeNull();
            expect( item.event ).toBeNull();
            expect( tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe( tmOptions.datasets
                       .map( (ds) => ds.options.items.length )
                       .reduce( (a,b) => a+b ) -2 );
        });
    });
    describe("clear the dataset", () => {
        it("has no items but one event", () => {
            ds.clear();
            expect( ds.getItems().length ).toBe(0);
            expect( tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe( tmOptions.datasets
                        .filter( (ds) => ds.id!=="testB" )
                        .map( (ds) => ds.options.items.length )
                        .reduce( (a,b) => a+b ) -1);
        });
    });
    describe("clear the timeline", () => {
        it("has been emptied", () => {
            tm.clear();
            expect( tm.datasets["testA"] ).toBeUndefined();
            expect( tm.datasets["testB"] ).toBeUndefined();
            expect( tm.timeline.getBand(0).getEventSource().getCount() )
                .toBe(0);
        });
    });
});
