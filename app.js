//Load global configurations
require('./config');

var http = require('http');

//Load routes configurations
require('./routes/config.js');

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode');
});