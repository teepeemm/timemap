
const
    fs = require('fs'),
    path = require('path'),
    test_names = [
        "basicLoad","jsonLoad","jsonpLoad","kmlLoad",
        "basicPlacemark","kmlPlacemark",
        "basicInfoWindow","customInfoWindow","multiInfoWindow",
        "initOption","selection",
        "geoRSS","kml","missingElement","deletion",
        "visibility","timeParser","scrollTo",
        "iteration","theme"
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
//        "google": "http://maps.google.com/maps?file=api&v=2&key="+google_api_key,
//        G maps v2 doesn't seem to work anymore
        "googlev3": "http://maps.google.com/maps/api/js?key="+google_api_key,
        "openlayers": "http://openlayers.org/api/OpenLayers.js",
//        "yahoo": "http://api.maps.yahoo.com/ajaxymap?v=3.8&appid=MJmMF_XV34Fbt9iTJluolVk7T80lw8lD.lykqztF7S9F8szGFR01um.Rg5Svbsg.eMmZ",
//        does Yahoo do this anymore?
//        "microsoft": "http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6"
//        Microsoft is now up to version 8
    },
    dependencies = [ "Load", "Placemark" ],
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

for (const file of files) {
    if ( file.endsWith('.html') ) {
        fs.unlink(path.join(built_dir, file), err => {
            if (err) {
                throw err;
            }
        });
    }
}

Object.entries(map_test_url).map(createMapSuite).flat(Infinity);
build_master_html();

function build_master_html() {
    const filename = built_dir+"suite_master.html";
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
//    const test_pages = test_names.map(
//        createPage.bind(undefined,map_api,timeline_api)
//    );
    const suite_page = "suite_"+map_api[0]+"_"+timeline_api[0]+".html";
    build_suite_html(suite_page,map_api,timeline_api);
    return suite_page;
//    return test_pages;
}

function createPage(map_api,timeline_api,test_name) {
    const test_page = test_name+"_"+map_api[0]+"_"+timeline_api[0]+".html";
    build_page_html(test_page,map_api,timeline_api,test_name);
    return test_page;
}

function build_suite_html(suite_page,map_api,timeline_api) {
    const filename = built_dir+suite_page,
        scripts = [
            map_api[1],
            mxn_test_url_base_dev+"?("+map_api[0]+")",
            timeline_api[1],
            "../timemap-full.pack.js"
        ];
    scripts.push(...[dependencies,test_names].flat(Infinity).map(
        (script) => `../spec/${script}Spec.js` ) );
    const content = test_page_preamble
        +scripts.map( (script) => `<script src="${script}"></script>` ).join('\n')
        +test_page_postamble;
    try {
        fs.writeFileSync(filename,content);
    } catch (err) {
        console.error(err)
    }
}

function build_page_html(test_page,map_api,timeline_api,test_name) {
    const filename = built_dir+test_page,
        scripts = [
            map_api[1],
            mxn_test_url_base_dev+"?("+map_api[0]+")",
            timeline_api[1],
            "../timemap-full.pack.js"
        ];
    scripts.push(...(dependencies
        .filter( (dep) => test_name.includes(dep) )
        .map( (dep) => "../spec/"+dep+"Spec.js") ));
    scripts.push("../spec/"+test_name+"Spec.js");
    const content = test_page_preamble
        + scripts.map( (script) => `<script src="${script}"></script>` ).join('\n')
        + test_page_postamble;
    try {
        fs.writeFileSync(filename,content);
    } catch (err) {
        console.error(err)
    }
}
// results are in the jsApiReporter object
