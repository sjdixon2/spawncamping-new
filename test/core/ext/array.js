describe('Array', function () {
    describe('contains', function () {
        it("indicates when an array doesn't contain an item", function () {
            var arr = ['abc', 'ab'];
            arr.contains('a').should.equal(false);
        });

        it("indicates when an array contains an item", function () {
            var arr = ['ab'];
            arr.contains('ab').should.equal(true);
        });
    });
});