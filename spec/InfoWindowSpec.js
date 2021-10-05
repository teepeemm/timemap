
let tm, success
    
const timeoutInterval = 100,
    maxAttempts = 30;

function setUpComplete(done,attempts) {
    success = setupTest();
    if ( success || maxAttempts < attempts ) {
        setUpPageStatus = "complete";
        done();
    } else {
        setTimeout(setUpComplete, timeoutInterval, done, attempts+1);
    }
}

function setUpPage(done) {
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required) 
        datasets: [ dataset ]
    });
    setup();
    setUpComplete(done);
}
