var TABLE_NAME = 'userHasFollowers';

module.exports = {
    up: function (migration, DataTypes, done) {
        migration.createTable(
            TABLE_NAME,
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                createdAt: {
                    type: DataTypes.DATE
                },
                updatedAt: {
                    type: DataTypes.DATE
                },
                followersID: DataTypes.INTEGER,
                followeesID: DataTypes.INTEGER
            }
        );

        // add altering commands here, calling 'done' when finished
        done()
    },
    down: function (migration, DataTypes, done) {
        migration.dropTable(TABLE_NAME);
        // add reverting commands here, calling 'done' when finished
        done()
    }
};
