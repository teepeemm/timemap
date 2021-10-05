
describe("can parse dates and times", () => {
    beforeAll(setUpPage);
    it("can parse a combination of ISO8601 and Gregorian", () => {
        expectISO8601('hybrid');
        expectGregorianYear('hybrid');
        expectTimestamp('hybrid');
        expectNulls('hybrid');
    });
    it("can parse ISO8601 dates", () => {
        expectISO8601('iso8601');
        expectNulls('iso8601');
    });
    it("can parse a variety of years", () => {
        expectGregorianYear('gregorian');
        expectNulls('gregorian');
    });
});

function expectISO8601(dsid) {
    const items = tm.datasets[dsid].getItems();
    items.slice(0,2).forEach( expectDateToMatch.bind(undefined,false) );
    items.slice(2,5).forEach( expectDateToMatch.bind(undefined,true) );
}

function expectDateToMatch(checktime,item) {
    expect( item ).not.toBeNull();
    const d = item.event.getStart();
    expect( d.getUTCFullYear() ).toBe(1980);
    expect( d.getUTCMonth() ).toBe(0);
    expect( d.getUTCDate() ).toBe(2);
    if ( checktime ) {
        expect( d.getUTCHours() ).toBe(10);
        expect( d.getUTCMinutes() ).toBe(20);
        expect( d.getUTCSeconds() ).toBe(30);
    }
}

function expectTimestamp(dsid) {
    tm.datasets[dsid].getItems().slice(20,22).forEach(
        expectDateToMatch.bind(undefined,true)
    );
}

function expectGregorianYear(dsid) {
    const items = tm.datasets[dsid].getItems();
    Object.entries(expectedYear).forEach( ([index,year]) => {
        const event = items[index].event;
        expect( event ).not.toBeNull();
        expect( event.getStart().getUTCFullYear() ).toBe(year);
    } );
}

function expectNulls(dsid) {
    const items = tm.datasets[dsid].getItems();
    items.slice(10,13).forEach( (item) => {
        expect( item.event ).toBeNull();
    });
    items.slice(22,24).forEach( (item) => {
        expect( item.event ).toBeNull();
    });
}

const items = [
    {
      "start" : "1980-01-02",
      "title" : "0: basic ISO8601 date"
    },{
      "start" : "19800102",
      "title" : "1: basic ISO8601 date, no dividers"
    },{
      "start" : "1980-01-02 10:20:30Z",
      "title" : "2: basic ISO8601 date + time"
    },{
      "start" : "1980-01-02T10:20:30Z",
      "title" : "3: basic ISO8601 date + time, T format"
    },{
      "start" : "19800102T102030Z",
      "title" : "4: basic ISO8601 date + time, T format, no dividers"
    },{
      "start" : "1980",
      "title" : "5: basic gregorian date"
    },{
      "start" : "200",
      "title" : "6: basic gregorian date, early year"
    },{
      "start" : "5 AD",
      "title" : "7: basic gregorian date, early year AD"
    },{
      "start" : "200 BC",
      "title" : "8: basic gregorian date, early year BC"
    },{
      "start" : "-200",
      "title" : "9: basic gregorian date, negative"
    },{
      "title" : "10: no start at all"
    },{
      "start" : "",
      "title" : "11: start is empty string"
    },{
      "start" : "test",
      "title" : "12: start is invalid string"
    },
    // Adding some extras after parser changes
    {
      "start" : "5000 BC",
      "title" : "13: basic gregorian date, 1000s BC"
    },{
      "start" : "100000 BC",
      "title" : "14: basic gregorian date, 100000s BC"
    },{
      "start" : "100000 AD",
      "title" : "15: basic gregorian date, 100000s AD"
    },{
      "start" : "202 b.c.",
      "title" : "16: basic gregorian date, 'b.c.'"
    },{
      "start" : "202 a.d.",
      "title" : "17: basic gregorian date, 'a.d.'"
    },{
      "start" : "202 BCE",
      "title" : "18: basic gregorian date, 'BCE'"
    },{
      "start" : "202 CE",
      "title" : "19: basic gregorian date, 'CE'"
    },{
      "start" : 315656430000,
      "title" : "20: start is integer"
    },{
      "start" : "315656430000",
      "title" : "21: start is integer string"
    },{
      "start" : {},
      "title" : "22: start is object"
    },{
      "start" : [],
      "title" : "23: start is array"
    }
];

const expectedYear = {
    5: 1980,
    6: 200,
    7: 5,
    8: -199,
    9: -200,
    13: -4999,
    14: -99999,
    15: 100000,
    16: -201,
    17: 202,
    18: -201,
    19: 202
}

// cut non-string tests from gregorian and iso
const gregorianItems = items.slice(0, items.length);
gregorianItems[20] = gregorianItems[21] = gregorianItems[22] = {"start" : "", "title" : ""};

// cut gregorian dates out of iso set to avoid stupid SIMILE debug
const isoItems = gregorianItems.slice(0, items.length);
isoItems[7] = isoItems[8] = isoItems[13] = isoItems[14] = isoItems[15] = {"start" : "", "title" : ""};

let tm;

function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required) 
        datasets: [ 
            {
                title: "Test Dataset: Hybrid",
                id: "hybrid",
                dateParser: "hybrid",
                type: "basic",
                options: { items: items }
            },{
                title: "Test Dataset: ISO8601",
                id: "iso8601",
                dateParser: "iso8601",
                type: "basic",
                options: { items: isoItems }
            },{
                title: "Test Dataset: Gregorian",
                id: "gregorian",
                dateParser: "gregorian",
                type: "basic",
                options: { items: gregorianItems }
            }
        ]
    });
    setUpPageStatus = "complete";
}
