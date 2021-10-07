
(function () {

let tm;
    
const timeoutInterval = 100,
    maxAttempts = 30,
    dataset = {
        id: "test",
        type: "basic",
        options: {
            items: [
                {
                    "start" : "1980-01-02",
                    "point" : {
                        "lat" : 23.0,
                        "lon" : 12.0
                    },
                    "title" : "Test Event 1",
                    "options" : { "description": "Test Description" }
                },{
                    "start" : "1980-01-02",
                    "point" : {
                        "lat" : 24.0,
                        "lon" : 13.0
                    },
                    "title" : "Test Event 2",
                    "options" : { "description": "Test Description" }
                },{
                    "start" : "1980-01-02",
                    "point" : {
                        "lat" : 25.0,
                        "lon" : 14.0
                    },
                    "title" : "Test Event 3",
                    "options" : { "description": "Test Description" }
                }
            ]
        }
    };

function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [ dataset ]
    });
}

// we need some delay or Google maps v3 won't close windows
function openItem(x,done) {
    const item = tm.datasets['test'].getItems()[x];
    if (item) {
        item.openInfoWindow();
        setTimeout(openItem, 150, x+1, done);
    } else {
        testLastWindowOpen(done,0);
    }
}

function testLastWindowOpen(done,attempts) {
    if ( lastWindowOpen() ) {
        done();
    } else if ( maxAttempts < attempts ) {
        throw 'took too long';
    } else {
        setTimeout(testLastWindowOpen, timeoutInterval, done, attempts+1);
    }
}

function lastWindowOpen() {
    // this is effectively the assertion
    return $('div.infotitle, div.infodescription').length == 2 &&
        $('div.infotitle').text() == 'Test Event 3'
}

function expectNoWindowsOpen() {
    if ( tm.map.api === 'microsoft' ) {
        expect( $('div.infotitle').css('visibility') ).toBe("hidden");
    } else {
        expect( $('div.infotitle').length ).toBe(0);
    }
}

describe("multiple windows", () => {
    beforeAll(setUpPage);
    describe("opening windows", () => {
        beforeAll( (done) => {
            expectNoWindowsOpen();
            openItem(0,done)
        });
        it("should open one info window", () => {
            expect( lastWindowOpen() ).toBeTrue();
            tm.timeline.getBand(0).setCenterVisibleDate(new Date());
            expectNoWindowsOpen();
        });
    });
    afterAll( () => {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

}());
