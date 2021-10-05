
jasmine.getEnv().configure({ random: false });

const dataset = {
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

// this is the test preamble
setup = openItem.bind(undefined,0);

// we need some delay or Google maps v3 won't close windows
function openItem(x) {
    const item = tm.datasets['test'].getItems()[x];
    if (item) {
        item.openInfoWindow();
        setTimeout(openItem, 150, x+1);
    }
}

function setupTest() {
    // this is effectively the assertion
    return $('div.infotitle, div.infodescription').length == 2 &&
        $('div.infotitle').text() == 'Test Event 3'
}

describe("multiple windows", () => {
    describe("opening windows", () => {
        beforeAll(setUpPage);
        afterAll( () => {
            tm.timeline.getBand(0).setCenterVisibleDate(new Date());
        });
        it("should open one info window", () => {
            expect( success ).toBeTrue();
            expect( setupTest() ).toBeTrue();
        });
    });
    describe("close window on scroll", () => {
        it("should remove the divs", () => {
            if ( tm.map.api === 'microsoft' ) {
                expect( $('div.infotitle').css('visibility') ).toBe("hidden");
            } else {
                expect( $('div.infotitle').length ).toBe(0);
            }
        });
    });
});
