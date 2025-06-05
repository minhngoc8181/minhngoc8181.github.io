var allProblems = JSON.parse(localStorage.getItem('tinhoctre')) || {};

var problems = [];

$('#contest-problems a').each(function (index) {
    problems.push({
        'title': $(this).text().trim(),
        'url': $(this).prop('href'),
        'contest': $('.page-title h2').text().trim(),
        'index': index + 1
    });
})

function getProblem() {
    var problem = problems.shift();

    if (!problem || !problem.url || problem.tried > 3) {
        console.log('All problems downloaded');
        localStorage.setItem('tinhoctre', JSON.stringify(allProblems));
        return;
    }

    $.get(problem.url, function (html) {
        var jQuery = $($.parseHTML(html));
        problem.html = jQuery.find('#content-left > div.content-description > div').html();
        problem.pdf = jQuery.find('#content-left > div.content-description > iframe[src]').prop('src');
        if (!problem.pdf && !problem.html && jQuery.find('#pdfContainer').attr('data')) {
            problem.pdf = 'https://tinhoctre.vn' + jQuery.find('#pdfContainer').attr('data');
        }
        allProblems[problem.url] = problem;
        getProblem();
    }).fail(function () {
        console.error('Failed to download problem:', problem.index, problem.title);
        problem.tried = (problem.tried || 0) + 1;
        problems.push(problem);
        getProblem();
    });
}


getProblem();


//Object.values(allProblems).filter(p => p.contest.indexOf('ĐỀ LUYỆN TẬP TIN HỌC TRẺ - BẢNG A') >= 0)
//console.log(JSON.stringify(allProblems, null, 2));