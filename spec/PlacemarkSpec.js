
PlacemarkSpec = {};

PlacemarkSpec.specs = function (setUpPage) {

let tm, ds, items, correctMultiplePlacemarkCount;

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
    afterAll( () => {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

function setUp() {
    setUpPage();
    tm = PlacemarkSpec.tm;
    ds = tm.datasets["test"];
    items = ds.getItems();
    const eventSource = tm.timeline.getBand(0).getEventSource();
    tm.timeline.getBand(0).setCenterVisibleDate(eventSource.getEarliestDate());
    tm.showDatasets();
    correctMultiplePlacemarkCount = PlacemarkSpec.correctMultiplePlacemarkCount;
}

};
