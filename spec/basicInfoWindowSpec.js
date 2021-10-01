
jasmine.getEnv().configure({ random: false });

IWT.dataset = {
    id: "test",
    type: "basic",
    options: {
        items: [
            {
                "start" : "1980-01-02",
                "point" : {
                    "lat" : 23.456,
                    "lon" : 12.345
                },
                "title" : "Test Event",
                "options" : {
                    "description": "Test Description"
                }
            }
        ]
    }
};

IWT.setup = function() {
    IWT.tm.datasets['test'].getItems()[0].openInfoWindow();
}

IWT.setupTest = function() {
    // this is effectively the assertion
    return $('div.infotitle, div.infodescription').length == 2
}

describe("basic info window", () => {
    beforeAll(setUpPage);
    describe("default open", () => {
        it("should find the info window divs", () => {
            expect( IWT.success ).toBeTruthy();
        });
        it("should have the correct title", () => {
            expect( $('div.infotitle').text() )
                .toBe( IWT.dataset.options.items[0].title );
        });
        it("should have the correct description", () => {
            expect( $('div.infodescription').text() )
                .toBe( IWT.dataset.options.items[0].options.description );
        });
    });
    describe("default close", () => {
        beforeAll( () => {
            IWT.tm.datasets['test'].getItems()[0].closeInfoWindow();
        });
        it("should remove the divs", () => {
            if ( IWT.tm.map.api === "microsoft" ) {
                expect( $("div.infotitle").css("visibility") ).toBe( "hidden" );
                expect( $("div.infodescription").css("visibility") )
                    .toBe( "hidden" );
            } else {
                expect( $('div.infotitle, div.infodescription').length ).toBe(0);
            }
        });
    });
});
