import { AmbienceDescription } from './ambience-description.enum';
import { Service } from './service.enum';
import { ServicesGroup } from './services-group.enum';

export class Ambience {
    id?: string;
    ambienceDescription?: AmbienceDescription;
    area?: number;
    private _servicesGroup?: ServicesGroup;
    private _services?: Service[];
    cost?: number;
    comments?: string;
    isActive: boolean;


    constructor(id?: string, description?: AmbienceDescription) {
        this.id = id;
        this.ambienceDescription = description;
        this._services = [];
        this.isActive = true;
    }

    get servicesGroup(): ServicesGroup {
        return this._servicesGroup;
    }

    private set serviceGroup(group: ServicesGroup) {
        this._servicesGroup = group;
    }

    get services(): Service[] {
        return this._services;
    }

    set services(services: Service[]) {
        this._services = services;

        if (this._servicesGroup === undefined) {
            this.serviceGroup = this.setServicesGroup(this._services);
        }

    }

    setServicesGroup(services: Service[]): ServicesGroup {
        let group: ServicesGroup;

        if (this._services === undefined && this._services.length < 1) {
            console.error('Serviços indefinidos')
        } else {
            let isLayoutDevelop: boolean = this._services.includes(Service[Service[0]]);
            let isReformProject: boolean = this._services.includes(Service[Service[2]]);
            let someTechnicalDetail: boolean =
                this._services.includes(Service[Service[3]])
                || this._services.includes(Service[Service[4]])
                || this._services.includes(Service[Service[5]])
                || this._services.includes(Service[Service[6]]);

            if (isLayoutDevelop || isReformProject) {
                if (someTechnicalDetail) {
                    group = ServicesGroup.High;
                } else if (isReformProject) {
                    group = ServicesGroup.Medium;
                } else {
                    group = ServicesGroup.Low;
                }
            } else if (someTechnicalDetail) {
                group = ServicesGroup.High;
            }
        }
        
        return group;
    }

    static parse(ambienceData): Ambience {
        ambienceData = JSON.parse(ambienceData)
        let ambience: Ambience

        return ambience;
    }
}
