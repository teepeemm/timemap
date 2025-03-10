
/*global $, spyOn, PlacemarkSpec, TimeMap, describe */
/*jslint es6 */

(function () {

"use strict";

function dataloader(args) {
    if ( args.url.indexOf("data/placemarks.kml") >= 0 ) {
        args.success(`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.1"><Document>

<Placemark><name>Test: Point</name><TimeSpan><begin>1980-01-02</begin><end>2000-01-02</end></TimeSpan><Point><coordinates>12.345,23.456</coordinates></Point></Placemark>

<Placemark><name>Test: Polyline</name><TimeSpan><begin>1980-01-02</begin><end>2000-01-02</end></TimeSpan>
<LineString>
    <coordinates>
        11.154900,43.829872
        11.190605,43.730968
        11.257896,43.730473
    </coordinates>
</LineString>
</Placemark>

<Placemark><name>Test: Polygon</name><TimeSpan><begin>1980-01-02</begin><end>2000-01-02</end></TimeSpan>
    <Polygon>
      <outerBoundaryIs>
        <LinearRing>
          <coordinates>
            11.226311,43.787254
            11.283646,43.801628
            11.302528,43.770649
            11.276779,43.743370
            11.230087,43.755276
            11.226311,43.787254
          </coordinates>
        </LinearRing>
      </outerBoundaryIs>
    </Polygon>
</Placemark>

<Placemark><name>Test: Multiple 1</name><TimeSpan><begin>1980-01-02</begin><end>2000-01-02</end></TimeSpan>
<MultiGeometry>
    <Point><coordinates>12.345,23.456</coordinates></Point>
    <LineString>
        <coordinates>
            11.154900,43.829872
            11.190605,43.730968
            11.257896,43.730473
        </coordinates>
    </LineString>
    <Polygon>
      <outerBoundaryIs>
        <LinearRing>
          <coordinates>
            11.154900,43.829872
            11.190605,43.730968
            11.257896,43.730473
          </coordinates>
        </LinearRing>
      </outerBoundaryIs>
    </Polygon>
    <!-- Can't include an overlay here -->
</MultiGeometry>
</Placemark>

<Placemark><name>Test: Multiple 2</name><TimeSpan><begin>1980-01-02</begin><end>2000-01-02</end></TimeSpan>
<MultiGeometry>
    <!-- no way to set the optional infoPoint, so we'll just change the first point -->
    <Point><coordinates>11.257896,43.730473</coordinates></Point>
    <LineString>
        <coordinates>
            11.154900,43.829872
            11.190605,43.730968
            11.257896,43.730473
        </coordinates>
    </LineString>
    <Polygon>
      <outerBoundaryIs>
        <LinearRing>
          <coordinates>
            11.154900,43.829872
            11.190605,43.730968
            11.257896,43.730473
          </coordinates>
        </LinearRing>
      </outerBoundaryIs>
    </Polygon>
    <!-- Can't include an overlay here -->
</MultiGeometry>
</Placemark>

<GroundOverlay>
    <name>Test Overlay</name>
    <TimeStamp><when>1980-01-02</when></TimeStamp>
    <Icon>
      <href>../spec/data/tile.png</href>
    </Icon>
    <LatLonBox>
      <north>38.285990</north>
      <south>29.231120</south>
      <east>74.523837</east>
      <west>60.533227</west>
    </LatLonBox>
</GroundOverlay>

</Document></kml>`);
    } else {
        throw 'illegal argument exception';
    }
}

function setUpPage() {
    spyOn($,'ajax').and.callFake(dataloader);
    PlacemarkSpec.tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset: KML",
                id: "test",
                type: "kml",
                options: { url: "data/placemarks.kml" }
            }
        ]
    });
    PlacemarkSpec.correctMultiplePlacemarkCount = 3; // no overlay possible in KML
}

describe("kml placemarks", function() {
    PlacemarkSpec.specs(setUpPage);
});

}());
