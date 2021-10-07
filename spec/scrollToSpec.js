
(function () {

let tm;

const items = [
        {
            "start" : "1980-01-02",
            "title" : "Test Event 1980",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            }
        },
        {
            "start" : "2000-01-02",
            "title" : "Test Event 2000",
            "point" : {
                "lat" : 23.456,
                "lon" : 12.345
            }
        }
    ],
    years = items.map( (item) => (new Date(item.start)).getUTCFullYear() );

function loadWithScrollTo(scrollTo) {
    // fix for a bug in early simile version
    const timelineVersion = TimeMap.util.TimelineVersion();
    if ( Number(timelineVersion.replace(/^\D*(\d+(\.\d+)?).*$/,"$1")) < 2 ) {
        tm.timeline.getBand(0)._eventPainter._layout._laidout = false;
    }
    // initialize load manager
    const loadManager = TimeMap.loadManager;
    loadManager.init(tm, 1, { scrollTo: scrollTo });
    const loader = new TimeMap.loaders.basic({items: items});
    loader.load(tm.datasets["test"], loadManager.complete.bind(loadManager));
}

function setUpPage() {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        scrollTo: "earliest",
        datasets: [
            {
                title: "Test Dataset",
                id: "test",
                type: "basic",
                options: { items: [] }
            }
        ]
    });
}

describe("scroll to desired dates", () => {
    beforeAll(setUpPage);
    it("scrolled to the earliest", () => {
        loadWithScrollTo('earliest')
        expect( tm.timeline.getBand(0).getCenterVisibleDate().getUTCFullYear() )
            .toBe(1980);
        loadWithScrollTo('first');
        expect( tm.timeline.getBand(0).getCenterVisibleDate().getUTCFullYear() )
            .toBe(1980);
    });
    it("scrolled to the latest", () => {
        loadWithScrollTo('latest');
        expect( tm.timeline.getBand(0).getCenterVisibleDate().getUTCFullYear() )
            .toBe(2000);
        loadWithScrollTo('last');
        expect( tm.timeline.getBand(0).getCenterVisibleDate().getUTCFullYear() )
            .toBe(2000);
    });
    it("scrolled to a given string date", () => {
        // have to be somewhat loose here because of pixel-to-date conversion
        loadWithScrollTo('1990-01-03');
        expect( tm.timeline.getBand(0).getCenterVisibleDate().getUTCFullYear() )
            .toBe(1990);
    });
    it("scrolled to a given Date date", () => {
        loadWithScrollTo(new Date(1990, 1, 1));
        expect( tm.timeline.getBand(0).getCenterVisibleDate().getUTCFullYear() )
            .toBe(1990);
        years.forEach( (year,index) => {
            expect( tm.getItems()[index] ).toBeDefined();
            tm.getItems()[index].scrollToStart();
            expect( tm.timeline.getBand(0).getCenterVisibleDate().getUTCFullYear() )
                .toBe( year );
        });
    });
    afterAll( () => {
        tm.clear();
        $('.timelinediv').empty().removeClass().addClass('timelinediv');
        $('.mapdiv').empty().removeAttr('style');
    });
});

}());
