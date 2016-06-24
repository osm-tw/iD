export function lanes(field, context) {
    var dispatch = d3.dispatch('change'),
        LANE_WIDTH = 25,
        wayID,
        laneData;


    function lanes(selection) {
        laneData = context.entity(wayID).lanes();
        var laneCount = laneData.tagged.lanes.count || laneData.defaults.lanes.count;


        // if form field is hidden or has detached from dom, clean up.
        if (!d3.select('.inspector-wrap.inspector-hidden').empty() || !selection.node().parentNode) {
            selection.call(lanes.off);
            return;
        }

        var wrap = selection.selectAll('.preset-input-wrap')
            .data([0]);

        wrap.enter()
            .append('div')
            .attr('class', 'preset-input-wrap');

        var surface =  wrap.selectAll('.surface')
            .data([0]);

        var d = wrap.dimensions();
        var freeSpace = d[0] - LANE_WIDTH * laneCount;

        surface.enter()
            .append('svg')
            .attr('width', d[0])
            .attr('height', 300)
            .attr('class', 'surface');

        var lane = surface.selectAll('.lane')
           .data(new Array(laneCount).fill(0).map(function(l, i) {
                return i;
           }));

        lane.enter()
            .append('g')
            .attr('class', 'lane')
            .append('rect')
            .attr('y', 75)
            .attr('width', LANE_WIDTH)
            .attr('height', 150);

        lane.selectAll('rect').attr('x', function(d) {
            return LANE_WIDTH*d + (freeSpace/(laneCount+1))*(d+1);
        });

        lane.exit().remove();
    }


    lanes.entity = function(_) {
        if (!wayID || wayID !== _.id) {
            wayID = _.id;
        }
    };

    lanes.tags = function() {};
    lanes.focus = function() {};
    lanes.off = function() {};

    return d3.rebind(lanes, dispatch, 'on');
}
