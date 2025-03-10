
/*global TimeMap, TimeMapDataset, TimeMapItem */
/*jslint es6, this */

/*
 * Timemap.js Copyright 2010 Nick Rabinowitz.
 * Licensed under the MIT License (see LICENSE.txt)
 */

/**
 * @fileOverview
 * TimeMap Export Functions
 *
 * <p>Functions in this file allow TimeMap, TimeMapDataset, and TimeMapItem
 * objects to be serialized to a JSON string suitable for loading back into
 * TimeMap.init(). This allows for a range of server-side options for
 * data persistence and management.NOTE: I haven't looked at this recently! It
 * may well need to be updated.<p>
 * 
 * @requires json2: lib/json2.pack.js
 *
 * @author Nick Rabinowitz (www.nickrabinowitz.com)
 */

(function() {

"use strict";

/**
 * Clean up TimeMap into a nice object for serialization
 * This is called automatically by the JSON.stringify() function
 */
TimeMap.prototype.toJSON = function () {
    var data = {
        'options': this.makeOptionData,
        'datasets': this.datasets
    };
    data = this.addExportData(data);
    return data;
};

/**
 * Make a cleaned up object for the TimeMap options
 */
TimeMap.prototype.makeOptionData = function () {
    var data = {}, util = TimeMap.util,
        // copy options
        opts = this.opts,
        k, mts=[], mt, x;
    Object.entries(opts).forEach( function([k,v]) { data[k] = v; } );
    // clean up: mapCenter
    if (data.mapCenter) {
        data.mapCenter = util.makePoint(data.mapCenter);
    }
    // clean up: mapType
    if (data.mapType) {
        data.mapType = util.revHash(TimeMap.mapTypes, data.mapType);
    }
    // clean up: mapTypes
    if (data.mapTypes) {
        mts=[];
        data.mapTypes.forEach( function (mapType) {
            mt = util.revHash(TimeMap.mapTypes, mapType);
            if (mt) {
                mts.push(mt);
            }
        });
        data.mapTypes = mts;
    }
    // clean up: bandIntervals
    if (data.bandIntervals) {
        data.bandIntervals = util.revHash(TimeMap.intervals, data.bandIntervals);
    }
    // including themes here too - might be a TimeMap attribute
    var themes=[], t, id;
    this.datasets.forEach( function(dataset) {
        t = util.revHash(TimeMapDataset.themes, dataset.opts.theme);
        if (t) {
            themes.push(t);
        }
    });
    // Tim: what is the purpose of themes?
    // maybe it should be data.themes = themes?
    data.themes = t;
    return data;
};

/**
 * Specify additional data for export. Replace this function to change settings.
 *
 * @param {Object} data      Initial map of export data
 * @return {Object}          Expanded map of export data
 */
TimeMap.prototype.addExportData = function (data) {
    data.options = data.options || {};
    // set any additional server info (e.g. a database key) in opts.saveOpts
    data.options.saveOpts = this.opts.saveOpts;
    return data;
};

/**
 * Clean up dataset into a nice object for serialization
 * This is called automatically by the JSON.stringify() function.
 *
 * <p>Note that, at the moment, this function only supports fully-serialized
 * datasets - so external data imported with JSON or KML will be serialized
 * in full and no longer connected to their original file.</p>
 */
TimeMapDataset.prototype.toJSON = function () {
    var data = {
        'title': this.getTitle(),
        'theme': TimeMap.util.revHash(TimeMapDataset.themes, this.opts.theme),
        'data': {
            'type':'basic', // only type supported by serialization at the moment
            'value': this.getItems()
        }
    };
    data = this.addExportData(data);
    return data;
};

/**
 * Specify additional data for export. Replace this function to change settings.
 *
 * @param {Object} data      Initial map of export data
 * @return {Object}          Expanded map of export data
 */
TimeMapDataset.prototype.addExportData = function (data) {
    data.options = data.options || {};
    // set any additional server info (e.g. a database key) in opts.saveOpts
    data.options.saveOpts = this.opts.saveOpts;
    return data;
};

// XXX: export items to KML with placemark.getKmlAsync?

/**
 * Clean up item into a nice object for serialization.
 * This is called automatically by the JSON.stringify() function
 */
TimeMapItem.prototype.toJSON = function () {
    // any additional info (e.g. a database key) should be set in opts.saveOpts
    var data = {
        'title': this.getTitle(),
        'options': {
            'description': this.opts.description
        }
    };
    // add event info
    if (this.event) {
        data.start = this.event.getStart();
        if (!this.event.isInstant()) {
            data.end = this.event.getEnd();
        }
    }
    // add placemark info
    if (this.placemark) {
        var util = TimeMap.util;
        // internal function - takes type, placemark, data
        var makePlacemarkJSON = function (type, pm, pdata) {
            type = type || util.getPlacemarkType(pm);
            switch (type) {
                case "marker":
                    pdata.point = util.makePoint(pm.getLatLng());
                    break;
                case "polyline":
                case "polygon":
                    var line = [], x;
                    for (x=0; x<pm.getVertexCount(); x+=1) {
                        line.push(util.makePoint(pm.getVertex(x)));
                    }
                    pdata[type] = line;
                    break;
            }
            return pdata;
        };
        if (this.getType() === 'array') {
            data.placemarks = this.placemark.map( (p) => makePlacemarkJSON(false,p,{}) );
        } else {
            data = makePlacemarkJSON(this.getType(), this.placemark, data);
        }
    }
    data = this.addExportData(data);
    return data;
};

/**
 * Specify additional data for export. Replace this function to change settings.
 *
 * @param {Object} data      Initial map of export data
 * @return {Object}          Expanded map of export data
 */
TimeMapItem.prototype.addExportData = function (data) {
    data.options = data.options || {};
    // set any additional server info (e.g. a database key) in opts.saveOpts
    data.options.saveOpts = this.opts.saveOpts;
    return data;
};

/**
 * Util function: get the key from the map if the value is found
 *
 * @param {Object} map      Object to search
 * @param {?} val           Value to look for
 * @return {String}         Key if found, null if not
 */
TimeMap.util.revHash = function (map, val) {
    const entry = Object.entries(map).find( ([k, v]) => v===val );
    if ( entry ) {
        return entry[0];
    } else {
        return null;
    }
};

}());
