const path = require('path');
const ffi = require('ffi-napi');

class CosmicFFI {
    static clib = ffi.Library(path.resolve(__dirname, '../c/cosmic/libcosmic.so'), {
        'test': ['char*', []]
    });

    static nim = require('../nim/cosmic');
}

export {
    CosmicFFI
}
