
jasmine.getEnv().configure({ random: false });

let tm;

function setUpPage() {
    const items = [
        {
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 40.0,
                "lon" : 12.0
            },
            "title" : "Test Event 1"
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 41.0,
                "lon" : 13.0
            },
            "title" : "Test Event 2"
        },{
            "start" : "1980-01-02",
            "end" : "1990-01-02",
            "point" : {
                "lat" : 42.0,
                "lon" : 14.0
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
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                type: "basic",
                options: { items: items }
            }
        ]
    });
    setUpPageStatus = "complete";
    tm.setSelected(undefined);
}

function expectSelected(chosenItem) {
    expect( tm.getSelected() ).toBe(chosenItem);
    expect( chosenItem.isSelected() ).toBeTrue();
    tm.datasets["test"].getItems().filter( (item) => chosenItem!==item )
        .forEach( expectNotSelected )
}

function expectNotSelected(item) {
    expect( tm.getSelected() ).not.toBe(item);
    expect( item.isSelected() ).toBeFalse();
}

function expectNoSelection() {
    expect( tm.getSelected() ).toBeUndefined();
}

describe("selections", () => {
    beforeAll(setUpPage);
    it("can directly select", () => {
        expectNoSelection();
        tm.datasets["test"].getItems().forEach( (item) => {
            tm.setSelected(item);
            expectSelected(item);
        })
        tm.setSelected(undefined);
        expectNoSelection();
    });
    it("selects open windows", () => {
        expectNoSelection();
        tm.datasets["test"].getItems().forEach( (item) => {
            item.openInfoWindow();
            expectSelected(item);
            item.closeInfoWindow();
            expectNoSelection();
        });
        expectNoSelection();
    });
});
