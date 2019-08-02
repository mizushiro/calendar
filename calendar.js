AIRFINDER = {
    lineType : 'RT',
    set : {
        date :{
            RT : [{
                sId : 'rt_departure_1',
                eId : 'rt_arrival_1',
                sVal : '', // 체크인
                eVal : '', // 체크아웃
                sDay : '', // 체크인 요일
                eDay : '' // 체크아웃 요일
            }]
        }
    }, //set
};

AIRFINDER.search = {
    init: function(){
        this.finderCategorySlider();
        this.finderInputReset();
        this.finderToggleControl();
        this.finderInputIsEmptyDetect();
    },
    set : function(setData){
        if(setData){
            $.extend(AIRFINDER.set,setData)
        }
        this.updateFinder();
    },
    updateFinder : function(){
        var dataRoot  = AIRFINDER.set;
        var dateSplit = function(d){ //년도삭제된 날짜구하기
            return d.substr(5,9);
        }
        //날짜
        Object.keys(dataRoot.date).forEach(function (k) {
            for(i=0;i<dataRoot.date[k].length;i++){
                var sId = dataRoot.date[k][i].sId;
                var sVal = dataRoot.date[k][i].sVal;
                var sDay = dataRoot.date[k][i].sDay;
                var shortD = dateSplit(sVal);


                if( k == 'RT'){
                    var eId = dataRoot.date[k][i].eId;
                    var eVal = dataRoot.date[k][i].eVal;
                    var eDay = dataRoot.date[k][i].eDay;
                    $('#'+eId).val(eVal).siblings('.box__date-info').find('.text__date').text(eDay+'요일');
                }
            }
        });
        AIRFINDER.search.finderInputIsEmptyDetect();
    },
    finderCategorySlider : function(){
        $(document).on('click','.box__layer-air-finder .js-slider',function(e){
            e.preventDefault();
            var activeClass = 'list-item--active';
            $(this).parent('.js-list-item').toggleClass(activeClass).siblings().removeClass(activeClass);
        })
    },
    finderInputReset : function(){
        $(document).on('click','.js-button__delete-keyword',function(){
            $(this).prev('.form__input-finder').val('');
            $('.form__input-finder').focus();
        })
    },
    finderToggleControl : function(){
        $(document).on('click','.js-button__toggle-control',function(){
            var $target=$($(this).attr('data-target'));
            $(this).toggleClass('button__toggle--active');
            $target.toggle();
        });
    },
    finderInputIsEmptyDetect : function(){
        //for crossbrowsing placeholder-shown styling :: add/remove class
        var $inputs = $('.form__input-code,input.form__input-day,.form__input-layer-date');
        $inputs.each(function(){
            var $this = $(this);
            if($this.val()){
                $this.removeClass('form__input--placeholder-shown');
            }else(
                $this.addClass('form__input--placeholder-shown'))
        })
    }
};

var airCalendar = {
    init : function(){
        this.container.datepicker("destroy");
        this.getDate();
        this.callDraw();
        this.checkActiveButton();
        textSetup();
    },
    container: $("#airdatepicker"),
    numberOfMonths: 2,
    dateFormat: 'yy.mm.dd',
    dayNamesMin: ['일','월','화','수','목','금','토'],
    showMonthAfterYear: true,
    inputs: {
        day1: '#form__input-layer-date1',
        day2: '#form__input-layer-date2'
    },
    dates : ['', '', ''], //날짜 temporal store
    days : ['', '', ''], //요일
    setHDay : function(setData){
        if(setData){
            $.extend(airCalendar.hDay,setData)
        }
        this.callDraw();
    },
    hDay : {
        fixed : {
            '1' : [ [ 1, "신정" ] ],
            '2' : [],
            '3' : [ [ 1, "3.1절" ] ],
            '4' : [],
            '5' : [ [ 5, "어린이날" ] ],
            '6' : [ [ 6, "현충일" ] ],
            '7' : [],
            '8' : [ [ 15, "광복절" ] ],
            '9' : [],
            '10' : [ [ 3, "개천절" ], [ 9, "한글날" ] ],
            '11' : [],
            '12' : [ [ 25, "성탄절" ] ]
        },
        lunar : {
            2019 : {
                '2' : [ [ 4, "설날" ],[ 5, "설날" ],[ 6, "설날" ] ],
                '9' : [ [ 12, "추석" ],[ 13, "추석" ],[ 14, "추석" ] ],
                '5' : [ [ 12, "석가탄신일" ] ]
            },
            2020 : {
                '1' : [ [ 24, "설날" ],[ 25, "설날" ],[ 26, "설날" ],[ 27, "설날 대체휴일" ] ],
                '9' : [ [ 30, "추석" ]],
                '10' : [ [ 1, "추석"],[ 2, "추석"] ],
                '4' : [ [ 30, "석가탄신일" ] ]
            },
            2021 : {
                '2' : [ [ 11, "설날" ],[ 12, "설날" ],[ 13, "설날" ] ],
                '9' : [ [ 20, "추석" ],[ 21, "추석" ],[ 22, "추석" ] ],
                '5' : [ [ 19, "석가탄신일" ] ]
            },
            2022 : {
                '1' : [ [ 31, "설날" ]],
                '2' : [ [ 1, "설날" ],[ 2, "설날" ]],
                '5' : [ [ 8, "석가탄신일" ] ],
                '6' : [ [ 1, "지방선거" ] ],
                '9' : [ [ 9, "추석" ],[ 10, "추석" ],[ 11, "추석" ],[ 12, "추석" ]],
                '12' : [ [ 21, "20대 대통령선거" ] ]
            }
        }
    },
    getDate : function(){ // strored date get
        var d1='', d2='',  day1='', day2='';
        var line = AIRFINDER.lineType;
        var dateRoot = AIRFINDER.set.date[line];
        d1 = AIRFINDER.set.date[AIRFINDER.lineType][0].sVal !== ''?dateRoot[0].sVal:'';
        d2 = line == 'RT'? dateRoot[0].eVal : dateRoot[1].sVal;
        day1 = AIRFINDER.set.date[AIRFINDER.lineType][0].sDay !== ''?dateRoot[0].sDay:'';
        day2 = line == 'RT'? dateRoot[0].eDay : dateRoot[1].sDay;
        this.updateDates(d1, d2, day1, day2)
    },
    //updateDates : function(d1, d2, d3, day1, day2, day3){
    updateDates : function(d1, d2, day1, day2){ //날짜, 요일
        for(i=0;i<2;i++){
            //dates 배열, 날짜, 요일 저장
            var n = i+1;
            this.dates[i] = eval('d'+n);
            this.days[i] = eval('day'+n);
            $(this.inputs['day'+n]).val( this.dates[i] );//달력 레이어 인풋에 값 setting
        }
        AIRFINDER.search.finderInputIsEmptyDetect();
    },
    storeDates :function(){ //데이터 저장
        var d1 = this.dates[0];
        var d2 = this.dates[1];
        var day1 = this.days[0];
        var day2 = this.days[1];
        var dateSplit = function(d){ //년도삭제된 날짜구하기
            return d.substr(5,9);
        }

        var line = AIRFINDER.lineType;
        var dataRoot = AIRFINDER.set.date[line];

        // 요일
        $('#'+dataRoot[0].sId).val(d1).next('.box__date-info').find('.text__date').text(day1+'요일');
        $('#'+dataRoot[0].eId).val(d2).next('.box__date-info').find('.text__date').text(day2+'요일');

        // 일수 계산
        var arr1_1 = d1.split('.');
        var arr2_1 = d2.split('.');
        var dat1_1 = new Date(arr1_1[0], arr1_1[1], arr1_1[2]);
        var dat2_1 = new Date(arr2_1[0], arr2_1[1], arr2_1[2]);

        var diff_1 = dat2_1 - dat1_1;
        var currDay_1 = 24 * 60 * 60 * 1000;// 시 * 분 * 초 * 밀리세컨
        $('#day__count2').text( diff_1/currDay_1 );

        AIRFINDER.search.finderInputIsEmptyDetect();
    },
    callDraw : function(){
        drawAirDatepicker();
    },
    buttonActivate : function(){
        $('.box__layer-air-finder .js-button__date-select').addClass('link__selected--active').text('날짜 선택완료');
    },
    buttonDeactivate : function(){
        $('.box__layer-air-finder .js-button__date-select').removeClass('link__selected--active').text('날짜 선택');
    },
    checkActiveButton : function(){
        var line = AIRFINDER.lineType;
        var inputVal01 = $(this.inputs.day1).val();
        var inputVal02 = $(this.inputs.day2).val();
        if(line == 'RT' && inputVal01 !== '' && inputVal02 !== '') {
            this.buttonActivate();
        }
        else{ this.buttonDeactivate(); }
        
    }
};

var drawAirDatepicker =  function(){
    //layer input jquery객체
    var $d1 = $(airCalendar.inputs.day1);
    var $d2 = $(airCalendar.inputs.day2);
    var line = AIRFINDER.lineType;
    var dateRoot = AIRFINDER.set.date[AIRFINDER.lineType];

    var parsedate = function(d){
        return $.datepicker.parseDate(airCalendar.dateFormat,d);
    }

    airCalendar.container.datepicker({
        numberOfMonths: 2,
        dateFormat: airCalendar.dateFormat,
        showMonthAfterYear: true,
        status: null,
        monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        yearSuffix:'.',
        minDate: 0,
        maxDate: "366d",
        setDate: 'today',
        beforeShowDay: function(date) {
        	if(date.getDate() == 1) {
        		today = date;
        	}
            var date1 = parsedate($d1.val());
            var date2 = parsedate($d2.val());
            //var date3 = parsedate($d3.val());
            var classes = 'ui-datepicker-highlight';
            var checkText = '';
            for (var i = 0; i < airCalendar.dates.length; i++) {
                if(i == 0){
                    checkText = AIRFINDER.lineType !== '체크인';
                }else if ( i == 1) {
                    checkText = AIRFINDER.lineType !== '체크아웃';
                }/*else if ( i == 2){
                    checkText = '여정3'
                }*/
                var stringifyD =(airCalendar.dates[i]).toString();
                var paseD = new Date(stringifyD.replace(/\./g, '/'));
                if ( paseD == date.toString()) {
                    return [true, 'ui-point', ""+checkText+""];
                } //point 표시 출력
            }

            var hDay = airCalendar.hDay;

            var fixedMnt = hDay.fixed[ parseInt( date.getMonth(), 10) +1],
                lunarMnt = hDay.lunar[ parseInt( date.getFullYear(), 10) ][ parseInt( date.getMonth(), 10) +1 ],
                i=0,j=0,
                rtnStr = '';

            //하이라이트 조건
            var highlightCondition = date1 && ((date == date1) || (date2 && date >= date1 && date <= date2));

            if(date.getDay() === 0){
                rtnStr = highlightCondition? classes + ' ui-datepicker-holiday':'ui-datepicker-holiday';

            }else{
                if( fixedMnt !== undefined ){
                    for(i;i<fixedMnt.length;i++){
                        if( fixedMnt[i][0] === parseInt( date.getDate(), 10) ){
                            rtnStr = highlightCondition? classes + ' ui-datepicker-holiday':'ui-datepicker-holiday';
                            return [true,rtnStr];
                        }
                    }
                };
                if( lunarMnt !== undefined ){
                    for(j;j<lunarMnt.length;j++){
                        if( lunarMnt[j][0] === parseInt( date.getDate(), 10) ){
                            rtnStr = highlightCondition? classes + ' ui-datepicker-holiday':'ui-datepicker-holiday';
                            return [true,rtnStr];
                        }
                    }
                }
            };

            return [true, highlightCondition ? classes : ""]; // range 표시 클래스 출력
        },
        onSelect: function(dateText, inst) {
            var d1,d2;
            d1 = $d1.val();
            d2 = $d2.val();
            var selectedDate = dateText;
            var day = new Date(dateText.replace(/\./g, '/'));
            var d = airCalendar.dayNamesMin[day.getDay()]; //요일
            if(( !d1 && d2) && (selectedDate < d2) ){
                $d1.val(dateText); // first input print
                $d2.val("").parents('.list-item').addClass('list-item--active'); // remove active
                airCalendar.dates[0] = dateText;
                airCalendar.dates[1] = '';
                airCalendar.days[0] = d;
                airCalendar.days[1] = '';
                airCalendar.checkActiveButton();
                $(this).datepicker();
            }
            if (!d1 || line == 'RT' && d2)  {
                $d1.val(dateText); // first input print
                $d2.val("").parents('.list-item').addClass('list-item--active'); // remove active
                airCalendar.dates[0] = dateText;
                airCalendar.dates[1] = '';
                airCalendar.days[0] = d;
                airCalendar.days[1] = '';
                airCalendar.checkActiveButton();
                $d1.siblings('.box__date-info').find('.text__date').text(airCalendar.days[0]);
                $(this).datepicker();
            }
            else if( !d2 && line == 'RT' && $d1.val() <= dateText) { // second input print
                $d2.val(dateText);
                airCalendar.dates[1] = dateText
                //airCalendar.dates[2] = '';
                airCalendar.days[1] = d;
                airCalendar.checkActiveButton();
                $d2.siblings('.box__date-info').find('.text__date').text(airCalendar.days[1]);
                $(this).datepicker();
            }else if( !d2 && line == 'RT') {
            	$d2.val($d1.val());
            	$d1.val(dateText);
                airCalendar.dates[1] = airCalendar.dates[0]
                airCalendar.dates[0] = dateText
                airCalendar.days[1] = airCalendar.days[0];
                airCalendar.days[0] = d;
                airCalendar.checkActiveButton();
                $d1.siblings('.box__date-info').find('.text__date').text(airCalendar.days[0]);
                $d2.siblings('.box__date-info').find('.text__date').text(airCalendar.days[1]);
                $(this).datepicker();
            }

            // 일수 계산
            var strDate1 = $('#form__input-layer-date1').val();
            var strDate2 = $('#form__input-layer-date2').val();
            var arr1 = strDate1.split('.');
            var arr2 = strDate2.split('.');
            var dat1 = new Date(arr1[0], arr1[1], arr1[2]);
            var dat2 = new Date(arr2[0], arr2[1], arr2[2]);

            var diff = dat2 - dat1;
            var currDay = 24 * 60 * 60 * 1000;// 시 * 분 * 초 * 밀리세컨

            var dayCount = (diff/currDay) || 0;
            $('#day__count1').text( dayCount );

            AIRFINDER.search.finderInputIsEmptyDetect();
        }
    });
}//drawAirDatepicker

var today = new Date();

var textSetup = function() {
	var mm2 = today.getMonth();
	var yyyy2 = today.getFullYear();
	
	today.setMonth((today.getMonth()-1));
	var mm1 = today.getMonth();
	var yyyy1 = today.getFullYear();
	
	if(mm2 == 0) {
		mm2 = 12;
		yyyy2 = yyyy1;
	}
	if(mm1 == 0) {
		mm1 = 12;
		today.setMonth((today.getMonth()-1));
		yyyy1 = today.getFullYear();
	}

    textInputAll(yyyy1, mm1, leftTextArray);
    textInputAll(yyyy2, mm2, rightTextArray);
}