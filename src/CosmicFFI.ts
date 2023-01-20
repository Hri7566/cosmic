/**
 * COSMIC PROJECT
 * 
 * Foreign function interface module
 * 
 * This module is designed to load a C library which
 * is also included in the Cosmic directory.
 * 
 * I recently found out that "libcosmic" already
 * exists, actually... but this shouldn't be too
 * much of a problem if this is the only project
 * that uses it.
 */

import { resolve } from 'path';
import * as ffi from 'ffi-napi';
import * as ref from 'ref-napi';

class CosmicFFI {
    public static clib = ffi.Library(resolve(__dirname, '../c/libcosmic.so'), {
        // 'freeString': [ref.types.void, [ref.types.CString]]
        // 'get_test_string': [ref.types.CString, [ref.types.void]],
        'handleMessage': [ref.types.CString, [ref.types.int, ref.types.Object]]
    });
}


export {
    CosmicFFI
}
