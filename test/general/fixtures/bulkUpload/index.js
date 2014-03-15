//Defines a set of generic seed data to use as a 'typical' DB configuration

exports.users = [
    {id: 1, name: 'jill', follows: [2, 3], password: 'test1'},
    {id: 3, name: 'tim', follows: [1, 2], password: 'test3'},
    {id: 2, name: 'alice', follows: [3], password: 'test2'}
];

//Path to fixture image - root path depends on the server's root location
var imagePath = system.performance.pathTo('test/general/fixtures/bulkUpload/image.png');

exports.streams = [
    {id: 1, user_id: 3, path: imagePath, timestamp: 1392403505782},
    {id: 2, user_id: 2, path: imagePath, timestamp: 1392305505782},
    {id: 4, user_id: 2, path: imagePath, timestamp: 1392405505781},
    {id: 5, user_id: 2, path: imagePath, timestamp: 1392405505782},
    {id: 3, user_id: 1, path: imagePath, timestamp: 1392404505782}
];