describe('q', function () {
    describe('successive', function () {
        it('calls the function for each item successively', function () {
            var items = [1, 2, 3, 4, 5],
                call = 0;

            var promise = q.successive(items, function (num) {
                return num + ++call;
            });

            return promise.then(function (itemsCreated) {
                itemsCreated.should.containDeep([2, 4, 6, 8, 10]);
            });
        });
    });
});