/* 
 * Timemap.js Copyright 2010 Nick Rabinowitz.
 * Licensed under the MIT License (see LICENSE.txt)
 */

/**
 * @fileOverview
 * Google Spreadsheet Loader
 *
 * @author Nick Rabinowitz (www.nickrabinowitz.com)
 */

/*global TimeMap, TimeMapItem */
/*jslint es6, this */

(function() {

"use strict";

/**
 * @class
 * Google Spreadsheet loader.
 *
 * <p>This is a loader for data from Google Spreadsheets version 4
 * (not the map api version). The constructor takes an optional map
 * to indicate which columns contain which data elements; the default column
 * names (case-insensitive) are: title, description, start, end, lat, lon</p>
 * 
 * <p>The loader takes either a full URL, minus the JSONP callback function, or
 * the spreadsheet key id, the sheet name, and the sheets api key
 * (see https://developers.google.com/sheets/api/guides/authorizing#APIKey for
 * that last item). Note that the spreadsheet must be published.</p>
 *
 * @augments TimeMap.loaders.jsonp
 * @requires param.js
 * @requires loaders/json.js
 *
 * @example
TimeMap.init({
    datasets: [
        {
            title: "Google Spreadsheet by key and id",
            type: "gss",
            options: {
                sheetsid: "user-supplied-sheet-id",
                apikey: "user-supplied-api-key",
                sheetname: "user-supplied-sheet-name"
            }
        },
        {
            title: "Google Spreadsheet by url",
            type: "gss",
            options: {
                url: "https://sheets.googleapis.com/v4/spreadsheets/user-supplied-sheet-id/values/user-supplied-sheet-name?alt=json&key=user-supplied-api-key&callback=?"
            }
        }
    ],
    // etc...
});
 * @see <a href="../../examples/google_spreadsheet.html">Google Spreadsheet Example</a>
 * @see <a href="../../examples/google_spreadsheet_columns.html">Google Spreadsheet Example, Arbitrary Columns</a>
 *
 * @param {Object} options          All options for the loader:
 * @param {String} options.sheetsid          Sheets id
 * @param {String} options.apikey            Key of spreadsheet to load
 * @param {String} options.sheetname         Name of sheet to load
 * @param {String} options.url               Full JSONP url of spreadsheet to load
 * @param {Object} [options.paramMap]        Map of paramName:columnName pairs for core parameters,
 *                                           if using non-standard column names; see keys in
 *                                           {@link TimeMap.loaders.base#params} for the standard param names
 * @param {String[]} [options.extraColumns]  Array of additional columns to load; all named columns will be
 *                                           loaded into the item.opts object.
 * @param {mixed} [options[...]]             Other options (see {@link TimeMap.loaders.jsonp})
 */
TimeMap.loaders.gss = function (options) {
    var loader = new TimeMap.loaders.jsonp(options),
        params = loader.params,
        setParamField = TimeMap.loaders.gss.setParamField,
        paramMap = options.paramMap || {},
        extraColumns = options.extraColumns || [];

    // build URL if not supplied
    if (!loader.opts.url && options.apikey && options.sheetsid && options.sheetname) {
        loader.opts.url = "https://sheets.googleapis.com/v4/spreadsheets/"
            + options.sheetsid + "/values/" + options.sheetname + "?alt=json&key="
            + options.apikey + "&callback=?";
    }

    // Set up additional columns
    extraColumns.forEach(function (paramName) {
        params[paramName] = new TimeMap.params.OptionParam(paramName);
    });

    // Set up parameters to work with Google Spreadsheets
    Object.entries(params).forEach( function ([paramName,paramValue]) {
        setParamField(paramValue, paramMap[paramName] || paramName);
    });

    /**
     * Preload function for spreadsheet data
     * @name TimeMap.loaders.gss#preload
     * @function
     * @parameter {Object} data     Data to preload
     * @return {Array} data         Array of item data
     */
    loader.preload = function (gFourData) {
        var columnHeaders = gFourData.values.shift(),
            data = [];
        gFourData.values.forEach( function(row) {
            var rowObj = {};
            row.forEach( function(entry,colIndex) {
                rowObj[columnHeaders[colIndex]]=entry;
            });
            data.push(rowObj);
        });
        return data;
    };
    
    /**
     * Transform function for spreadsheet data
     * @name TimeMap.loaders.gss#transform
     * @function
     * @parameter {Object} data     Data to transform
     * @return {Object} data        Transformed data for one item
     */
    loader.transform = function (data) {
        var item = {}, params = loader.params,
            transform = options.transformFunction;
        // this is the same params assignment as above
        // but extra columns may have changed params in the meantime
        // but it wouldn't have changed loader.params
        Object.values(params).forEach( function(param) {
            param.setConfigGSS(item,data);
        });
        // hook for further transformation
        if (transform) {
            item = transform(item);
        }
        return item;
    };

    return loader;
};

/**
 * Set a parameter to get its value from a given Google Spreadsheet field.
 *
 * @param {TimeMap.Param} param     Param object
 * @param {String} fieldName        Name of the field
 */
TimeMap.loaders.gss.setParamField = function (param, fieldName) {
    // internal function: Get the value of a Google Spreadsheet field
    var getField = function (data, fieldName) {
        // get element, converting field name to GSS format
        var el = data[fieldName];
        return el || null;
    };
    // set the method on the parameter
    param.setConfigGSS = function (config, data) {
        this.setConfig(config, getField(data, fieldName));
    };
};

}());
