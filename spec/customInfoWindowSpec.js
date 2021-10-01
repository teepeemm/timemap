
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
                "title" : "Test Event 1",
                "options" : {
                    "description": "Test Description",
                    "extra": "spam",
                    "infoTemplate": '<span id="custom">{{title}} - {{description}} - {{extra}}</span>'
                }
            },{
                "start" : "1980-01-02",
                "point" : {
                    "lat" : 23.456,
                    "lon" : 12.345
                },
                "title" : "Test Event 2",
                "options" : {
                    "openInfoWindow": function() {
                        $('body').append('<div id="custom2">' + this.opts.title + '<div>');
                    },
                    "closeInfoWindow": function() {
                        $('#custom2').remove();
                    }
                }
            },{
                "start" : "1980-01-02",
                "point" : {
                    "lat" : 23.456,
                    "lon" : 12.345
                },
                "title" : "Test Event 3",
                "options" : {
                    "description": "Test Description",
                    "openInfoWindow": function() {
                        $('body').append('<div id="custom3">' + this.getInfoHtml() + '<div>');
                    },
                    "closeInfoWindow": function() {
                        $('#custom3').remove();
                    }
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
    return $('span#custom').length == 1
}

describe("info template", () => {
    beforeAll(setUpPage);
    it("should find the template info window", () => {
        expect( IWT.success ).toBeTruthy();
    });
    it("should have the correct content", () => {
        expect( $('span#custom').text() )
            .toBe( 'Test Event 1 - Test Description - spam' );
    });
});

describe("close on hide", () => {
    beforeAll( () => {
        IWT.tm.datasets['test'].getItems()[0].hidePlacemark();
    });
    it("should remove the window", () => {
        if (IWT.tm.map.api == 'microsoft') {
            expect( $('span#custom').css('visibility') ).toBe("hidden");
        } else {
            expect( $('span#custom').length ).toBe(0);
        }
    });
});

describe("custom open", () => {
    beforeAll( () => {
        IWT.tm.datasets['test'].getItems()[1].openInfoWindow();
    });
    it("should open the window", () => {
        expect( $('div#custom2').length ).toBe(1);
    });
    describe("closing", () => {
        beforeAll( () => {
            IWT.tm.datasets['test'].getItems()[1].closeInfoWindow();
        });
        it("should close the window", () => {
            expect( $('div#custom2').length ).toBe(0);
        });
    });
});

describe("custom info html", () => {
    beforeAll( () => {
        IWT.tm.datasets['test'].getItems()[2].openInfoWindow();
    });
    it("should open the window", () => {
        expect( $('div#custom3').length ).toBe(1);
    });
    it("should have the correct title", () => {
        expect( $('div#custom3 div.infotitle').text() )
            .toBe( IWT.dataset.options.items[2].title );
    });
    it("should have the correct description", () => {
        expect( $('div#custom3 div.infodescription').text() )
            .toBe( IWT.dataset.options.items[2].options.description );
    });
    describe("closing", () => {
        beforeAll( () => {
            IWT.tm.datasets['test'].getItems()[2].closeInfoWindow();
        });
        it("should close the window", () => {
            expect( $('div#custom3').length ).toBe(0);
        });
    });
});
