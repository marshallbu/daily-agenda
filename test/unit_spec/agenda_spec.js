var $ = require('jquery'),
    mock1 = require('../../mock_data/default1.json'),
    mock2 = require('../../mock_data/default2.json'),
    mock3 = require('../../mock_data/default3.json'),
    DailyAgenda = require('../../app/scripts/agenda');

describe('DailyAgenda test suite', function() {
    var agenda, $view;

    before(function() {
        $view = $('<div>');
        agenda = new DailyAgenda({ view: $view });
    });


    after(function() {

    });

    describe('init', function() {
        it('should not be null', function() {
            expect(agenda).to.not.be.null;
        });

        it('should initialize correctly', function() {
            expect(agenda.$view).to.not.be.null;
            expect(agenda.$view).to.be.an.instanceof($);
        });

        it('should initialize layout correctly', function() {
            expect(agenda.$view.find('.time-label').size()).to.not.equal(0);
        });
    });

    describe('render events', function() {
        before(function() {
            agenda.renderEvents(mock1);
        });

        it('should take in intervals and create a tree', function() {
            expect(agenda.tree.queryOverlap().length).to.equal(4);
        });

        it('should create an internal interval structure', function() {
            expect(agenda.intervals.length).to.equal(4);
        });

        it('should group the intervals into overlap clusters', function() {
            expect(agenda.overlapGroups.length).to.equal(2);

        });

        it('should create columns in the groups for visualization', function() {
            expect(agenda.overlapGroups[1].columns).to.equal(2);
            expect(agenda.overlapGroups[1].members['2'].column).to.equal(1);
        });

        it('should be positioned correctly in the layout', function() {
            // TODO: should this be checking for styles, css, etc
        });

        it('should clear events as necessary', function() {
            agenda._clearEvents();

            expect(agenda.$view.find('.events').find('.event-item').size()).to.equal(0);

            expect(agenda.intervals).to.be.empty;
            expect(agenda.overlapGroups).to.be.empty;
            expect(agenda.tree.queryOverlap()).to.be.empty;
        });
    });
});
