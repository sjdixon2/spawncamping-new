
function time_between_in_words(from_date, to_date)
{
    var diff = Math.abs(to_date.getTime() - from_date.getTime());

    var _minute = 60000;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var _week = _day * 7;
    var _month = _day * 30.4368;
    var _year = _day * 365;

    var message = "";
    if(diff < _minute) {
        message = "a moment";
    }
    else if(diff < _hour) {
        var m = Math.floor(diff / _minute);
        message = (m == 1) ? "1 minute" : m + " minutes";
    }
    else if(diff < _day) {
        var h = Math.floor(diff / _hour);
        message = (h == 1) ? "1 hour" : h + " hours";
    }
    else if(diff < _week) {
        var d = Math.floor(diff / _day);
        message = (d == 1) ? "1 day" : d + " days";
    }
    else if(diff < _month) {
        var w = Math.floor(diff / _week);
        message = (w == 1) ? "1 week" : w + " weeks";
    }
    else if(diff < _year) {
        var m = Math.floor(diff / _month);
        message = (m == 1) ? "1 month" : m + " months";
    }
    else {
        var y = Math.floor(diff / _year);
        message = (y == 1) ? "1 year" : y + " years";
    }

    return message;
}

function time_ago_in_words(date) {

    return time_between_in_words(date, new Date());
}
