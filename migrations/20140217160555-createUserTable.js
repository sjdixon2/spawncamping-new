var TABLE_NAME = 'users';

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
                fullName: DataTypes.STRING,
                email: DataTypes.STRING,
                password: DataTypes.STRING
            }
        );

        done()
    },
    down: function (migration, DataTypes, done) {
        migration.dropTable(TABLE_NAME);
        // add reverting commands here, calling 'done' when finished
        done()
    }
};
