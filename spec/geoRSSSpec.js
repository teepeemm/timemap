
/*global TimeMap, it, describe, $, beforeAll, spyOn, afterAll, expect, mxn */
/*jslint es6 */

(function () {

"use strict";

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
    };

function setUpPage() {
    TimeMap.util.nsMap.dc = 'http://purl.org/dc/elements/1.1/';
    tm = TimeMap.init(tmOptions);
}

describe("geoRSS", function() {
    beforeAll( function() {
        spyOn($,'ajax').and.callFake(dataloader);
        setUpPage();
    });
    describe("datasets are defined", datasetsDefined);
    describe("rss loading", rssloading);
    describe("atom loading", atomloading);
    describe("mixed loading", mixedloading);
    describe("mixed KML time", mixedKMLtime);
    describe("mixed extra tags", mixedExtraTags);
    afterAll( function() {
        tm.clear();
        tm = undefined;
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

function datasetsDefined() {
    it("has defined the datasets", function() {
        expect( $.ajax ).toHaveBeenCalledTimes(3);
        expect( tm ).toBeDefined();
        expect( tm.datasets ).toBeDefined();
        expect( tm.datasets.rss ).toBeDefined();
        expect( tm.datasets.atom ).toBeDefined();
        expect( tm.datasets.mixed ).toBeDefined();
    });
}

function rssloading() {
    it("has loaded the rss dataset", function() {
        expect( tm.datasets.rss.getItems().length ).toBe(1);
    });
    it("has the correct earliest date", function() {
        expect( tm.datasets.rss.eventSource.getEarliestDate().getUTCFullYear() )
            .toBe(1980);
        expect( tm.datasets.rss.eventSource.getEarliestDate().getUTCMonth() )
            .toBe(0);
        // Timeline seems to adjust for the timezone after parsing :(
        expect( tm.datasets.rss.eventSource.getEarliestDate().getUTCDate() )
            .toBe(2);
    });
    it("has the right item", function() {
        const item = tm.datasets.rss.getItems()[0],
            point = new mxn.LatLonPoint(23.456, 12.345);
        expect( item.getTitle() ).toBe("Test Event");
        expect( item.getType() ).toBe("marker");
        expect( item.getInfoPoint().equals(point) ).toBeTrue();
    });
}

function atomloading() {
    it("has loaded the atom dataset", function() {
        expect( tm.datasets.atom.getItems().length ).toBe(1);
    });
    it("has the correct earliest date", function() {
        expect( tm.datasets.atom.eventSource.getEarliestDate().getUTCFullYear() )
            .toBe(1980);
        expect( tm.datasets.atom.eventSource.getEarliestDate().getUTCMonth() )
            .toBe(0);
        // Timeline seems to adjust for the timezone after parsing :(
        expect( tm.datasets.atom.eventSource.getEarliestDate().getUTCDate() )
            .toBe(2);
    });
    it("has the right item", function() {
        const item = tm.datasets.atom.getItems()[0],
            point = new mxn.LatLonPoint(23.456, 12.345);
        expect( item.getTitle() ).toBe("Test Event");
        expect( item.getType() ).toBe("marker");
        expect( item.getInfoPoint().equals(point) ).toBeTrue();
    });
}

function mixedloading() {
    it("has loaded the mixed dataset", function() {
        expect( tm.datasets.mixed.getItems().length ).toBe(14);
    });
    it("has the right placemarks", function() {
        const point = new mxn.LatLonPoint(23.456, 12.345);
        tm.datasets.mixed.getItems().slice(0,4).forEach( function(item) {
            expect( item.getType() ).toBe("marker");
            expect( item.getInfoPoint().equals(point) ).toBeTrue();
        });
    });
    it("has the right polylines", function() {
        const points = [
            new mxn.LatLonPoint(45.256, -110.45),
            new mxn.LatLonPoint(46.46, -109.48),
            new mxn.LatLonPoint(43.84, -109.86)
        ];
        tm.datasets.mixed.getItems().slice(4,6).forEach( function(item) {
            expect( item.getType() ).toBe("polyline");
            expect( TimeMap.util.getPlacemarkType(item.placemark) )
                .toBe("polyline");
            expect( item.placemark.points ).toBeDefined();
            expect( item.placemark.points.length ).toBe(3);
            expect( item.getInfoPoint().equals(points[1]) ).toBeTrue();
            points.forEach( function(point,index) {
                expect( item.placemark.points[index].equals(point) ).toBeTrue();
            });
        });
    });
    it("has the right polygons", function() {
        const points = [
            new mxn.LatLonPoint(45.256, -110.45),
            new mxn.LatLonPoint(46.46, -109.48),
            new mxn.LatLonPoint(43.84, -109.86)
        ],
        centerPoint = new mxn.LatLonPoint(45.150000000000006, -109.965);
        tm.datasets.mixed.getItems().slice(6,8).forEach( function(item) {
            expect( item.getType() ).toBe("polygon");
            expect( TimeMap.util.getPlacemarkType(item.placemark) )
                .toBe("polygon");
            // Google seems to count the last vertex of a closed polygon
            expect( item.placemark.points ).toBeDefined();
            expect( item.placemark.points.length ).toBe(4);
            expect( item.getInfoPoint().equals(centerPoint) ).toBeTrue();
            points.forEach( function(point,index) {
                expect( item.placemark.points[index].equals(point) ).toBeTrue();
            });
        });
    });
}

function mixedKMLtime() {
    it("has the right start", function() {
        const d = tm.datasets.mixed.getItems()[8].event.getStart();
        expect( d.getUTCFullYear() ).toBe(1985);
        expect( d.getUTCMonth() ).toBe(0);
        expect( d.getUTCDate() ).toBe(2);
    });
    it("has the right end", function() {
        const d = tm.datasets.mixed.getItems()[8].event.getEnd();
        expect( d.getUTCFullYear() ).toBe(2000);
        expect( d.getUTCMonth() ).toBe(0);
        expect( d.getUTCDate() ).toBe(2);
    });
    it("has the right instant date", function() {
        const item = tm.datasets.mixed.getItems()[9],
            d = item.event.getStart();
        expect( d.getUTCFullYear() ).toBe(1985);
        expect( d.getUTCMonth() ).toBe(0);
        expect( d.getUTCDate() ).toBe(2);
        expect( item.event.isInstant() ).toBeTrue();
    });
}

function mixedExtraTags() {
    it("has read the extra tags", function() {
        const items = tm.datasets.mixed.getItems();
        expect( items[10].opts.link ).toBe( "http://www.example.com/" );
        expect( items[11].opts['dc:subject'] ).toBe( "Testing" );
        expect( items[12].opts.email ).toBe( "nick@example.com" );
        expect( items[13].opts.issuer ).toBe( "Nick" );
    });
}

function dataloader(args) {
    if ( args.url.indexOf('data/data.rss') >= 0 ) {
        args.success($.parseXML(`<rss version="2.0" xmlns:georss="http://www.georss.org/georss">
<channel><title>Test</title><item><title>Test Event</title><description>Test Description</description><pubDate>02 Jan 1980 00:00:00 +0000</pubDate><georss:point>23.456 12.345</georss:point></item></channel></rss>`));
    } else if ( args.url.indexOf('data/data-atom.xml') >= 0 ) {
        args.success($.parseXML(`<feed xmlns="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss"><title>Test</title><entry><title>Test Event</title><updated>1980-01-02</updated><summary type="html">Test Description</summary><georss:point>23.456 12.345</georss:point></entry>
</feed>`));
    } else if ( args.url.indexOf('data/data-mixed.xml') >= 0 ) {
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

}());
