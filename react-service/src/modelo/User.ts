import type { Address } from "./user-componentes/Adress";
import type { Company } from "./user-componentes/Company";


export interface User {

    id?: number;
    
    name: string;

    username: string;

    email: string;

    phone: string;

    website: string;

    address: Address;

    company: Company;

}