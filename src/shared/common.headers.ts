export class MyHeaders {
    static enableCors = new Headers({
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Token': 'f99e8c9e-372c-4699-9b63-e94d927788f2',
        "content-type": "application/json",
    })
}