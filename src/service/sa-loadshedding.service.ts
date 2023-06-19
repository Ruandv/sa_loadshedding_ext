import { Municipality, StageInfoModel } from "../interfaces/userDetails";
import LoggingService from './logging.service';
export default class SaLoadsheddingService {

    private static service: SaLoadsheddingService;
    private loggingService = LoggingService.getInstance();

    private baseUrl = "https://sa-loadshedding-api.azurewebsites.net/api/Eskom";
    //private baseUrl = "https://localhost:44373/api/Eskom";

    private myHeaders = new Headers({
        //"accept": "application/json",
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Key': chrome.runtime.getManifest().key!,// "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjQhQWeY7JxuSgD0PTt1nGpz6/ZWCBHhlLgL8dRjSFlASKQtFhoBQZ0KtP1LJrsVr+lNi/iuavW+Ew+ySBr1YK07LWDo/KqB77d2EQpBpUkjOXBNUolBlEDhdmbldUtgGff1sgtMYpI8VcCpY78PKjx4WOJMZmgbJkJSkFufh1/AMsEfQLjk+d+3obqNvt8fEfYOGa+uktnpKuUVHkbNHQWsAmETqVWUodZFJ89MbXvUSjLjRi4N8hOhfLfMw5Tyg71uV6j/Xn39U3T8Gh62wxzZOn0ky+tIDSQenrq6I4Tb2Zg4U4aW9mWJo4+PoHIF8zJVCJ5/AdpzY+lWPyH2UCwIDAQAB",
        "content-type": "application/json",
    });
    public searchSuburbData = async (municipalityId: number, searchValue: string) => {
        try {
            const municipalityRequest = new Request(`${this.baseUrl}/FindSuburb/?municipalityId=${municipalityId}&suburbname=${searchValue}`, {
                method: 'Get',
                mode: 'cors',
                headers: this.myHeaders,
                cache: 'default',
                body: undefined
            })
            return fetch(municipalityRequest)
                .then(x => x.json())
                .then(d => {
                    var m: Municipality = {} as Municipality;
                    m.Suburbs = d;
                    return m;
                });
        } catch (ex) {
            this.loggingService.echo("Fetch Error", (ex as any).message, null, "error")
            throw ex;
        }
    }

    public getSuburbData = async (provinceId: number, municipality: number): Promise<Municipality> => {
        try {
            const municipalityRequest = new Request(`${this.baseUrl}/GetSuburbList/?provinceId=${provinceId}&municipalityId=${municipality}`, {
                method: 'Get',
                mode: 'cors',
                headers: this.myHeaders,
                cache: 'default',
                body: undefined
            })
            return fetch(municipalityRequest)
                .then(x => x.json())
                .then(d => {
                    var m: Municipality = {} as Municipality;
                    m.Suburbs = d;
                    return m;
                });
        } catch (ex) {
            this.loggingService.echo("Fetch Error", (ex as any).message, null, "error")
            throw ex;
        }
    }

    public getSchedule = async (blockId: string, stage: number, days: number, municipalityId: number): Promise<StageInfoModel[]> => {
        const stageInfoRequest = new Request(`${this.baseUrl}/GetSchedule?blockId=${blockId}&days=${days}&stage=${stage}&municipalityId=${municipalityId}`, {
            method: 'Get',
            mode: 'cors',
            headers: this.myHeaders,
            cache: 'default',
            body: undefined
        })
        return fetch(stageInfoRequest)
            .then(x => {
                return x.json()
            })
            .then(d => {
                return d;
            })
            .catch((err) => {
                console.error("FETCH ERROR : " + err.message)
                this.loggingService.echo("Fetch Error", err.message, null, "error")
                throw err;
            });
    }

    public getMunicipalityList = async (provinceId: number): Promise<Municipality[]> => {
        try {
            const municipalityListRequest = new Request(`${this.baseUrl}/GetMunicipalityList?provinceId=${provinceId}`, {
                method: 'Get',
                mode: 'cors',
                headers: this.myHeaders,
                cache: 'default',
                body: undefined
            })
            debugger;
            return fetch(municipalityListRequest)
                .then(x => {
                    return x.json()
                })
                .then(d => {
                    return d;
                })
                .catch((err) => {
                    console.error("FETCH ERROR : " + err.message)
                    this.loggingService.echo("Fetch Error", err.message, null, "error")
                    throw err;
                });
        } catch (ex) {
            debugger;
            this.loggingService.echo("Fetch Error", (ex as any).message, null, "error")
            throw ex;
        }
    }

    public static getInstance() {
        if (!this.service) {
            this.service = new SaLoadsheddingService();
        }

        return this.service;
    }
}
