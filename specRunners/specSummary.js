
if ( window.jasmine ) {
    jasmine.getEnv().addReporter({
        jasmineDone: function () {
            if ( window.parent !== window ) {
                parent.postMessage(getJasmineSummary(),'*');
            }
        }
    });
}

function getJasmineSummary() {
    let specSuccesses = 0,
        specFailures = 0,
        expectSuccesses = 0,
        expectFailures = 0;
    jsApiReporter.specs().forEach( (spec) => {
        if ( spec.status === 'passed' ) {
            specSuccesses += 1;
        } else {
            specFailures += 1;
        }
        expectSuccesses += spec.passedExpectations.length;
        expectFailures += spec.failedExpectations.length;
    });
    const pathname = location.pathname,
        filename = pathname.slice(pathname.lastIndexOf('/')+1);
    return {
        summary: {
            specSuccesses: specSuccesses,
            specFailures: specFailures,
            expectSuccesses: expectSuccesses,
            expectFailures: expectFailures
        },
        filename: filename
    };
}

if ( window.parent === window ) {
    addEventListener('message',jasmineTimemapComplete);
}

function jasmineTimemapComplete(jasmineSummary) {
    console.log('jasmineTimemapComplete');
    console.log(jasmineSummary);
    Object.entries(jasmineSummary.data.summary).forEach( ([k,v]) => {
        $(`a[href="${jasmineSummary.data.filename}"] span.${k}`).text(v);
    });
}
