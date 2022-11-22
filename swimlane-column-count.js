

window.addEventListener('load', function () {
    (function() {
        'use strict';

        const issuesWrappers = document.getElementsByClassName('ghx-wrap-issue');

        [].forEach.call(issuesWrappers, issue => {
            issue.insertAdjacentHTML('afterbegin','<p>' + issue.childElementCount + ' issues</p>');
        })
    })();
})
