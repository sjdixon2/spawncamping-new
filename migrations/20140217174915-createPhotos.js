module.exports = {
  up: function(migration, DataTypes, done) {
      migration.createTable(
          'photoes', //The 'e' is intentional; sequelize pluralizes 'photo' to 'photoes'
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
              imagePath: DataTypes.STRING,
              thumbnailPath: DataTypes.STRING,
              description: DataTypes.STRING,
              userID: DataTypes.INTEGER
          }
      );

    // add altering commands here, calling 'done' when finished
    done()
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done()
  }
}
