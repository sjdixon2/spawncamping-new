function calcMonths(from_date, to_date){
    var numFullMonths = (to_date.getMonth() - from_date.getMonth() + 12) % 12;
    if (to_date.getDate() < from_date.getDate()){
        numFullMonths = numFullMonths - 1;
    }
    return numFullMonths;
}

function calcYears(from_date, to_date){
    var numFullMonths = calcMonths(from_date, to_date);
    var numFullYears = to_date.getYear() - from_date.getYear();
    if ( Math.floor(numFullMonths/12) < numFullYears){
        numFullYears = numFullYears - 1;
    }
    return numFullYears;
}

function time_between_in_words(from_date, to_date){
    //(e.g., 'a moment', '1 minute', '3 hours', '2 days', '1 week', '6 months' or '25 years').
    var second =1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    var d2 = to_date.getTime();
    var d1 = from_date.getTime();
    var difference = d2 - d1;
    var time = 0;
    var unit = 'null';
    var statement = '';
    

    if (difference < second && difference > 0){
        statement = 'A moment';
        //console.log(statement);
        return statement;
    }
    else if (difference >= second && difference < minute){
        time = Math.floor(difference / second);
        unit = 'second';
    }
    else if (difference >= minute && difference < hour){
        time = Math.floor(difference / minute);
        unit = 'minute';    
    }
    else if (difference >= hour && difference < day){
        time = Math.floor(difference / hour);
        unit = 'hour';
    }
    else if (difference >= day && difference < week){
        time = Math.floor(difference / day);
        unit = 'day';
    }
    else if (difference >= week){
        var numWeeks = 0;
        var numYears = to_date.getYear() - from_date.getYear();
        
        // Calculate full years elapsed
        var fullYearsElapsed = calcYears(from_date, to_date);
        var fullMonthsElapsed = calcMonths(from_date, to_date);
        
        if (fullYearsElapsed != 0){
            time = fullYearsElapsed;
            unit = 'year';
        }
        else if (fullMonthsElapsed != 0){
            time = fullMonthsElapsed;
            unit = 'month';
        }
        else {
            time = Math.floor(difference / week);
            unit = 'week';
        }
    }
    
    if (time!=1){
        unit += 's';
    }
    statement = '' + time + ' ' + unit
    return statement;
}

function DateAdd(date, type, amount){
    var y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate();
    var H = date.getHours(), 
        M=date.getMinutes(), 
        S=date.getSeconds(), 
        MS=date.getMilliseconds();
    if(type === 'y'){
        y += amount;
    }
    if(type === 'm'){
        m += amount;
    }
    if(type === 'd'){
        d += amount;
    }
    
    if(type == 'H'){
        H += amount;
    }
    if(type == 'M'){
        M += amount;
    }
    if(type == 'S'){
        S += amount;
    }
    if(type == 'MS'){
        MS += amount;
    }
    var newDate = new Date(y,m,d, H, M, S, MS);
    //console.log(newDate);
    return newDate;
}

function time_ago_in_words(date){
    var today = new Date();
    console.assert(today.getTime() - date.getTime() >= 0);
    var returned= '' + time_between_in_words(date, today) + ' ago.';
    return returned;
}

function test_date_calculator(){
    var today = new Date();
    var fiveDaysAgo = DateAdd(today, 'd', -5);
    var oneWeekAgo = DateAdd(today, 'd', -8);
    var fiveMonthsAgo = DateAdd(today, 'm', -5);
    var thirteenMonthsAgo = DateAdd(today, 'm', -13);
    var y2k = new Date(2000, 0, 1);
    
    console.assert(time_ago_in_words(fiveDaysAgo)==='5 days ago.');
    console.assert(time_ago_in_words(oneWeekAgo)==='1 week ago.');
    console.assert(time_ago_in_words(fiveMonthsAgo)==='5 months ago.');
    console.assert(time_ago_in_words(thirteenMonthsAgo)==='1 year ago.');
    console.assert(time_ago_in_words(y2k)==='13 years ago.');
}

function test_time_calculator(){
    var today = new Date();
    var fiveMilliAgo = DateAdd(today, 'MS', -5);
    var fiveSecAgo = DateAdd(today, 'S', -5);
    var fiveMinAgo = DateAdd(today, 'M', -5);
    var fiveHourAgo = DateAdd(today, 'H', -5);
    
    console.assert(time_ago_in_words(fiveMilliAgo)==='A moment ago.');
    console.assert(time_ago_in_words(fiveSecAgo)==='5 seconds ago.');
    console.assert(time_ago_in_words(fiveMinAgo)==='5 minutes ago.');
    console.assert(time_ago_in_words(fiveHourAgo)==='5 hours ago.');
}


Date.prototype.time_ago_in_words = function(){
    return time_ago_in_words(this);
}

Date.prototype.time_between_in_words = function(date){
    var returned = time_between_in_words(date, this);
    return returned;
}

function test_prototypes(){
    var today = new Date();
    var oneWeekAgo = DateAdd(today, 'd', -7);
    console.log(oneWeekAgo);
    console.assert(today.time_between_in_words(oneWeekAgo)==='1 week');
    console.assert(oneWeekAgo.time_ago_in_words()==='1 week ago.');
}


//test_date_calculator();
//test_time_calculator();
//test_prototypes();

console.log("Woot!");
