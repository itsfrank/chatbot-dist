"use strict";
var TimeService = (function () {
    function TimeService() {
    }
    TimeService.formatEventsDate = function (date_str) {
        console.log(date_str);
        var date = new Date(date_str);
        var date_str = TimeService.dayNames[date.getDay()] + ' ' + TimeService.monthNames[date.getMonth()] + ' ' + date.getDate();
        date_str = date_str + ', ' + TimeService.getTimeString(date);
        return date_str;
    };
    TimeService.getTimeString = function (date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var halfDay = 'am';
        if (hour > 11) {
            if (hour != 12)
                hour = hour - 12;
            halfDay = 'pm';
        }
        if (minutes < 10)
            minutes = '0' + minutes;
        return hour + ':' + minutes + halfDay;
    };
    TimeService.monthNames = [
        'Jan',
        'Feb',
        'Mar',
        "Apr",
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    TimeService.dayNames = [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
    ];
    return TimeService;
}());
exports.TimeService = TimeService;
//# sourceMappingURL=time_service.js.map