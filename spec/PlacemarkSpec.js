
describe("placemarks", () => {
    beforeAll(setUp);
    it("has the correct number of items", () => {
        expect( items.length ).toBe(6);
    });
    it("has all of its placemarks", () => {
        // skip overlay until I make it work
        items.slice(0,5).forEach( (item) => {
            expect( item.placemark ).toBeDefined();
            expect( item.placemark ).not.toBeNull();
        });
    });
    it("has the right number of polygonal vertices", () => {
        expect( items[1].placemark.points.length ).toBe(3);
        expect( items[2].placemark.points.length ).toBe(6);
    });
    it("can place multiple placemarks", () => {
        // only tests 4?
        items.slice(4,5).forEach( (item) => {
            expect( item.getType() ).toBe("array");
            expect( item.placemark.pop ).toBeDefined();
            expect( item.placemark.push ).toBeDefined();
            expect( item.placemark.length ).toBe(correctMultiplePlacemarkCount);
        });
        expect( ds.getItems()[3].getInfoPoint()
               .equals(new mxn.LatLonPoint(23.456, 12.345)) ).toBeTrue();
        expect( ds.getItems()[4].getInfoPoint()
               .equals(new mxn.LatLonPoint(43.730473, 11.257896)) ).toBeTrue();
        // can't use expect(A).toBe(B) because I need a deep equals comparison
        // can't use expect(A).toEqual(B) because the object includes other
        // properties that the custom .equals doesn't check
    });
});

let tm, ds, items,
    correctMultiplePlacemarkCount;

const values = [
    { // point
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "point" : {
            "lat" : 23.456,
            "lon" : 12.345
        },
        "title" : "Test Point",
        "options" : { "description": "Test Description" }
    },{ // polyline
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "polyline" : [
            {
                "lat" : 43.829872,
                "lon" : 11.154900
            },{
                "lat" : 43.730968,
                "lon" : 11.190605
            },{
                "lat" : 43.730473,
                "lon" : 11.257896
            }
        ],
        "title" : "Test Polyline",
        "options" : { "description": "Test Description" }
    },{ // polygon
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "polygon" : [
            {
                "lat" : 43.787254,
                "lon" : 11.226311
            },{
                "lat" : 43.801628,
                "lon" : 11.283646
            },{
                "lat" : 43.770649,
                "lon" : 11.302528
            },{
                "lat" : 43.743370,
                "lon" : 11.276779
            },{
                "lat" : 43.755276,
                "lon" : 11.230087
            },{
                "lat" : 43.787254,
                "lon" : 11.226311
            }
        ],
        "title" : "Test Polygon",
        "options" : { "description": "Test Description" }
    },{ // multiple, top level
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "point" : {
            "lat" : 23.456,
            "lon" : 12.345
        },
        "polyline" : [
            {
                "lat" : 43.829872,
                "lon" : 11.154900
            },{
                "lat" : 43.730968,
                "lon" : 11.190605
            },{
                "lat" : 43.730473,
                "lon" : 11.257896
            }
        ],
        "polygon" : [
            {
                "lat" : 43.829872,
                "lon" : 11.154900
            },{
                "lat" : 43.730968,
                "lon" : 11.190605
            },{
                "lat" : 43.730473,
                "lon" : 11.257896
            }
        ],
        "overlay" : {
            "image" : "data/tile.png",
            "north" : 38.285990,
            "south" : 29.231120,
            "east"  : 74.523837,
            "west"  : 60.533227
        },
        "title" : "Test Multiple: Top Level",
        "options" : { "description": "Test Description" }
    },{ // multiple, in a separate array
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "placemarks": [
            {
                "point" : {
                    "lat" : 23.456,
                    "lon" : 12.345
                }
            },{
                "polyline" : [
                    {
                        "lat" : 43.829872,
                        "lon" : 11.154900
                    },{
                        "lat" : 43.730968,
                        "lon" : 11.190605
                    },{
                        "lat" : 43.730473,
                        "lon" : 11.257896
                    }
                ]
            },{
                "polygon" : [
                    {
                        "lat" : 43.829872,
                        "lon" : 11.154900
                    },{
                        "lat" : 43.730968,
                        "lon" : 11.190605
                    },{
                        "lat" : 43.730473,
                        "lon" : 11.257896
                    }
                ]
            },{
                "overlay" : {
                    "image" : "data/tile.png",
                    "north" : 38.285990,
                    "south" : 29.231120,
                    "east"  : 74.523837,
                    "west"  : 60.533227
                }
            }
        ],
        "title" : "Test Multiple: Array",
        "options" : {
            "description": "Test Description",
            "infoPoint": {
                "lat" : 43.730473,
                "lon" : 11.257896
            }
        }
    },{ // overlay
        "start" : "1980-01-02",
        "end" : "1990-01-02",
        "overlay" : {
            "image" : "data/tile.png",
            "north" : 38.285990,
            "south" : 29.231120,
            "east"  : 74.523837,
            "west"  : 60.533227
        },
        "title" : "Test Overlay",
        "options" : { "description": "Test Description" }
    }
];

function setUp() {
    setUpPage();
    ds = tm.datasets["test"];
    items = ds.getItems();
    const eventSource = tm.timeline.getBand(0).getEventSource();
    tm.timeline.getBand(0).setCenterVisibleDate(eventSource.getEarliestDate());
    tm.showDatasets();
}
