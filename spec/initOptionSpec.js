
let tm, tm2, tm3;

const items = [
    {
        "start" : "1452",
        "point" : {
            "lat" : 40.0,
            "lon" : 12.0
        },
        "title" : "Item 1"
    },{
        "start" : "1475",
        "point" : {
            "lat" : 42.0,
            "lon" : 12.0
        },
        "title" : "Item 2"
    }
];

// page setup script
function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                id: "test",
                type: "basic",
                options: { items: items }
            }
        ]
    });
    tm2 = TimeMap.init({
        mapId: "map2",               // Id of map div element (required)
        timelineId: "timeline2",     // Id of timeline div element (required)
        options: {
            centerOnItems: false,
            mapZoom: 8,
            mapCenter: new mxn.LatLonPoint(38, -123),
            mapType: 'satellite',
            syncBands: false
        },
        bandIntervals: "dec",
        datasets: [
            {
                id: "test",
                type: "basic",
                options: { items: items }
            }
        ]
    });
    tm3 = TimeMap.init({
        mapId: "map3",               // Id of map div element (required)
        timelineId: "timeline3",     // Id of timeline div element (required)
        options: {
            centerOnItems: false,
            mapZoom: 8,
            mapCenter: {
                lat:38.0,
                lon:-123
            }
        },
        bandInfo: [
            {
                width:          "30%",
                intervalUnit:   Timeline.DateTime.YEAR,
                intervalPixels: 100
            },{
                width:          "30%",
                intervalUnit:   Timeline.DateTime.DECADE,
                intervalPixels: 100
            },{
                width:          "20%",
                intervalUnit:   Timeline.DateTime.CENTURY,
                intervalPixels: 100,
                eventSource:    false
            }
        ],
        datasets: [
            {
                id: "test",
                type: "basic",
                options: { items: items }
            }
        ]
    });
    tm4 = TimeMap.init({
        mapId: "map4",               // Id of map div element (required)
        timelineId: "timeline4",     // Id of timeline div element (required)
        bands: [
            Timeline.createHotZoneBandInfo({
                width:          "75%",
                intervalUnit:   Timeline.DateTime.YEAR,
                intervalPixels: 65,
                zones:          [{
                                    start:    "1450",
                                    end:      "1480",
                                    magnify:  5,
                                    unit:     Timeline.DateTime.MONTH
                                }]
            }),
            Timeline.createHotZoneBandInfo({
                width:          "25%",
                intervalUnit:   Timeline.DateTime.DECADE,
                intervalPixels: 85,
                layout:         'overview',
                zones:          [{
                                    start:    "1450",
                                    end:      "1480",
                                    magnify:  5,
                                    unit:     Timeline.DateTime.YEAR
                                }]
            })
        ],
        datasets: [
            {
                id: "test",
                type: "basic",
                options: { items: items }
            }
        ]
    });
}

function expectBandInterval(timemap, bandIndex, interval) {
    expect(timemap.timeline.getBand(bandIndex).getEther()._interval)
        .toBe(Timeline.DateTime.gregorianUnitLengths[Timeline.DateTime[interval]]);
}

function expectMapType(timemap, type) {
    expect(mxn.Mapstraction[type]).toBe(timemap.map.getMapType());
}

describe("initOptions", () => {
    beforeAll(setUpPage);
    describe("default map type", defaultMapType);
    describe("center and zoom", centerAndZoom);
    describe("timeline bands", timelineBands);
});

function defaultMapType() {
    it("has the correct map type", () => {
        switch (tm.map.api) {
            case "google":
            case "googlev3":
                expectMapType(tm, 'PHYSICAL');
                break;
            case "openlayers":
                // OpenLayers doesn't support other map types in Mapstraction
                break;
            case "microsoft":
                expectMapType(tm, 'ROAD');
                break;
            default:
                fail("Map API not defined, or tests not defined for this API");
        }
    });
    it("has the correct custom map type", () => {
        // this will fail for openlayers right now
        if ( tm2.map.api !== 'openlayers' ) {
            expectMapType(tm2, 'SATELLITE');
        }
    });
}

function centerAndZoom() {
    it("has the correct auto center and zoom", () => {
        const mapZoom = tm.map.getZoom(),
            center = tm.map.getCenter();
        expect( tm.opts.centerOnItems ).toBeTrue();
        // okay, let's do this with broad strokes
        expect( mapZoom ).toBeGreaterThanOrEqual(6);
        expect( mapZoom ).toBeLessThanOrEqual(8);
        expect( center.lat ).toBeCloseTo(41,0);
        expect( center.lon ).toBeCloseTo(12,0);
    });
    it("has the correct custom center and zoom", () => {
        const center2 = tm2.map.getCenter();
        expect( tm2.opts.centerOnItems ).toBeFalse();
        expect( center2.lat ).toBeCloseTo(38,1);
        expect( center2.lon ).toBeCloseTo(-123,1);
    });
    it("has the correct point center and zoom", () => {
        const center3 = tm3.map.getCenter();
        expect( tm3.opts.centerOnItems ).toBeFalse();
        expect( center3.lat ).toBeCloseTo(38,1);
        expect( center3.lon ).toBeCloseTo(-123,1);
    });
}

function timelineBands() {
    it("has the correct default bands", () => {
        expect( tm.timeline.getBandCount() ).toBe(2);
        expect( tm.timeline.getBand(1)._syncWithBand )
            .toBe(tm.timeline.getBand(0));
        expectBandInterval(tm, 0, 'WEEK');
        expectBandInterval(tm, 1, 'MONTH');
    });
    it("has the correct custom band intervals", () => {
        expect( tm2.timeline.getBandCount() ).toBe(2);
        expect( tm2.timeline.getBand(1)._syncWithBand ).toBeNull();
        expectBandInterval(tm2, 0, 'DECADE');
        expectBandInterval(tm2, 1, 'CENTURY');
    });
    it("has the correct custom band info", () => {
        expect( tm3.timeline.getBandCount() ).toBe(3);
        expect( tm3.timeline.getBand(1)._syncWithBand )
            .toBe(tm3.timeline.getBand(0));
        expect( tm3.timeline.getBand(2)._syncWithBand )
            .toBe(tm3.timeline.getBand(0));
        expectBandInterval(tm3, 0, 'YEAR');
        expectBandInterval(tm3, 1, 'DECADE');
        expectBandInterval(tm3, 2, 'CENTURY');
        expect( tm3.timeline.getBand(2).getEventSource() ).toBeNull();
    });
    it("has the correct hotzones", () => {
        expect( tm4.timeline.getBandCount() ).toBe(2);
        expect( tm.timeline.getBand(1)._syncWithBand )
            .toBe(tm.timeline.getBand(0));
        expect( tm4.timeline.getBand(0).getEther().constructor )
            .toBe(Timeline.HotZoneEther);
        expect( tm4.timeline.getBand(1).getEther().constructor )
            .toBe(Timeline.HotZoneEther);
        expect( tm4.timeline.getBand(0).getEventSource) .toBe(tm4.timeline.getBand(1).getEventSource);
    });
}
