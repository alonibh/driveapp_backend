import helper

def getDrive(driveId):
    resp = helper.request(method="GET", uri="/drive/{}".format(driveId))
    if resp.ok:
        return resp.json()
    return False

def addDrive(dest, date, driver, participants):
    resp = helper.request(method="PUT", uri="/drive",
    body = {
        "dest": dest,
        "date": date,
        "driver": driver,
        "participants": participants
    })
    if resp.ok:
        return resp.json().get('id')
    return False

def deleteDrive(driveId):
    resp = helper.request(method="DELETE", uri="/drive/{}".format(driveId))
    if resp.ok:
        return True
    return False

def updateDrive(driveId, dest=None, date=None, driver=None, participants=None):
    d = {}
    if dest:
        d['dest'] = dest
    if date:
        d['date'] = date
    if driver:
        d['driver'] = driver
    if participants:
        d['participants'] = participants
    resp = helper.request(method="PATCH", uri="/drive/{}".format(driveId),
        body = d)
    if resp.ok:
        return True
    return False