/**
 * COSMIC PROJECT
 * 
 * Foreign function interface module
 */

const path = require('path');
import * as ffi from 'ffi-napi';
const ref = require('ref-napi');

class CosmicFFI {
    public static clib = ffi.Library(path.resolve(__dirname, '../c/libcosmic.so'), {
        // 'freeString': [ref.types.void, [ref.types.CString]]
        'get_test_string': [ref.types.CString, [ref.types.void]],
        'handleMessage': [ref.types.CString, [ref.types.int, ref.types.CString]]
    });
}


export {
    CosmicFFI
}
