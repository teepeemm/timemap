
let tm, ds, items;

function setUp() {
    spyOn($,'ajax').and.callFake(dataloader);
    setUpPage();
    ds = tm.datasets["test"];
    items = ds.getItems();
}

describe("loadtests", () => {
    beforeAll(setUp);
    it("has loaded the data", () => {
        expect( tm ).toBeDefined();
        expect( ds ).toBeDefined();
        expect( items.length ).toBe(2);
        expect( ds.eventSource.getCount() ).toBe(2);
    });
    it("has the correct item properties", () => {
        expectDateToMatch( ds.eventSource.getEarliestDate() , 1980 );
        expectDateToMatch( ds.eventSource.getLatestDate() , 2000 );
        expect( items[0].getTitle() ).toBe("Test Event");
        expect( items[0].opts.description ).toBe("Test Description");
        expect( items[1].getTitle() ).toBe("Test Event 2");
    });
    it("has the correct event properties", () => {
        expect( items[0].event ).not.toBeNull();
        expect( items[0].event ).toBeDefined();
        expect( items[0].event.getText() ).toBe("Test Event");
        expectDateToMatch( items[0].getStart() , 1980 );
        expectDateToMatch( items[0].getEnd() , 2000 );
        expect( items[1].event ).not.toBeNull();
        expect( items[1].event ).toBeDefined();
        expect( items[1].event.getText() ).toBe("Test Event 2");
        expectDateToMatch( items[1].getStart() , 1980 );
//        expectDateToMatch( items[1].getEnd() , 2000 );
    });
    it("has the correct marker placemark properties", () => {
        const item = items[0],
            point = new mxn.LatLonPoint(23.456, 12.345);
        expect( item.placemark ).not.toBeNull();
        expect( item.placemark ).toBeDefined();
        expect( item.getType() ).toBe("marker");
        expect( TimeMap.util.getPlacemarkType(item.placemark) ).toBe("marker");
        expect( item.placemark.labelText ).toBe("Test Event");
        expect( item.placemark.location.equals(point) ).toBeTrue();
        expect( item.getInfoPoint().equals(point) ).toBeTrue();
    });
    it("has the correct native marker placement properties", () => {
        const item = items[0],
            nativePlacemark = item.getNativePlacemark();
        expect( nativePlacemark ).not.toBeNull();
        expect( nativePlacemark ).toBeDefined();
        let point;
        switch (tm.map.api) {
            case "google":
                expect( nativePlacemark.constructor ).toBe(GMarker);
                expect( nativePlacemark.getTitle() ).toBe("Test Event");
                point = new GLatLng(23.456, 12.345);
                expect( nativePlacemark.getLatLng().equals(point) ).toBeTrue();
                break;
            case "googlev3":
                expect( 'getMap' in nativePlacemark ).toBeTrue();
                expect( 'setMap' in nativePlacemark ).toBeTrue();
                expect( 'getIcon' in nativePlacemark ).toBeTrue();
                expect( nativePlacemark.getTitle() ).toBe("Test Event");
                point = new google.maps.LatLng(23.456, 12.345);
                expect( nativePlacemark.getPosition().equals(point) ).toBeTrue();
                break;
            case "openlayers":
                expect( nativePlacemark.CLASS_NAME ).toBe("OpenLayers.Marker");
                // OpenLayers markers have no titles
                // Nick: not thrilled with this test - I think Mapstraction is screwy here
                point = new mxn.LatLonPoint(23.456, 12.345).toProprietary("openlayers");
                expect( nativePlacemark.lonlat.equals(point) ).toBeTrue();
                break;
            case "microsoft":
                expect( nativePlacemark.constructor ).toBe(VEShape);
                expect( nativePlacemark.GetShapeType() ).toBe("Point");
                expect( nativePlacemark.GetTitle() ).toBe("Test Event");
                expect( nativePlacemark.Latitude ).toBe(23.456);
                expect( nativePlacemark.Longitude ).toBe(12.345);
                break;
            default:
                fail("Map API not defined, or tests not defined for this API");
        }
    });
    it("has correct polyline placemark properties", () => {
        const item = items[1],
            points = [
                new mxn.LatLonPoint(45.256, -110.45),
                new mxn.LatLonPoint(46.46, -109.48),
                new mxn.LatLonPoint(43.84, -109.86)
            ];
        expect( item.placemark ).not.toBeNull();
        expect( item.placemark ).toBeDefined();
        expect( item.getType() ).toBe("polyline");
        expect( TimeMap.util.getPlacemarkType(item.placemark) ).toBe("polyline");
        expect( item.placemark.points ).toBeDefined();
        expect( item.placemark.points.length ).toBe(3);
        expect( item.getInfoPoint().equals(points[1]) ).toBeTrue();
        expect( points.every( (point,index) =>
            item.placemark.points[index].equals(point) ) ).toBeTrue();
    });
    it("has correct native polyline placemarks", () => {
        const item = items[1],
            nativePlacemark = item.getNativePlacemark();
        expect( nativePlacemark ).not.toBeNull();
        expect( nativePlacemark ).toBeDefined();
        let points;
        switch (tm.map.api) {
            case "google":
                expect( 'getVertex' in nativePlacemark ).toBeTrue();
                expect( 'getVertexCount' in nativePlacemark ).toBeTrue();
                points = [
                    new GLatLng(45.256, -110.45),
                    new GLatLng(46.46, -109.48),
                    new GLatLng(43.84, -109.86)
                ];
                expect( nativePlacemark.getVertexCount() ).toBe(3);
                expect( points.every( (point,index) =>
                    nativePlacemark.getVertex(index).equals(point) ) ).toBeTrue();
                break;
            case "googlev3":
                expect( 'getMap' in nativePlacemark ).toBeTrue();
                expect( 'setMap' in nativePlacemark ).toBeTrue();
                expect( 'getPath' in nativePlacemark ).toBeTrue();
                points = [
                    new google.maps.LatLng(45.256, -110.45),
                    new google.maps.LatLng(46.46, -109.48),
                    new google.maps.LatLng(43.84, -109.86)
                ];
                expect( nativePlacemark.getPath().getLength() ).toBe(3);
                expect( points.every( (point,index) =>
                    nativePlacemark.getPath().getAt(index).equals(point) ) );
                break;
            case "openlayers":
                expect( nativePlacemark.CLASS_NAME )
                    .toBe("OpenLayers.Feature.Vector");
                // Nick: Not thrilled with this test - it's testing Mapstraction, not whether the lat/lons are correct
                const lls = [
                    new mxn.LatLonPoint(45.256, -110.45).toProprietary("openlayers"),
                    new mxn.LatLonPoint(46.46, -109.48).toProprietary("openlayers"),
                    new mxn.LatLonPoint(43.84, -109.86).toProprietary("openlayers")
                ];
                points = lls.map(
                    (ll) => new OpenLayers.Geometry.Point(ll.lon,ll.lat) );
                expect( nativePlacemark.geometry.components.length ).toBe(3);
                expect( points.every( (point,index) =>
                    nativePlacemark.geometry.components[index].equals(point) ) );
                break;
            case "microsoft":
                expect( nativePlacemark.constructor ).toBe(VEShape);
                expect( nativePlacemark.GetShapeType() ).toBe("Polyline");
                points = [
                        [45.256, -110.45],
                        [46.46, -109.48],
                        [43.84, -109.86]
                    ];
                const nativePoints = nativePlacemark.GetPoints();
                expect( nativePoints.length ).toBe(3);
                nativePoints.forEach( (point,index) => {
                    expect( point.Latitude ).toBe(points[index][0]);
                    expect( point.Longitude ).toBe(points[index][1]);
                });
                break;
            default:
                fail("Map API not defined, or tests not defined for this API");
        }
    })
});

function expectDateToMatch(d,year) {
    expect( d.getUTCFullYear() ).toBe(year);
    expect( d.getUTCMonth() ).toBe(0);
    expect( d.getUTCDate() ).toBe(2);
}
