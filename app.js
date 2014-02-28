//Load global configurations
require('./config');

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode');
});