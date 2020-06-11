import { RRule, rrulestr } from 'rrule';

const RepeatRuleService = {
    endTypeNever: 'endTypeNever',
    endTypeDate: 'endTypeDate',
    endTypeOccurrences: 'endTypeOccurrences',
    ruleTypeMonthlyByMonthDay: 'ruleTypeMonthlyByMonthDay',
    ruleTypeMonthlyByWeekDay: 'ruleTypeMonthlyByWeekDay',
    ruleTypeYearlyByMonthDay: 'ruleTypeYearlyByMonthDay',

    dayNames: [ 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA' ],

    dayItems: [
        { value: RRule.SU, label: 'Sunday' },
        { value: RRule.MO, label: 'Monday' },
        { value: RRule.TU, label: 'Tuesday' },
        { value: RRule.WE, label: 'Wednesday' },
        { value: RRule.TH, label: 'Thursday' },
        { value: RRule.FR, label: 'Friday' },
        { value: RRule.SA, label: 'Saturday' }        
    ],

    dayNumberItems: [
        {value: 1, label: '1st' }, {value: 2, label: '2nd' }, {value: 3, label: '3rd' }, {value: 4, label: '4th' }, {value: 5, label: '5th' }, 
        {value: 6, label: '6th' }, {value: 7, label: '7th' }, {value: 8, label: '8th' }, {value: 9, label: '9th' }, {value: 10, label: '10th' }, 
        {value: 11, label: '11th' }, {value: 12, label: '12th' }, {value: 13, label: '13th' }, {value: 14, label: '14th' }, {value: 15, label: '15th' }, 
        {value: 16, label: '16th' }, {value: 17, label: '17th' }, {value: 18, label: '18th' }, {value: 19, label: '19th' }, {value: 20, label: '20th' }, 
        {value: 21, label: '21st' }, {value: 22, label: '22nd' }, {value: 23, label: '23rd' }, {value: 24, label: '24th' }, {value: 25, label: '25th' }, 
        {value: 26, label: '26th' }, {value: 27, label: '27th' }, {value: 28, label: '28th' }, {value: 29, label: '29th' }, {value: 30, label: '30th' }, 
        {value: 31, label: '31st' }
        
    ],

    frequencyItemsSingular: [
        { value: RRule.MONTHLY, label: 'Month' },
        { value: RRule.YEARLY, label: 'Year' }
    ],

    frequencyItemsPlural: [
        { value: RRule.MONTHLY, label: 'Months' },
        { value: RRule.YEARLY, label: 'Years' }
    ],

    monthItems: [
        { value: 0, label: 'January' },
        { value: 1, label: 'February' },
        { value: 2, label: 'March' },
        { value: 3, label: 'April' },
        { value: 4, label: 'May' },
        { value: 5, label: 'June' },
        { value: 6, label: 'July' },
        { value: 7, label: 'August' },
        { value: 8, label: 'September' },
        { value: 9, label: 'October' },
        { value: 10, label: 'November' },
        { value: 11, label: 'December' }
    ],

    occurrenceItems: [
        { value: 1, label: '1st' },
        { value: 2, label: '2nd' },
        { value: 3, label: '3rd' },
        { value: 4, label: '4th' },
        { value: -1, label: 'Last' }
    ],

    createCount: function( inRule ) { return 12; },
    createUntil: function( inRule ) {
        const theDate = new Date( this.getStartDate( inRule ) );
        const theYear = theDate.getFullYear();
        theDate.setFullYear( theYear + 1 );
        return theDate;
    },

    createMonthlyByMonthDayRule: function( inStartDate, inInterval ) {
        return new RRule( {
            dtstart: inStartDate,
            freq: RRule.MONTHLY,
            bymonthday: inStartDate.getDate(),
            interval: inInterval
        } );
    },

    createMonthlyByWeekDayRule: function( inStartDate ) {
        return new RRule( {
            dtstart: inStartDate,
            freq: RRule.MONTHLY,
            byweekday: [ RRule[ this.dayNames[ inStartDate.getDay() ] ].nth( this.getDayOccurrence( inStartDate ) ) ]
        } );
    },

    createMonthlyByMonthDay: function( inRule ) {
        return inRule.options.dtstart.getDate();
    },

    createMonthlyByMonthDayRuleString: function( inStartDate, inInterval, inMonthlyByMonthDay, inEnd ) {
        return rrulestr( this.createRuleString( inStartDate, 'MONTHLY', inInterval, inEnd ) + ';BYMONTHDAY=' + inMonthlyByMonthDay ).toString();
    },

    createMonthlyByWeekDay: function( inRule ) {
        return {            
            day: this.dayItems[ inRule.options.dtstart.getDay() ].value,
            occurrence: this.getDayOccurrence( inRule.options.dtstart )
        };
    },

    createMonthlyByWeekDayRuleString: function( inStartDate, inInterval, inMonthlyByWeekDay, inEnd ) {
        return rrulestr( this.createRuleString( inStartDate, 'MONTHLY', inInterval, inEnd ) + ';BYDAY=' + inMonthlyByWeekDay.occurrence + inMonthlyByWeekDay.day ).toString();
    },

    createRuleFromRuleString: function( inRuleString ) {
        return rrulestr( inRuleString );
    },

    createRuleString: function( inStartDate, inFrequency, inInterval, inEnd ) {
        const theEnd = this.createRuleStringEnd( inEnd );
        return 'DTSTART=' + this.dateToISOString( inStartDate ) + ';FREQ=' + inFrequency + ';INTERVAL=' + inInterval +
            ( theEnd ? ';' + theEnd : '' );
    },

    createRuleStringEnd: function( inEnd ) {
        if ( this.endTypeNever === inEnd.type ) {
            return null;
        }
        return this.endTypeDate === inEnd.type ? 'UNTIL=' + this.dateToISOString( inEnd.until ) : 'COUNT=' + inEnd.count;
    },

    createYearlyByMonthDay( inRule ) {
        return this.dateToYearlyByMonthDay( inRule.options.dtstart );
    },

    createYearlyByMonthDayRuleString: function( inStartDate, inInterval, inYearlyByMonthDay, inEnd ) {
        return rrulestr( this.createRuleString( inStartDate, 'YEARLY', inInterval, inEnd ) + ';BYMONTH=' + ( inYearlyByMonthDay.month + 1 ) + ';BYMONTHDAY=' + inYearlyByMonthDay.day ).toString();
    },

    dateToISOString: function( inDate ) {
        return inDate.getUTCFullYear() + this.pad( ( inDate.getUTCMonth() + 1 ) ) + this.pad( inDate.getUTCDate() ) +
            'T' + 
            this.pad( inDate.getUTCHours() ) + this.pad( inDate.getUTCMinutes() ) + this.pad( inDate.getUTCSeconds() ) +
            'Z';
    },

    dateToYearlyByMonthDay: function( inDate ) {
        return {
            month: inDate.getMonth(),
            day: inDate.getDate()
        };
    },

    getCount: function( inRule ) { return inRule.options.count; },

    getDayItems: function() { return this.dayItems; },

    getDayNumberItems: function() { return this.dayNumberItems; },

    getDayOccurrence: function( inDate ) {
        let theDate = new Date( inDate );
        const theMonth = theDate.getMonth();
        let theWeekNumber = 0;
        while ( theMonth === theDate.getMonth() ) {
            ++ theWeekNumber;
            theDate.setDate( theDate.getDate() - 7 );
        }
        return theWeekNumber;
    },

    getEnd: function( inRule ) {
        const theEnd = { type: this.getEndType( inRule ) };
        if ( theEnd.type === this.endTypeNever ) {
            theEnd.count = this.createCount( inRule );
            theEnd.until = this.createUntil( inRule );
        } else if ( theEnd.type === this.endTypeDate ) {
            theEnd.count = this.createCount( inRule );
            theEnd.until = this.getUntil( inRule );
        } else if ( theEnd.type === this.endTypeOccurrences ) {
            theEnd.count = this.getCount( inRule );
            theEnd.until = this.createUntil( inRule );
        }
        return theEnd;
    },

    getEndType: function( inRule ) {
        let theType;
        if ( inRule.options.until ) {
            theType = this.endTypeDate;
        } else if ( inRule.options.count ) {
            theType = this.endTypeOccurrences;
        } else {
            theType = this.endTypeNever;
        }
        return theType;
    },

    getFrequency: function( inRule ) {
        return inRule.options.freq;
    },

    getFrequencyItems: function( inPlural ) {
        return inPlural ? this.frequencyItemsPlural : this.frequencyItemsSingular;
    },

    getInterval: function( inRule ) {
        return inRule.options.interval;
    },

    getMonthItems: function() { return this.monthItems; },

    getMonthlyByMonthDay: function( inRule ) {
        return this.isMonthlyByMonthDay( inRule ) ? inRule.options.bymonthday[ 0 ] : null;
    },

    getMonthlyByWeekDay: function( inRule ) {
        // RRule uses Monday as first day of week but dayItems starts with Sunday
        if ( ! this.isMonthlyByWeekDay( inRule ) ) {
            return null;
        }
        let theDayIndex = inRule.options.bynweekday[ 0 ][ 0 ] + 1;
        theDayIndex = theDayIndex === 7 ? 0 : theDayIndex;
        return  { day: this.dayItems[ theDayIndex ].value, occurrence: inRule.options.bynweekday[ 0 ][ 1 ] };
    },

    getOccurrenceItems: function() { return this.occurrenceItems; },

    getRuleType: function( inRule ) {
        return this.isYearly( inRule.options.freq ) ? this.ruleTypeYearlyByMonthDay :
            this.isMonthlyByMonthDay( inRule ) ? this.ruleTypeMonthlyByMonthDay : this.ruleTypeMonthlyByWeekDay;
    },

    getStartDate: function( inRule ) {
        return inRule.options.dtstart;
    },

    getUntil: function( inRule ) { return inRule.options.until; },

    getYearlyByMonthDay: function( inRule ) {
        return this.isYearlyByMonthDay( inRule ) ? {
            month: inRule.options.bymonth - 1,
            day: inRule.options.bymonthday
        } : null;
    },

    isEndOnDate( inEndType ) { return this.endTypeDate === inEndType; },
    isEndNever( inEndType ) { return this.endTypeNever === inEndType; },
    isEndAfterOccurrences( inEndType ) { return this.endTypeOccurrences === inEndType; },

    isMonthlyByMonthDay: function( inRule ) {
        return this.isMonthly( inRule.options.freq ) && inRule.options.bymonthday && inRule.options.bymonthday.length > 0;
    },

    isMonthlyByWeekDay: function( inRule) {
        return this.isMonthly( inRule.options.freq ) && inRule.options.bynweekday && inRule.options.bynweekday.length > 0;
    },

    isMonthly: function( inFrquency ) {
        return RRule.MONTHLY === inFrquency;
    },

    pad: function( inNumber ) {
        return inNumber < 10 ? '0' + inNumber : inNumber;
    },

    isYearly: function( inFrequency ) {
        return RRule.YEARLY === inFrequency;
    },

    isYearlyByMonthDay: function( inRule ) {
        return this.isYearly( inRule.options.freq ) && inRule.options.bymonth && inRule.options.bymonthday;
    },

    yearlyByMonthDayToDate: function( inYearlyByMonthDay ) {
        const theDate = new Date();
        theDate.setMonth( inYearlyByMonthDay.month );
        theDate.setDate( inYearlyByMonthDay.day );
        return theDate;
    }
};

export { RepeatRuleService };