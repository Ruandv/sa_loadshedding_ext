import { MyHeaders } from "../shared/common.headers";
import LoggingService from "./logging.service";

export default class EskomService {
    private static service: EskomService;
    private loggingService = LoggingService.getInstance();

    private baseUrl = "https://loadshedding.eskom.co.za/LoadShedding";

    public getStatus = async (): Promise<any> => {
        try {
            const statusRequest = new Request(this.baseUrl + '/GetStatus', {
                method: 'Get',
                mode: 'cors',
                headers: MyHeaders.enableCors,
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
