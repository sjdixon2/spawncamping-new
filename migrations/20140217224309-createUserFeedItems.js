var TABLE_NAME = 'userFeedItems';

module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable(
            TABLE_NAME,
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE,
                userID: DataTypes.INTEGER,
                photoID: DataTypes.INTEGER
            }
        );
        // add altering commands here, calling 'done' when finished
        done()
    },
    down: function(migration, DataTypes, done) {
        migration.createTable(TABLE_NAME);
        // add reverting commands here, calling 'done' when finished
        done()
    }
};
