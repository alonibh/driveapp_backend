import helper

def login(username, password):
    resp = helper.request(method="POST", uri="/auth/login",
    body={
        'username': username,
        'password': password
    })
    if resp.ok:
        helper.token = resp.json().get('token')
        return True
    return False

def signup(username, password, email, address, firstName, lastName):
    resp = helper.request(method="POST", uri="/auth/signup",
    body={
        'username': username,
        'password': password,
        'email': email,
        'address': address,
        'firstName': firstName,
        'lastName': lastName
    })
    if resp.ok:
        return True
    return False