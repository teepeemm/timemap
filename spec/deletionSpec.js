
(function () {

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

let tm;

function setUpPage() {
    tm = TimeMap.init(tmOptions);
    const mainBand = tm.timeline.getBand(0),
        eventSource = mainBand.getEventSource();
    mainBand.setCenterVisibleDate(eventSource.getEarliestDate());
    tm.showDatasets();
}

describe("deletion and clearing", () => {
    beforeEach(setUpPage);
    describe("deletion", deletion);
    describe("clearing", clearing);
    afterAll( () => {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

function deletion() {
    it("has the right number of items", () => {
        expect( tm.datasets["testA"].getItems().length )
            .toBe(tmOptions.datasets.find( (ds) => ds.id==="testA" )
                  .options.items.length);
        expect( tm.timeline.getBand(0).getEventSource().getCount() )
            .toBe(orgNumItems);
    });
    it("can delete an item", () => {
        const item = tm.datasets["testA"].getItems()[0];
        tm.datasets["testA"].deleteItem(item);
        expect( item.placemark ).toBeNull();
        expect( item.event ).toBeNull();
        expect( tm.datasets["testA"].getItems().length )
            .toBe(tmOptions.datasets
                  .find( (ds) => ds.id==="testA" )
                  .options.items.length-1);
        expect( tm.timeline.getBand(0).getEventSource().getCount() )
            .toBe(orgNumItems-1);
    });
    it("can delete a dataset", () => {
        tm.deleteDataset("testC");
        expect( tm.datasets["testC"] ).toBeUndefined();
    });
}

function clearing() {
    it("has the right number of items", () => {
        expect( tm.datasets["testB"].getItems().length )
            .toBe(tmOptions.datasets.find( (ds) => ds.id==="testB" )
                  .options.items.length);
    });
    it("can clear items in a dataset", () => {
        tm.datasets["testB"].getItems()[0].clear();
        expect( tm.timeline.getBand(0).getEventSource().getCount() )
            .toBe( orgNumItems-1 );
    });
    it("can clear a dataset of items", () => {
        tm.datasets["testB"].clear();
        expect( tm.datasets["testB"].getItems().length ).toBe(0);
        expect( tm.timeline.getBand(0).getEventSource().getCount() )
            .toBe( tmOptions.datasets
                    .filter( (ds) => ds.id!=="testB" )
                    .map( (ds) => ds.options.items.length )
                    .reduce( (a,b) => a+b ) );
    });
    it("can empty a timeline", () => {
        tm.clear();
        expect( tm.datasets.length ).toBe(0);
        expect( tm.datasets["testA"] ).toBeUndefined();
        expect( tm.datasets["testB"] ).toBeUndefined();
        expect( tm.timeline.getBand(0).getEventSource().getCount() )
            .toBe(0);
    });
}

}());
