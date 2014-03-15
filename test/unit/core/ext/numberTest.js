describe('Number', function () {
    describe('times', function () {
        it('it returns an array with the correct entries', function () {
            (5).times().should.containDeep([0, 1, 2, 3, 4]);
        });
    });

    describe('timesPlusOne', function () {
        it('it returns an array with the correct entries', function () {
            (6).timesPlusOne().should.containDeep([1, 2, 3, 4, 5, 6]);
        });
    });
});