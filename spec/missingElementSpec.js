
jasmine.getEnv().configure({ random: false });

const tmOptions = {
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
                            "lat" : 23.456,
                            "lon" : 12.345
                        },
                        "title" : "Test Event 1",
                        "options" : { "description": "Test Description" }
                    },{ // missing event
                        "point" : {
                            "lat" : 23.456,
                            "lon" : 12.3453
                        },
                        "title" : "Test Event 2",
                        "options" : { "description": "Test Description" }
                    },{ // missing placemark
                        "start" : "1980-01-02",
                        "end" : "1990-01-02",
                        "title" : "Test Event 3",
                        "options" : { "description": "Test Description" }
                    },{ // missing point data
                        "start" : "1980-01-02",
                        "end" : "1990-01-02",
                        "title" : "Test Event 4",
                        "point" : {}
                    },{ // missing polygon data
                        "start" : "1980-01-02",
                        "end" : "1990-01-02",
                        "title" : "Test Event 5",
                        "polygon" : []
                    },{ // empty placemark array
                        "start" : "1980-01-02",
                        "end" : "1990-01-02",
                        "title" : "Test Event 6",
                        "placemarks" : []
                    }
                ]
            }
        }
    ]
}

let tm;

function setUpPage() {
    tm = TimeMap.init(tmOptions);
    setUpPageStatus = "complete";
}

function setUp() {
    setUpPage();
    var eventSource = tm.timeline.getBand(0).getEventSource();
    tm.timeline.getBand(0).setCenterVisibleDate(eventSource.getEarliestDate());
    tm.showDatasets();
}

describe("missing element tests?", () => {
    beforeAll(setUp);
    it("has the right number of items", () => {
        expect( tm.datasets["test"].getItems().length )
            .toBe( tmOptions.datasets[0].options.items.length );
        expect( tm.datasets["test"].eventSource.getCount() )
            .toBe( tmOptions.datasets[0].options.items
                    .filter( (item) => item.start ).length );
    });
});
// TODO lots more tests
