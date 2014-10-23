var $ = require('jquery'),
    mock1 = require('../../mock_data/default1.json'),
    mock2 = require('../../mock_data/default2.json'),
    mock3 = require('../../mock_data/default3.json'),
    DayView = require('../../app/scripts/day-view');

describe("DayView test suite", function() {
    var dayView, $view;

    before(function() {
        $view = $('<div>');
        dayView = new DayView({ view: $view });
    });


    after(function() {

    });

    describe('init', function() {
        it('should not be null', function() {
            expect(dayView).to.not.be.null;
        });

        it('should initialize correctly', function() {
            expect(dayView.$view).to.not.be.null;
            expect(dayView.$view).to.be.an.instanceof($);
        });

        it('should initialize layout correctly', function() {
            expect(dayView.$view.find('.time-label').size()).to.not.equal(0);
        });
    });

    describe('render events', function() {
        before(function() {
            dayView.renderEvents(mock1);
        });

        it('should take in intervals and create a tree', function() {
            expect(dayView.tree.queryOverlap().length).to.equal(4);
        });

        it('should create an internal interval structure', function() {
            expect(dayView.intervals.length).to.equal(4);
        });

        it('should group the intervals into overlap clusters', function() {
            expect(dayView.overlapGroups.length).to.equal(2);

        });

        it('should create columns in the groups for visualization', function() {
            expect(dayView.overlapGroups[1].columns).to.equal(2);
            expect(dayView.overlapGroups[1].members['2'].column).to.equal(1);
        });

        it('should be positioned correctly in the layout', function() {
            // TODO: should this be checking for styles, css, etc
        });

        it('should clear events as necessary', function() {
            dayView._clearEvents();

            expect(dayView.$view.find('.events').find('.event-item').size()).to.equal(0);

            expect(dayView.intervals).to.be.empty;
            expect(dayView.overlapGroups).to.be.empty;
            expect(dayView.tree.queryOverlap()).to.be.empty;
        });
    });
});
