
(function () {

let tm;

const customIcon = "fakeimg.png",
    customTheme = new TimeMapTheme({
        "color": "#0000FF",
        "icon": customIcon,
        "eventIconPath": '../images/dsC3/'
    }),
    itemsA =  [
        {
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event A1"
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event A2",
            "options": {
                "eventIconPath": '../images/dsA2/',
                "theme": "orange"
            }
        }
    ],
    itemsB = [
        {
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event B1"
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event B2",
            "options": { "theme": "yellow" }
        }
    ],
    itemsC = [
        {
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event C1"
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event C2",
            "options" : { "icon": customIcon }
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            },
            "title" : "Test Event C3",
            "options": { "theme": customTheme }
        }
    ];

function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        options: {
            eventIconPath: '../images/',
            theme: "blue"
        },
        datasets: [
            {
                title: "Test Dataset A",
                id: "testA",
                theme: "green",
                type: "basic",
                options: {
                    eventIconPath: '../images/dsA/',
                    items: itemsA
                }
            },{
                title: "Test Dataset B",
                id: "testB",
                type: "basic",
                options: { items: itemsB }
            },{
                title: "Test Dataset C",
                id: "testC",
                theme: "purple",
                type: "basic",
                options: { items: itemsC }
            }
        ]
    });
}

function setUp() {
    setUpPage();
    const eventSource = tm.timeline.getBand(0).getEventSource();
    tm.timeline.getBand(0).setCenterVisibleDate(eventSource.getEarliestDate());
    tm.showDatasets();
}

describe("themes", () => {
    beforeAll(setUp);
    it("has cascading theme colors", () => {
        expect( tm.datasets["testA"].getItems()[0].event._color )
            .toBe( TimeMap.themes.green.color );
        expect( tm.datasets["testA"].getItems()[1].event._color )
            .toBe( TimeMap.themes.orange.color );
        expect( tm.datasets["testB"].getItems()[0].event._color )
            .toBe( TimeMap.themes.blue.color );
        expect( tm.datasets["testB"].getItems()[1].event._color )
            .toBe( TimeMap.themes.yellow.color );
        expect( tm.datasets["testC"].getItems()[0].event._color )
            .toBe( TimeMap.themes.purple.color );
        expect( tm.datasets["testC"].getItems()[2].event._color )
            .toBe( customTheme.color );
    });
    it("has cascading theme event icons", () => {
        expect( tm.datasets["testA"].getItems()[0].event._icon.substr(0, 14) )
            .toBe( '../images/dsA/' );
        expect( tm.datasets["testA"].getItems()[1].event._icon.substr(0, 15) )
            .toBe( '../images/dsA2/' );
        expect( tm.datasets["testB"].getItems()[0].event._icon.substr(0, 10) )
            .toBe( '../images/' );
        expect( tm.datasets["testB"].getItems()[1].event._icon.substr(0, 10) )
            .toBe( '../images/' );
        expect( tm.datasets["testC"].getItems()[0].event._icon.substr(0, 10) )
            .toBe( '../images/' );
        expect( tm.datasets["testC"].getItems()[2].event._icon.substr(0, 10) )
            .toBe( '../images/' );
    });
    it("has cascading theme marker icons", () => {
        expect( tm.datasets["testA"].getItems()[0].placemark.iconUrl )
            .toBe( TimeMap.themes.green.icon );
        expect( tm.datasets["testA"].getItems()[1].placemark.iconUrl)
            .toBe( TimeMap.themes.orange.icon );
        expect( tm.datasets["testB"].getItems()[0].placemark.iconUrl )
            .toBe( TimeMap.themes.blue.icon );
        expect( tm.datasets["testB"].getItems()[1].placemark.iconUrl)
            .toBe( TimeMap.themes.yellow.icon );
        expect( tm.datasets["testC"].getItems()[0].placemark.iconUrl )
            .toBe( TimeMap.themes.purple.icon );
        expect( tm.datasets["testC"].getItems()[1].placemark.iconUrl)
            .toBe( customIcon );
        expect( tm.datasets["testC"].getItems()[2].placemark.iconUrl)
            .toBe( customTheme.icon );
    })
    afterAll( () => {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

}());
