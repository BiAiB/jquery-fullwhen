!function() {
	
	
	/* Here we provide an alternative when version of jQuery because
	 * the original version rejects the $.when deferred immediately if
	 * any of the deferred passed fails.
	 * This doesn't allow us to be notified when all the deferred are
	 * finished whether failed or resolved.
	 */
	var // Static reference to slice
		sliceDeferred = [].slice;
	$.fullWhen = function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise(),
			rejectedFlag;
		function checkAll() {
			if (rejectedFlag) {
				deferred.rejectWith( deferred, args );			
			} else {
				deferred.resolveWith( deferred, args );
			}
		}
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					checkAll();
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		function rejectFunc( i ) {
			return function( value ) {
				rejectedFlag = true;
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					checkAll();
				}
			}
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), rejectFunc(i), progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
	
	
	
	
}();
