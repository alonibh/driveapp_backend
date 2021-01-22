import requests

URL = "http://localhost:3000/api"
headers = {
    'Content-Type': 'application/json'
}

token = None

def request(method='GET', uri='/', body=None):
    global URL
    global headers
    global token
    print("""Request: 
        {0} to {1}, 
        {2}""".format(method, uri, body))
    
    # Handle token
    headers.pop('Authorization', None)
    if token:
        headers["Authorization"] = token

    resp = requests.request(method=method,
        url = URL + uri, json=body, 
        headers=headers)
    
    print("Response: {}".format(resp.status_code))
    try:
        print(resp.json())
    except Exception as e:
        print(resp.body)
    return resp