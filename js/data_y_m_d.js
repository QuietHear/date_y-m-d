let fullTime = [], // 输出的时间
    nowYear, // 当前年
    nowMonth, // 当前月，0-11
    nowDay, // 当前日，1-xx
    nowWeek, // 当前星期几，0-6 周天到周一
    standard = 1, // 周首日--周一
    mode = 'day', // 单位，默认选day。day：选某一天,week：选某一周,doubleDay：选一个时间范围,mouth：选一个月,doubleMouth：选一个月范围
    dataArrLength = 42, // 每页数据总数量，6*7=42条数据
    dataArr = [], // 前显示月的数据
    canSelAll = false, // 今天后面的天是否可选，true可选，false不可选
    titleArr = ['日', '一', '二', '三', '四', '五', '六'];

//初始化
function init() {
    let time = new Date();
    nowYear = time.getFullYear();
    nowMonth = time.getMonth() + 1;
    nowDay = time.getDate();
    nowWeek = time.getDay();
    $('.date_selector .body').attr('class', mode === 'day' ? 'body day' : mode === 'week' ? 'body week' : 'body doubleDay');
    getTitle();
    getCalendar(nowYear, nowMonth);
}

//输出日历表头
function getTitle() {
    let arr = [], begin = standard;
    for (let i = 0; i < 7; i++, begin++) {
        if (begin > 6) {
            begin = 0;
        }
        arr.push(titleArr[begin]);
    }
    let titleArrCopy = [...arr];
    let str = '';
    for (let i = 0; i < titleArrCopy.length; i++) {
        if (i === 0) {
            str += '<div class="row">';
        }
        str += `<div class="item"><div class="inner">${titleArrCopy[i]}</div></div>`;
        if (i === titleArrCopy.length - 1) {
            str += '</div>';
        }
    }
    $('.date_selector .title').html(str);
}

//检测是否为闰年
function checkLeapYear(year) {
    return year % 4 === 0 ? (year % 100 === 0 ? (year % 400 === 0 ? true : false) : true) : false;
}

//输出对应月有多少天
function oneMonth(year, month) {
    //处理数据
    if (month === 0) {//当前月的前个月可能的情况
        year = year - 1;
        month = 12;
    }
    else if (month === 13) {//当前月的下个月可能的情况
        year = year + 1;
        month = 1;
    }
    let leapYear = checkLeapYear(year);
    switch (month) {
        case 1:
            return 31;
        case 2:
            return leapYear ? 29 : 28;
        case 3:
            return 31;
        case 4:
            return 30;
        case 5:
            return 31;
        case 6:
            return 30;
        case 7:
            return 31;
        case 8:
            return 31;
        case 9:
            return 30;
        case 10:
            return 31;
        case 11:
            return 30;
        case 12:
            return 31;
    }
}

//输出某个月的日历
function getCalendar(year, month) {
    let time = new Date(),
        firstDay,
        beforeCount,
        afterCount,
        dayCount;
    dataArr = [];
    dayCount = oneMonth(year, month);
    //当前月数据
    for (let i = 1; i <= dayCount; i++) {
        dataArr.push({
            num: i,
            data: `${year}-${month}-${i}`,
            today: year === nowYear && month === nowMonth && i === nowDay ? true : false,
            afterDay: year > nowYear || (year === nowYear && month > nowMonth) || (year === nowYear && month === nowMonth && i > nowDay) ? true : false
        });
    }
    time.setFullYear(year);
    time.setMonth(month - 1);
    time.setDate(1);
    firstDay = time.getDay();
    //添加前面日期
    if (firstDay - standard > 0) {
        beforeCount = firstDay - standard;
    }
    else {
        beforeCount = 7 + (firstDay - standard);
    }
    let lin = oneMonth(year, month - 1);
    for (let i = 0; i < beforeCount; i++) {
        dataArr.unshift({
            num: lin - i,
            cantUse: true,
            data: `${(month - 1) < 1 ? year - 1 : year}-${(month - 1) < 1 ? 12 : (month - 1)}-${lin - i}`
        });
    }
    //添加后面日期
    afterCount = dataArrLength - dataArr.length;
    for (let i = 1; i <= afterCount; i++) {
        dataArr.push({
            num: i,
            cantUse: true,
            data: `${(month + 1) > 12 ? year + 1 : year}-${(month + 1) > 12 ? 1 : (month + 1)}-${i}`
        });
    }
    let str = '';
    for (let i = 0; i < dataArr.length; i++) {
        if (i === 0) {
            str += '<div class="row">';
        }
        str += `<div class="item ${dataArr[i].cantUse === true ? 'cantUse' : ''}
            ${canSelAll === false && dataArr[i].afterDay === true ? 'noHover' : ''}
            ${dataArr[i].today === true ? 'today' : ''}"
            data-time="${dataArr[i].data}">
                <div class="inner">
                    ${dataArr[i].num}      
                </div>
            </div>`;
        if ((i + 1) % 7 === 0) {
            if (i !== dataArr.length - 1) {
                str += '</div><div class="row">';
            }
            else {
                str += '</div>';
            }
        }
    }
    $('.date_selector .head .year div').html(year);
    $('.date_selector .head .month div').html(month);
    $('.date_selector .body').html(str);
}

$('body').on('click', '.date_selector .head .year .btn', function (event) { // 更改当前年
    let year = parseInt($(event.target).parent().find('div').html());
    let month = parseInt($('.date_selector  .head .month div').html());
    if ($(event.target).hasClass('prev')) {
        getCalendar(year - 1, month);
    }
    else {
        getCalendar(year + 1, month);
    }
})
    .on('click', '.date_selector .head .month .btn', function (event) { // 更改当前月
        let year = parseInt($('.date_selector  .head .year div').html());
        let month = parseInt($(event.target).parent().find('div').html());
        if ($(event.target).hasClass('prev')) {
            if (month - 1 < 1) {
                year -= 1;
                month = 12;
            }
            else {
                month -= 1;
            }
            getCalendar(year, month);
        }
        else {
            if (month + 1 > 12) {
                year += 1;
                month = 1;
            }
            else {
                month += 1;
            }
            getCalendar(year, month);
        }
    })
    .on('click', '.date_selector .body .item', function () { // 输出当前日期
        if ($(this).closest('.body').hasClass('doubleDay')) { // 区间模式
            console.log(this);
        }
        else if ($(this).closest('.body').hasClass('week')) { // 周模式
            $('.date_selector .body .item').removeClass('select between');
            let parent = $(this).closest('.row').find('.item'),
                $begin,
                $end;
            for (let i = 0; i < parent.length; i++) {
                if (i === 0) {
                    $begin = $(parent[i]).addClass('select').attr('data-time');
                }
                else if (i === (parent.length - 1)) {
                    $end = $(parent[i]).addClass('select').attr('data-time');
                }
                $(parent[i]).addClass('between');
            }
            fullTime[0] = $begin;
            fullTime[1] = $end;
            console.log(fullTime);
            $('#a').val($begin + ' 到 ' + $end);
        }
        else { // 天模式
            $('.date_selector .body .row').removeClass('select');
            if (!$(this).hasClass('cantUse') && !$(this).hasClass('noHover')) {
                $('.date_selector .body .item').removeClass('select');
                $(this).addClass('select');
                $('#a').val($(this).attr('data-time'));
                fullTime[0] = $(this).attr('data-time');
                console.log(fullTime);
            }
        }
    });
