
const
    fs = require('fs'),
    path = require('path'),
    test_names = [
        // Load and Placemark define common functions for the rest of their line
        "Load","basicLoad","gssLoad","jsonLoad","jsonpLoad","kmlLoad",
        "Placemark","basicPlacemark","kmlPlacemark",
        "basicInfoWindow","customInfoWindow","multiInfoWindow",
        "deletion","geoRSS","initOption","iteration","kml","missingElement",
        "scrollTo","selection","theme","timeParser","visibility"
    ],
    lib_dir = "../lib/",
    mxn_test_url_base_dev = lib_dir+"mxn/mxn.js",
    timeline_test_url = {
        "12": lib_dir+"timeline-1.2.js",
        "230": lib_dir+"timeline-2.3.0.js"
    },
    google_api_key = process.argv.find(
        (arg) => arg.startsWith("GMAPS_API=")
    ).slice(10),
    map_test_url = {
//        "cloudmade": "http://tile.cloudmade.com/wml/latest/web-maps-lite.js",
//        CloudMade requires authentication
//        "esri": "https://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.2",
//        "leaflet": "https://leaflet.cloudmade.com/dist/leaflet.js",
//        "mapquest": "http://www.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=[your-api-key-here]"
//        "openmq": "https://open.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js",
//        "microsoft": "http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6"
//        "microsoft7": "http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0",
//        Microsoft is now up to version 8
//        "nokia": "http://api.maps.nokia.com/2.2.1/jsl.js",
//        requires authentication
        "openlayers": "https://openlayers.org/api/OpenLayers.js",
//        "openspace": "http://openspace.ordnancesurvey.co.uk/osmapapi/openspace.js?key=[your-api-key-here]",
//        "ovi": "https://api.maps.ovi.com/jsl.js",
//        "yandex": "http://api-maps.yandex.ru/1.1/index.xml?key=[your-api-key-here]"
//        maybe add AWS?  but it's only free for 3 months
    },
    // discontinued map providers: google(v2), yahoo
    built_dir = "specRunners/",
    files = fs.readdirSync(built_dir),
    test_page_preamble = `<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>TimeMap Unit Tests</title>
        <link rel="shortcut icon" type="image/png" href="../lib/jasmine-3.9.0/jasmine_favicon.png">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.9.0/jasmine.min.css" integrity="sha512-VmXOc/75WLdJSABvh3ovbpXUxqO/tyW29GcmNZz0sRwQHRqBIAq61kAGITx5v2YPuvG07y8m522WVYKpRB6rxw==" crossorigin="anonymous" referrerpolicy="no-referrer">
        <link rel="stylesheet" href="../spec/spec.css">

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.9.0/jasmine.min.js" integrity="sha512-KQpGQVAw7ivNvmVWPwJBlg5Rfwbc4TMgk9FRbcOIq5kk3bBjK7FYQ7ahdQly947/mwVTvCrcQj1FAN1k9sB8SQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.9.0/jasmine-html.min.js" integrity="sha512-XYVp7Pqf5Uer4ohd5h5JFOHsGhxpF6kuJnFwrMnH1rghjDzYXYX0nPB1LcI5drDcy3JGpqpQx8FnlUlW+O+hZQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="../lib/jasmine-3.9.0/boot0.js"></script>
        <!-- optional: include a file here that configures the Jasmine env -->
        <script src="../lib/jasmine-3.9.0/boot1.js"></script>

        <!-- include source files here... -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="specSummary.js"></script>
`,
    test_page_postamble = `</head>

<body>
<h1>TimeMap Unit Tests</h1>

<p>This page contains tests for the Jasmine unit testing framework.</p>

<div class="timemap">
    <div id="timeline" class="timelinediv"></div>
    <div id="map" class="mapdiv"></div>
</div>

<!-- for tests that need multiple calls to TimeMap.init() -->
<div class="timemap">
    <div id="timeline2" class="timelinediv"></div>
    <div id="map2" class="mapdiv"></div>
</div>
<div class="timemap">
    <div id="timeline3" class="timelinediv"></div>
    <div id="map3" class="mapdiv"></div>
</div>
<div class="timemap">
    <div id="timeline4" class="timelinediv"></div>
    <div id="map4" class="mapdiv"></div>
</div>
<div class="timemap">
    <div id="timeline5" class="timelinediv"></div>
    <div id="map5" class="mapdiv"></div>
</div>

</body>
</html>
`;

if ( google_api_key ) {
    map_test_url.googlev3
        = "https://maps.google.com/maps/api/js?key="+google_api_key;
}

for (const file of files) {
    if ( file.endsWith('.html') ) {
        fs.unlink(path.join(built_dir, file), err => {
            if (err) {
                throw err;
            }
        });
    }
}

Object.entries(map_test_url).forEach(createMapSuite);
build_master_html();

function build_master_html() {
    const filename = built_dir+"master_suite.html";
    let content = `<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>TimeMap Unit Tests</title>
        <link rel="shortcut icon" type="image/png" href="../lib/jasmine-3.9.0/jasmine_favicon.png">
        <style>td, th { padding: 2ex; }</style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="specSummary.js"></script>
    </head>
    <body>
        <h1>TimeMap Unit Tests</h1>
        <p>This page summarizes the Jasmine unit tests</p>
        <table>
            <thead>
                <tr><th>Map api</th>`;
    Object.keys(timeline_test_url).forEach( (timelineVer) => {
        content += `<th>Timeline ${timelineVer}</th>`;
    });
    content += '</tr>\n</thead><tbody>\n';
    Object.keys(map_test_url).forEach( (map_api) => {
        content += '<tr><th>'+map_api+'</th>\n';
        Object.keys(timeline_test_url).forEach( (timelineVer) => {
            const iframeFile = `suite_${map_api}_${timelineVer}.html`;
            content += `<td>
        <a href="${iframeFile}"> Specs:
        <span class="specSuccesses"></span> -
        <span class="specFailures"></span>
        (Expects: <span class="expectSuccesses"></span> -
        <span class="expectFailures"></span>)
        </a><br>
        <iframe src="${iframeFile}"></iframe>
        </td>
        `;
        });
        content += '</tr>\n';
    });
    content += `</tbody>
        </table>
    </body>
</html>
`;
    try {
        fs.writeFileSync(filename,content);
    } catch (err) {
        console.error(err)
    }
}

function createMapSuite(map_api) {
    return Object.entries(timeline_test_url).map(
        createSuite.bind(undefined,map_api)
    );
}

function createSuite(map_api,timeline_api) {
    const suite_page = "suite_"+map_api[0]+"_"+timeline_api[0]+".html";
    build_suite_html(suite_page,map_api,timeline_api);
    return suite_page;
}

function build_suite_html(suite_page,map_api,timeline_api) {
    const filename = built_dir+suite_page,
        scripts = [
            map_api[1],
            mxn_test_url_base_dev+"?("+map_api[0]+")",
            timeline_api[1],
            "../timemap-full.pack.js"
        ];
    scripts.push(...test_names.map( (script) => `../spec/${script}Spec.js` ) );
    const content = test_page_preamble
        +scripts.map( (script) => `<script src="${script}"></script>` ).join('\n')
        +test_page_postamble;
    try {
        fs.writeFileSync(filename,content);
    } catch (err) {
        console.error(err)
    }
}
