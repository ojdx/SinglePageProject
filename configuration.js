var fs= require('fs')
    , nconf = require('nconf');
nconf.argv()
    .env()
    .file({ file: __dirname + '/properties.json' });