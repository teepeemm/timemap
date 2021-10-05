
jasmine.getEnv().configure({ random: false });

let tm;

const tmOptions = {
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset: RSS",
                id: "rss",
                type: "georss",
                options: { url: "../tests/data/data.rss" }
            },{
                title: "Test Dataset: Atom",
                id: "atom",
                type: "georss",
                options: { url: "../tests/data/data-atom.xml" }
            },{
                title: "Test Dataset: RSS, mixed formats",
                id: "mixed",
                type: "georss",
                options: {
                    url: "../tests/data/data-mixed.xml",
                    extraTags: ['link', 'dc:subject', 'author', 'dc:publisher'],
                    tagMap: {
                        'author':'email',
                        'dc:publisher':'issuer'
                    }
                }
            }
        ]
    }

function setUpPage(donecb) {
    TimeMap.util.nsMap['dc'] = 'http://purl.org/dc/elements/1.1/';
    tm = TimeMap.init(tmOptions);
    readyTest(donecb,0);
}

function readyTest(done,attempts) {
    if ( tm && tm.datasets ) {
        console.log('done');
        done();
    } else if (attempts>30) {
        throw 'timemap not loaded';
    } else {
        setTimeout(readyTest,100,done,attempts+1);
    }
}

describe("datasets are defined", () => {
    beforeAll( (done) => {
        spyOn($,'ajax').and.callFake(dataloader);
        setUpPage(done);
    });
    it("has defined the datasets", () => {
        expect( $.ajax ).toHaveBeenCalledTimes(3);
//        expect( $.ajax ).toHaveBeenCalledWith({
//            url: "../tests/data/data.rss",
//            type: "GET",
//            dataType: "xml",
//            success: Function
//        });
        expect( tm ).toBeDefined();
        expect( tm.datasets ).toBeDefined();
        expect( tm.datasets["rss"] ).toBeDefined();
        expect( tm.datasets["atom"] ).toBeDefined();
        expect( tm.datasets["mixed"] ).toBeDefined();
    });
});

describe("rss loading", () => {
    it("has loaded the rss dataset", () => {
        expect( tm.datasets["rss"].getItems().length ).toBe(1);
    });
    describe("earliest date", () => {
        it("has the correct earliest date", () => {
            expect( tm.datasets["rss"].eventSource.getEarliestDate().getUTCFullYear() )
                .toBe(1980);
            expect( tm.datasets["rss"].eventSource.getEarliestDate().getUTCMonth() )
                .toBe(0);
            // Timeline seems to adjust for the timezone after parsing :(
            expect( tm.datasets["rss"].eventSource.getEarliestDate().getUTCDate() )
                .toBe(2);
        });
    });
    describe("item attributes", () => {
        it("has the right item", () => {
            const item = tm.datasets["rss"].getItems()[0],
                point = new mxn.LatLonPoint(23.456, 12.345);
            expect( item.getTitle() ).toBe("Test Event");
            expect( item.getType() ).toBe("marker");
            expect( item.getInfoPoint().equals(point) ).toBeTrue();
        });
    });
});

describe("atom loading", () => {
    it("has loaded the atom dataset", () => {
        expect( tm.datasets["atom"].getItems().length ).toBe(1);
    });
    describe("earliest date", () => {
        it("has the correct earliest date", () => {
            expect( tm.datasets["atom"].eventSource.getEarliestDate().getUTCFullYear() )
                .toBe(1980);
            expect( tm.datasets["atom"].eventSource.getEarliestDate().getUTCMonth() )
                .toBe(0);
            // Timeline seems to adjust for the timezone after parsing :(
            expect( tm.datasets["atom"].eventSource.getEarliestDate().getUTCDate() )
                .toBe(2);
        });
    });
    describe("item attributes", () => {
        it("has the right item", () => {
            const item = tm.datasets["atom"].getItems()[0],
                point = new mxn.LatLonPoint(23.456, 12.345);
            expect( item.getTitle() ).toBe("Test Event");
            expect( item.getType() ).toBe("marker");
            expect( item.getInfoPoint().equals(point) ).toBeTrue();
        });
    });
});

describe("mixed loading", () => {
    it("has loaded the mixed dataset", () => {
        expect( tm.datasets["mixed"].getItems().length ).toBe(14);
    });
    describe("placemarks", () => {
        it("has the right placemarks", () => {
            const point = new mxn.LatLonPoint(23.456, 12.345);
            tm.datasets["mixed"].getItems().slice(0,4).forEach( (item) => {
                expect( item.getType() ).toBe("marker");
                expect( item.getInfoPoint().equals(point) ).toBeTrue();
            });
        });
        it("has the right polylines", () => {
            const points = [
                new mxn.LatLonPoint(45.256, -110.45),
                new mxn.LatLonPoint(46.46, -109.48),
                new mxn.LatLonPoint(43.84, -109.86)
            ];
            tm.datasets["mixed"].getItems().slice(4,6).forEach( (item) => {
                expect( item.getType() ).toBe("polyline");
                expect( TimeMap.util.getPlacemarkType(item.placemark) )
                    .toBe("polyline");
                expect( item.placemark.points ).toBeDefined();
                expect( item.placemark.points.length ).toBe(3);
                expect( item.getInfoPoint().equals(points[1]) ).toBeTrue();
                points.forEach( (point,index) => {
                    expect( item.placemark.points[index].equals(point) ).toBeTrue();
                });
            });
        });
        it("has the right polygons", () => {
            const points = [
                new mxn.LatLonPoint(45.256, -110.45),
                new mxn.LatLonPoint(46.46, -109.48),
                new mxn.LatLonPoint(43.84, -109.86)
            ],
            centerPoint = new mxn.LatLonPoint(45.150000000000006, -109.965);
            tm.datasets["mixed"].getItems().slice(6,8).forEach( (item) => {
                expect( item.getType() ).toBe("polygon");
                expect( TimeMap.util.getPlacemarkType(item.placemark) )
                    .toBe("polygon");
                // Google seems to count the last vertex of a closed polygon
                expect( item.placemark.points ).toBeDefined();
                expect( item.placemark.points.length ).toBe(4);
                expect( item.getInfoPoint().equals(centerPoint) ).toBeTrue();
                points.forEach( (point,index) => {
                    expect( item.placemark.points[index].equals(point) ).toBeTrue();
                });
            });
        });
    });
});

describe("mixed KML time", () => {
    it("has the right start", () => {
        const d = tm.datasets["mixed"].getItems()[8].event.getStart();
        expect( d.getUTCFullYear() ).toBe(1985);
        expect( d.getUTCMonth() ).toBe(0);
        expect( d.getUTCDate() ).toBe(2);
    });
    describe("end date", () => {
        it("has the right end", () => {
            const d = tm.datasets["mixed"].getItems()[8].event.getEnd();
            expect( d.getUTCFullYear() ).toBe(2000);
            expect( d.getUTCMonth() ).toBe(0);
            expect( d.getUTCDate() ).toBe(2);
        });
    });
    describe("instant date", () => {
        it("has the right instant date", () => {
            const item = tm.datasets["mixed"].getItems()[9],
                d = item.event.getStart();
            expect( d.getUTCFullYear() ).toBe(1985);
            expect( d.getUTCMonth() ).toBe(0);
            expect( d.getUTCDate() ).toBe(2);
            expect( item.event.isInstant() ).toBeTrue();
        });
    });
});

describe("mixed extra tags", () => {
    it("has read the extra tags", () => {
        const items = tm.datasets["mixed"].getItems();
        expect( items[10].opts.link ).toBe( "http://www.example.com/" );
        expect( items[11].opts['dc:subject'] ).toBe( "Testing" );
        expect( items[12].opts.email ).toBe( "nick@example.com" );
        expect( items[13].opts.issuer ).toBe( "Nick" );
    });
});

function dataloader(args) {
    console.log("loading from: "+args.url);
    if ( args.url.indexOf('data/data.rss') >= 0 ) {
        console.log('branch1');
        args.success($.parseXML(`<rss version="2.0" xmlns:georss="http://www.georss.org/georss">
<channel><title>Test</title><item><title>Test Event</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point></item></channel></rss>`));
    } else if ( args.url.indexOf('data/data-atom.xml') >= 0 ) {
        console.log('branch2');
        args.success($.parseXML(`<feed xmlns="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss"><title>Test</title><entry><title>Test Event</title><updated>1980-01-02</updated><summary type="html">Test Description</summary><georss:point>23.456 12.345</georss:point></entry>
</feed>`));
    } else if ( args.url.indexOf('data/data-mixed.xml') >= 0 ) {
        console.log('branch3');
        args.success($.parseXML(`<rss version="2.0"
    xmlns:georss="http://www.georss.org/georss"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
    xmlns:kml="http://www.opengis.net/kml/2.2"
    xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel><title>Test</title>
    <item><title>Test Event:GeoRSS-Simple</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point></item>
    
    <item><title>Test Event:GML (pos)</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:where><gml:Point><gml:pos>23.456 12.345</gml:pos></gml:Point></georss:where></item>
    
    <item><title>Test Event:GML (coordinates)</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:where><gml:Point><gml:coordinates>23.456, 12.345</gml:coordinates></gml:Point></georss:where></item>
    
    <item><title>Test Event:W3C Geo</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><geo:lat>23.456</geo:lat><geo:long>12.345</geo:long></item>
    
    <item><title>Test Event:Polyline Simple</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:line>45.256 -110.45 46.46 -109.48 43.84 -109.86</georss:line></item>
    
    <item><title>Test Event:Polyline GML</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:where><gml:LineString><gml:posList>45.256 -110.45 46.46 -109.48 43.84 -109.86</gml:posList></gml:LineString></georss:where></item>
    
    <item><title>Test Event:Polygon Simple</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:polygon>45.256 -110.45 46.46 -109.48 43.84 -109.86 45.256 -110.45</georss:polygon></item>
    
    <item><title>Test Event:Polygon GML</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:where><gml:Polygon><gml:exterior><gml:LinearRing><gml:posList>45.256 -110.45 46.46 -109.48 43.84 -109.86 45.256 -110.45</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></georss:where></item>

    <item><title>Test Event:GeoRSS-Simple with KML TimeSpan</title><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point><kml:TimeSpan><kml:begin>1985-01-02</kml:begin><kml:end>2000-01-02</kml:end></kml:TimeSpan></item>

    <item><title>Test Event:GeoRSS-Simple with KML TimeStamp</title><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point><kml:TimeStamp><kml:when>1985-01-02</kml:when></kml:TimeStamp></item>

    <item><title>Test Event:GeoRSS-Simple with Extra Data</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point><link>http://www.example.com/</link></item>

    <item><title>Test Event:GeoRSS-Simple with Namespaced Extra Data</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point><dc:subject>Testing</dc:subject></item>
    
    <item><title>Test Event:GeoRSS-Simple with Extra Data, mapped</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point><author>nick@example.com</author></item>

    <item><title>Test Event:GeoRSS-Simple with Namespaced Extra Data, mapped</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point><dc:publisher>Nick</dc:publisher></item>

    </channel>
</rss>`));
    } else {
        throw 'illegal argument';
    }
}
