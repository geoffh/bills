import { RRule, RRuleSet, rrulestr } from 'rrule'

const RepeatRuleService = ( function() {
    const endTypeNever = 'endTypeNever'
    const endTypeDate = 'endTypeDate'
    const endTypeOccurrences = 'endTypeOccurrences'
    const ruleTypeMonthlyByMonthDay = 'ruleTypeMonthlyByMonthDay'
    const ruleTypeMonthlyByWeekDay = 'ruleTypeMonthlyByWeekDay'
    const ruleTypeYearlyByMonthDay = 'ruleTypeYearlyByMonthDay'

    const dayNames = [ 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA' ]

    const dayItems = [
        { value: RRule.SU, label: 'Sunday' },
        { value: RRule.MO, label: 'Monday' },
        { value: RRule.TU, label: 'Tuesday' },
        { value: RRule.WE, label: 'Wednesday' },
        { value: RRule.TH, label: 'Thursday' },
        { value: RRule.FR, label: 'Friday' },
        { value: RRule.SA, label: 'Saturday' },      
    ]

    const dayNumberItems = [
        {value: 1, label: '1st' }, {value: 2, label: '2nd' }, {value: 3, label: '3rd' }, {value: 4, label: '4th' }, {value: 5, label: '5th' }, 
        {value: 6, label: '6th' }, {value: 7, label: '7th' }, {value: 8, label: '8th' }, {value: 9, label: '9th' }, {value: 10, label: '10th' }, 
        {value: 11, label: '11th' }, {value: 12, label: '12th' }, {value: 13, label: '13th' }, {value: 14, label: '14th' }, {value: 15, label: '15th' }, 
        {value: 16, label: '16th' }, {value: 17, label: '17th' }, {value: 18, label: '18th' }, {value: 19, label: '19th' }, {value: 20, label: '20th' }, 
        {value: 21, label: '21st' }, {value: 22, label: '22nd' }, {value: 23, label: '23rd' }, {value: 24, label: '24th' }, {value: 25, label: '25th' }, 
        {value: 26, label: '26th' }, {value: 27, label: '27th' }, {value: 28, label: '28th' }, {value: 29, label: '29th' }, {value: 30, label: '30th' }, 
        {value: 31, label: '31st' }
    ]

    const frequencyItemsSingular = [
        { value: RRule.MONTHLY, label: 'Month' },
        { value: RRule.YEARLY, label: 'Year' }
    ]

    const frequencyItemsPlural = [
        { value: RRule.MONTHLY, label: 'Months' },
        { value: RRule.YEARLY, label: 'Years' }
    ]

    const monthItems = [
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
    ]

    const occurrenceItems = [
        { value: 1, label: '1st' },
        { value: 2, label: '2nd' },
        { value: 3, label: '3rd' },
        { value: 4, label: '4th' },
        { value: -1, label: 'Last' }
    ]

    function createCount( inRule ) { return 12 }
    function createUntil( inRule ) {
        const theDate = new Date( getStartDate( inRule ) )
        const theYear = theDate.getFullYear()
        theDate.setFullYear( theYear + 1 )
        return theDate
    }

    function createMonthlyByMonthDayRule( inStartDate, inInterval ) {
        return new RRule( {
            dtstart: inStartDate,
            freq: RRule.MONTHLY,
            bymonthday: inStartDate.getDate(),
            interval: inInterval
        } )
    }

    function createMonthlyByWeekDayRule( inStartDate ) {
        return new RRule( {
            dtstart: inStartDate,
            freq: RRule.MONTHLY,
            byweekday: [ RRule[ dayNames[ inStartDate.getDay() ] ].nth( getDayOccurrence( inStartDate ) ) ]
        } )
    }

    function createMonthlyByMonthDay( inRule ) {
        return inRule.options.dtstart.getDate()
    }

    function createMonthlyByMonthDayRuleString( inStartDate, inInterval, inMonthlyByMonthDay, inEnd ) {
        return rrulestr( createRuleString( inStartDate, 'MONTHLY', inInterval, inEnd ) + ';BYMONTHDAY=' + inMonthlyByMonthDay ).toString()
    }

    function createMonthlyByWeekDay( inRule ) {
        let theDayOccurrence = getDayOccurrence( inRule.options.dtstart )
        theDayOccurrence = theDayOccurrence < 5 ? theDayOccurrence : -1
        return {
            day: dayItems[ inRule.options.dtstart.getDay() ].value,
            occurrence: theDayOccurrence
        }
    }

    function createMonthlyByWeekDayRuleString( inStartDate, inInterval, inMonthlyByWeekDay, inEnd ) {
        return rrulestr( createRuleString( inStartDate, 'MONTHLY', inInterval, inEnd ) + ';BYDAY=' + inMonthlyByWeekDay.occurrence + inMonthlyByWeekDay.day ).toString()
    }

    function createRuleFromRuleString( inRuleString ) { return rrulestr( inRuleString ) }

    function createRuleSet( inTemplateRuleSet, inRule ) {
        const theRuleSet = new RRuleSet()
        theRuleSet.rrule( rrulestr( inRule ) )
        if ( inTemplateRuleSet ) {
            inTemplateRuleSet.exrules().forEach( inExRule => theRuleSet.exrule( inExRule ) )
            inTemplateRuleSet.rdates().forEach( inRDate => theRuleSet.rdate( inRDate ) )
            inTemplateRuleSet.exdates().forEach( inExDate => theRuleSet.exdate( inExDate ) )
        }
        return theRuleSet
    }

    function createRuleString( inStartDate, inFrequency, inInterval, inEnd ) {
        const theEnd = createRuleStringEnd( inEnd )
        return 'DTSTART=' + dateToISOString( inStartDate ) + ';FREQ=' + inFrequency + ';INTERVAL=' + inInterval +
            ( theEnd ? ';' + theEnd : '' )
    }

    function createRuleStringEnd( inEnd ) {
        if ( endTypeNever === inEnd.type ) {
            return null
        }
        return endTypeDate === inEnd.type ? 'UNTIL=' + dateToISOString( inEnd.until ) : 'COUNT=' + inEnd.count
    }

    function createYearlyByMonthDay( inRule ) { return dateToYearlyByMonthDay( inRule.options.dtstart ) }

    function createYearlyByMonthDayRuleString( inStartDate, inInterval, inYearlyByMonthDay, inEnd ) {
        return rrulestr( createRuleString( inStartDate, 'YEARLY', inInterval, inEnd ) + ';BYMONTH=' + ( inYearlyByMonthDay.month + 1 ) + ';BYMONTHDAY=' + inYearlyByMonthDay.day ).toString()
    }

    function dateToISOString( inDate ) {
        return inDate.getUTCFullYear() + '' + pad( ( inDate.getUTCMonth() + 1 ) ) + '' + pad( inDate.getUTCDate() ) + '' +
            'T' + 
            pad( inDate.getUTCHours() ) + '' + pad( inDate.getUTCMinutes() ) + '' + pad( inDate.getUTCSeconds() ) +
            'Z'
    }

    function dateToYearlyByMonthDay( inDate ) {
        return {
            month: inDate.getMonth(),
            day: inDate.getDate()
        }
    }

    function getCount( inRule ) { return inRule.options.count }
    function getDayItems() { return dayItems }
    function getDayNumberItems() { return dayNumberItems }

    function getDayOccurrence( inDate ) {
        let theDate = new Date( inDate )
        const theMonth = theDate.getMonth()
        let theWeekNumber = 0
        while ( theMonth === theDate.getMonth() ) {
            ++ theWeekNumber
            theDate.setDate( theDate.getDate() - 7 )
        }
        return theWeekNumber
    }

    function getEnd( inRule ) {
        const theEnd = { type: getEndType( inRule ) }
        if ( theEnd.type === endTypeNever ) {
            theEnd.count = createCount( inRule )
            theEnd.until = createUntil( inRule )
        } else if ( theEnd.type === endTypeDate ) {
            theEnd.count = createCount( inRule )
            theEnd.until = getUntil( inRule )
        } else if ( theEnd.type === endTypeOccurrences ) {
            theEnd.count = getCount( inRule )
            theEnd.until = createUntil( inRule )
        }
        return theEnd
    }

    function getEndType( inRule ) {
        let theType
        if ( inRule.options.until ) {
            theType = endTypeDate
        } else if ( inRule.options.count ) {
            theType = endTypeOccurrences
        } else {
            theType = endTypeNever
        }
        return theType
    }

    function getFrequency( inRule ) { return inRule.options.freq }
    function getFrequencyItems( inPlural ) { return inPlural ? frequencyItemsPlural : frequencyItemsSingular }
    function getInterval( inRule ) { return inRule.options.interval }
    function getMonthItems() { return monthItems }
    function getMonthlyByMonthDay( inRule ) { return isMonthlyByMonthDay( inRule ) ? inRule.options.bymonthday[ 0 ] : null }

    function getMonthlyByWeekDay( inRule ) {
        // RRule uses Monday as first day of week but dayItems starts with Sunday
        if ( ! isMonthlyByWeekDay( inRule ) ) {
            return null
        }
        let theDayIndex = inRule.options.bynweekday[ 0 ][ 0 ] + 1
        theDayIndex = theDayIndex === 7 ? 0 : theDayIndex
        return  { day: dayItems[ theDayIndex ].value, occurrence: inRule.options.bynweekday[ 0 ][ 1 ] }
    }

    function getOccurrenceItems() { return occurrenceItems }

    function getRepeatDates( inRuleSet, inExDates, inStartDate, inStopDate ) {
        if ( inExDates ) {
            inExDates.forEach( theExDate => inRuleSet.exdate( new Date( theExDate ) ) )
        }
        return inRuleSet.between( inStartDate, inStopDate )
    }

    function getRuleFromRuleSet( inRuleSet ) {
        let theRule = null
        if ( inRuleSet ) {
            const theRules = inRuleSet.rrules()
            if ( theRules && theRules.length === 1 ) {
                theRule = theRules[ 0 ]
            }
        }
        return theRule
    }

    function getRuleType( inRule ) {
        return isYearly( inRule.options.freq ) ? ruleTypeYearlyByMonthDay :
            isMonthlyByMonthDay( inRule ) ? ruleTypeMonthlyByMonthDay : ruleTypeMonthlyByWeekDay
    }

    function getStartDate( inRule ) { return inRule.options.dtstart }
    function getUntil( inRule ) { return inRule.options.until }

    function getYearlyByMonthDay( inRule ) {
        return isYearlyByMonthDay( inRule ) ? {
            month: inRule.options.bymonth - 1,
            day: inRule.options.bymonthday
        } : null
    }

    function isEndOnDate( inEndType ) { return endTypeDate === inEndType }
    function isEndNever( inEndType ) { return endTypeNever === inEndType }
    function isEndAfterOccurrences( inEndType ) { return endTypeOccurrences === inEndType }
    function isMonthlyByMonthDay( inRule ) { return isMonthly( inRule.options.freq ) && inRule.options.bymonthday && inRule.options.bymonthday.length > 0 }
    function isMonthlyByWeekDay( inRule) { return isMonthly( inRule.options.freq ) && inRule.options.bynweekday && inRule.options.bynweekday.length > 0 }
    function isMonthly( inFrquency ) { return RRule.MONTHLY === inFrquency }    
    function isYearly( inFrequency ) { return RRule.YEARLY === inFrequency }
    function isYearlyByMonthDay( inRule ) { return isYearly( inRule.options.freq ) && inRule.options.bymonth && inRule.options.bymonthday }
    function pad( inNumber ) { return inNumber < 10 ? '0' + inNumber : inNumber }
    function parse( inRuleSetString ) { return inRuleSetString ? rrulestr( inRuleSetString, { forceset: true } ) : null }
    function setUntil( inRuleSet, inEndDate ) {
        return parse( 
            stringify( inRuleSet ) + ';' + createRuleStringEnd( { type: endTypeDate, until: inEndDate } ) )
    }
    function stringify( inRuleSet ) { return inRuleSet ? inRuleSet.toString() : null }

    function yearlyByMonthDayToDate( inYearlyByMonthDay ) {
        const theDate = new Date()
        theDate.setMonth( inYearlyByMonthDay.month )
        theDate.setDate( inYearlyByMonthDay.day )
        return theDate
    }

    return {
        createMonthlyByMonthDay: createMonthlyByMonthDay,
        createMonthlyByMonthDayRule: createMonthlyByMonthDayRule,
        createMonthlyByMonthDayRuleString: createMonthlyByMonthDayRuleString,
        createMonthlyByWeekDay: createMonthlyByWeekDay,
        createMonthlyByWeekDayRule: createMonthlyByWeekDayRule,
        createMonthlyByWeekDayRuleString: createMonthlyByWeekDayRuleString,
        createRuleFromRuleString: createRuleFromRuleString,
        createRuleSet: createRuleSet,
        createYearlyByMonthDay: createYearlyByMonthDay,
        createYearlyByMonthDayRuleString: createYearlyByMonthDayRuleString,
        endTypeDate: endTypeDate,
        endTypeNever: endTypeNever,
        endTypeOccurrences: endTypeOccurrences,
        getDayItems: getDayItems,
        getDayNumberItems: getDayNumberItems,
        getEnd: getEnd,
        getFrequency: getFrequency,
        getFrequencyItems: getFrequencyItems,
        getInterval: getInterval,
        getMonthItems: getMonthItems,
        getMonthlyByMonthDay: getMonthlyByMonthDay,
        getMonthlyByWeekDay: getMonthlyByWeekDay,
        getOccurrenceItems: getOccurrenceItems,
        getRepeatDates: getRepeatDates,
        getRuleFromRuleSet: getRuleFromRuleSet,
        getRuleType: getRuleType,
        getStartDate: getStartDate,
        getYearlyByMonthDay: getYearlyByMonthDay,
        isEndOnDate: isEndOnDate,
        isEndNever: isEndNever,
        isEndAfterOccurrences: isEndAfterOccurrences,
        isMonthly: isMonthly,
        isYearly: isYearly,
        parse: parse,
        ruleTypeMonthlyByMonthDay: ruleTypeMonthlyByMonthDay,
        ruleTypeMonthlyByWeekDay: ruleTypeMonthlyByWeekDay,
        setUntil: setUntil,
        stringify: stringify,
        yearlyByMonthDayToDate: yearlyByMonthDayToDate
    }
} )()

export default RepeatRuleService