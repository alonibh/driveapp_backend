import helper

def getPerson(username):
    resp = helper.request(method="GET", uri="/person/{}".format(username))
    if resp.ok:
        return resp.json()
    return False

def getPersonDrives(username):
    resp = helper.request(method="GET", uri="/person/{}/drives".format(username))
    if resp.ok:
        return resp.json()
    return False

def searchPerson(query):
    resp = helper.request(method="GET", uri="/person/{}/search".format(query))
    if resp.ok:
        return resp.json()
    return False

def updatePerson(username, firstName=None, lastName=None, address=None):
    d = {}
    if firstName:
        d['firstName'] = firstName
    if lastName:
        d['lastName'] = lastName
    if address:
        d['address'] = address
    resp = helper.request(method="PATCH", uri="/person/{}".format(username),
        body = d)
    if resp.ok:
        return resp.json()
    return False

def getPersonFriends(username):
    resp = helper.request(method="GET", uri="/person/{}/friends".format(username))
    if resp.ok:
        return resp.json()
    return False

def addFriend(friendUsername):
    resp = helper.request(method="PUT", uri="/person/{}/friend".format(friendUsername))
    if resp.ok:
        return resp.json()
    return False

def deleteFriend(friendUsername):
    resp = helper.request(method="DELETE", uri="/person/{}/friend".format(friendUsername))
    if resp.ok:
        return resp.json()
    return False