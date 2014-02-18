//Load global configurations
require('./config');

var http = require('http');

//Load routes configurations
require('./routes/config.js')

db
    .sequelize
    .sync()
    .complete(function (err) {
        if (err) {
            throw err
        } else {
            http.createServer(app).listen(app.get('port'), function () {
                console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode');
            })
        }
    })