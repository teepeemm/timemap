
// namespace for info window tests
const IWT = {};
    
IWT.setUpEventually = function (donecb) {
    const timeoutLimit = 3000,
        timeoutInterval = 100;
    let elapsed = 0,
        timeoutId;
    function look(done) {
        IWT.success = IWT.setupTest();
        if ( IWT.success || elapsed > timeoutLimit ) {
            setUpPageStatus = "complete";
            done();
        } else {
            elapsed += timeoutInterval;
            timeoutId = window.setTimeout(look, timeoutInterval, done);
        }
    }
    look(donecb);
}

function setUpPage(done) {
    IWT.tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required) 
        datasets: [ 
            IWT.dataset
        ]
    });
    IWT.setup();
    IWT.setUpEventually(done);
}
