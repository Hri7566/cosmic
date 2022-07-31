const path = require('path');
const ffi = require('ffi-napi');

const c = ffi.Library(path.resolve(__dirname, '../c/cosmic/libcosmic.so'), {
    'test': ['char*', []]
});

const nim = ffi.Library(path.resolve(__dirname, '../nim/libmain.so'))

console.log(c.test());
