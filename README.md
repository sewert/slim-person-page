# slim-person-page

Inspired by FamilySearch's person page https://www.familysearch.org/tree/person/details/{PID}

I wanted to see if I could recreate the same look of the page without making nearly as many network requests.

This code is ugly and should not be used. This project is intended to demo how many requests are actually needed to paint the page.
This is not intended to be feature complete or production ready.

In this basic app, the pid, sessionId, and cisId will be passed in as query params.
URLs are hard coded to beta so you'll need to generate your own beta sessionid and find a valid PID.
http://localhost:8080/?pid={pid}&sessionId={sessionId}&cisId={cisId}




###Necessary calls

1)  tf/person/{PID}?oneHops=cards&includeSuggestions=true&contactNames=true
    1) Returns core information: vitals, family members, research suggestions, data problems, is deletable, source counts, collaborate count, contributor count, user change count, life sketch, other information
2)  ftuser/users/CURRENT
    1) This should be cached and only made once per user session. Returns user display name and cisId.
3)  service/memories/tps/persons/{PID}/portrait
    1) This returns the URL of the portrait that then needs to be fetched. This call count will increase depending on how many persons/photos are in the family.
4)  service/memories/manager/persons/personsByTreePersonId/{PID}/summary?includeArtifactCount=true
    1) Returns memoryCount
5)  service/cmn/watch/watches?resourceId={PID}{resourceIdentifier}
    1) Returns watched status
6)  service/tree/labels/persons?personId={PID}&includeLabels=true
    1) Returns labels
7)  platform/tree/persons/{PID}/matches?confidence=4&count=100&includeSummary=true&collection=https://familysearch.org/platform/collections/records&status=Pending&status=Rejected
    1) Returns record hints. Needs to be interleaved with the data problems, researched suggestions, and possible duplicates.
8)  platform/tree/persons/{PID}/matches?confidence=4&count=100
    1) Returns possible duplicates. Needs to be interleaved with data problems, research suggestions, and record hints.
9)  cas-public-api/authorization/v1/authorize?perm=ViewTempleUIPermission&context=FtNormalUserContext&sessionId={session}
    1) Says if user can view temple information. Should be cached and only called once per session.
10) fs-user/users/{cisID}/preferences?name=tree.showLDSTempleInfo&name={preference}
    1) Says if user want to view temple information. Should be cached. Additional preferences should also be read in this one list call.
11) tree/temple-status/person/icon?id={PID}
    1) Should only be called if user has permission and preference
12) platform/users/{cis.user.ID}/history
    1) Returns recently viewed PIDS with their names
13) tf/person/{PID}/changes/summary?contactNames=true
    1) Returns 3 most recent changes
14) collaboration/messaging/api/users/{cisId}/counters
    1) Returns if user has an messages
    
###Suggested calls

1)  tree-data person details
    1) Consolidate tf/person/{PID}?oneHops=cards&includeSuggestions=true&contactNames=true
    1) Consolidate platform/tree/persons/{PID}/matches?confidence=4&count=100&includeSummary=true&collection=https://familysearch.org/platform/collections/records&status=Pending&status=Rejected
    1) Consolidate platform/tree/persons/{PID}/matches?confidence=4&count=100
    1) Consolidate service/memories/manager/persons/personsByTreePersonId/{PID}/summary?includeArtifactCount=true
    1) This would ideally be the first call made
    1) Would need to gracefully handle platform or memories errors (eg: response indicates memories failed and should be retried)
2)  tree-data photo urls
    1) Consolidates fanout to service/memories/tps/persons/{PID}/portrait and returns URLs if any
    1) This could be added as an option to 1) if memories returns fast enough. But I think it would be fine for the page to load and then for images to populate.
3)  ftuser/users/CURRENT
    1) Cached for session
4)  service/cmn/watch/watches?resourceId={PID}{resourceIdentifier}
    1) Cached per PID for session
5)  service/tree/labels/persons?personId={PID}&includeLabels=true
    1) Cached per PID for session
6)  cas-public-api/authorization/v1/authorize?perm=ViewTempleUIPermission&context=FtNormalUserContext&sessionId={session}
    1) Cached per session
7)  fs-user/users/{cisID}/preferences?name=tree.showLDSTempleInfo&name={preference}
    1) Cached per preference per session
8)  tree/temple-status/person/icon?id={PID}
    1) Cached per PID per session if caching logic isn't too hard
9)  platform/users/{cis.user.ID}/history
10) tf/person/{PID}/changes/summary?contactNames=true
    1) Cached per PID per session if caching logic isn't too hard
14) collaboration/messaging/api/users/{cisId}/counters
    1) Returns if user has an messages
    1) Could also combine this into a tree-data call for non-vitals stuff (labels, photos, etc) but looks like it comes from header/footer