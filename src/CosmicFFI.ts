/**
 * COSMIC PROJECT
 * 
 * Foreign function interface module
 */

const path = require('path');
const ffi = require('ffi-napi');
const ref = require('ref-napi');

class CosmicFFI {
    // static clib = ffi.Library(path.resolve(__dirname, '../c/cosmic/libcosmic.so'), {
    //     // 'freeString': [ref.types.void, [ref.types.CString]]
    // });
}

export {
    CosmicFFI
}
