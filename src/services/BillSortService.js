const BillSortService = ( function() {
    const sortAscending = 'asc'
    const sortDescending = 'desc'
    const sortColumnIds = [ 'dueDate', 'biller', 'amount' ]

    function dateOnly( inDate ) {
        let theDate = new Date( inDate );
        theDate.setHours( 0, 0, 0, 0 )
        return theDate
    }

    function compareBills( inBill1, inBill2, sortColumnId, sortColumnDirection, inSortColumnIds = sortColumnIds ) {
        let theValue1 = sortColumnDirection === sortAscending ? inBill1[ sortColumnId ] : inBill2[ sortColumnId ]
        let theValue2 = sortColumnDirection === sortAscending ? inBill2[ sortColumnId ] : inBill1[ sortColumnId ]
        theValue1 = ( theValue1 instanceof Date ) ? dateOnly( theValue1 ) : theValue1
        theValue2 = ( theValue2 instanceof Date ) ? dateOnly( theValue2 ) : theValue2
        let theResult
        if ( theValue1 < theValue2 ) {
            theResult = -1
        } else if ( theValue1 > theValue2 ) {
            theResult = 1
        } else {
            const theSortColumnIds = [ ...inSortColumnIds ]
            const theIndex = theSortColumnIds.indexOf( sortColumnId )
            if ( theIndex !== -1 ) {
                theSortColumnIds.splice( theIndex, 1 )
            }
            theResult = theSortColumnIds.length === 0 ? 0 : compareBills( inBill1, inBill2, theSortColumnIds[ 0 ], sortColumnDirection, theSortColumnIds )
        }
        return theResult
    }

    function sort( inBills, { sortColumnId, sortColumnDirection } ) {
        if ( sortColumnId && sortColumnDirection ) {
            inBills.sort( ( inBill1, inBill2 ) => compareBills( inBill1, inBill2, sortColumnId, sortColumnDirection ) )
        }
    }

    return {
        sort: sort,
        sortAscending: sortAscending,
        sortDescending: sortDescending
    }
} ) ()

export default BillSortService