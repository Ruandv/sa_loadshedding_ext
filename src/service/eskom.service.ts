import LoggingService from "./logging.service";

export default class EskomService {
    private static service: EskomService;
    private loggingService = LoggingService.getInstance();

    private baseUrl = "https://loadshedding.eskom.co.za/LoadShedding";

    private myHeaders = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        "content-type": "application/json",
    });

    public getStatus = async (): Promise<any> => {
        try {
            const statusRequest = new Request(this.baseUrl + '/GetStatus', {
                method: 'Get',
                mode: 'cors',
                headers: this.myHeaders,
                cache: 'default',
                body: undefined
            })
            return fetch(statusRequest).then(async (res) => {
                var val = await res.text();
                return (parseInt(val) - 1).toString();
            })
        }
        catch (err) {
            this.loggingService.echo("Fetch Error", (err as any).message, null, "error");
            throw err;
        }
    }

    public static getInstance() {
        if (!this.service) {
            this.service = new EskomService();
        }

        return this.service;
    }
}
