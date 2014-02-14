var main = require('./'),
    user = require('./user');

app.get('/', main.index);
app.get('/users', user.list);