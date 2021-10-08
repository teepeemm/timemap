
/*global LoadSpec, TimeMap, $, describe */
/*jslint es6 */

(function () {

"use strict";

function setUpPage() {
    LoadSpec.usingGSS = true;
    LoadSpec.tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                type: "gss",
                options: {
                    sheetsid: "user-supplied-sheet-id",
                    apikey: "user-supplied-api-key",
                    sheetname: "user-supplied-sheet-name"
                }
            }
        ]
    });
}

function dataloader(args) {
    if ( args.url === "https://sheets.googleapis.com/v4/spreadsheets/user-supplied-sheet-id/values/user-supplied-sheet-name?alt=json&key=user-supplied-api-key&callback=?" ) {
        args.success({
            range: "'user-supplied-sheet-name'!A1:F3",
            majorDimension: 'ROWS',
            values: [
    ["start","end","lat","lon","title","description"],
    ["1980-01-02","2000-01-02","23.456","12.345","Test Event","Test Description"],
    ["1980-01-02","2000-01-02","23.456","12.345","Test Event 2","Test Description"]
        ]});
    } else {
        throw 'illegal argument exception';
    }
}

describe("gss loading", function() {
    LoadSpec.specs(setUpPage,dataloader);
});

}());
