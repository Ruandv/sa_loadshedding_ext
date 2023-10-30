import { JokeModel } from "../interfaces/userDetails";
import { MyHeaders } from "../shared/common.headers";
import LoggingService from "./logging.service";

export default class JokesService {
    private static service: JokesService;
    private loggingService = LoggingService.getInstance();

    private baseUrl = "https://sa-loadshedding-api.azurewebsites.net/api/Jokes";

    public getJoke = async (): Promise<JokeModel> => {
        try {
            const statusRequest = new Request(this.baseUrl + '/GetJoke', {
                method: 'Get',
                mode: 'cors',
                headers: MyHeaders.enableCors,
                cache: 'default',
                body: undefined
            })
            debugger;
            return fetch(statusRequest).then(async (res) => {
                var val = await res.json();
                return val;
            })
        }
        catch (err) {
            debugger;
            this.loggingService.echo("Fetch Error", (err as any).message, null, "error");
            throw err;
        }
    }

    public static getInstance() {
        if (!this.service) {
            this.service = new JokesService();
        }

        return this.service;
    }
}
