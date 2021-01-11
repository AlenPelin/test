export function appendTrackedActivityResults(source, target) {
    if (!source) {
        return;
    }
    source.visitActivities.forEach(function (a) { return target.visitActivities.push(a); });
    source.visitUpdates.forEach(function (a) { return target.visitUpdates.push(a); });
    source.visitorUpdates.forEach(function (a) { return target.visitorUpdates.push(a); });
}
export function getLatestVisit(visitor) {
    var latest = undefined;
    for (var i = 0; i < visitor.visits.length; i++) {
        var current = visitor.visits[i];
        if (!latest || current.updated > latest.updated) {
            latest = current;
        }
    }
    return latest;
}
//# sourceMappingURL=utils.js.map