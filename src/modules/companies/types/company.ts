export type Company = {
    id: number;
    name: string;
    rfc: string;
    address: string;
    phone?: string | null;
    email?: string | null;
    observations?: string | null;
    active: boolean;

};

export type CompanyCreate = {
    name: string;
    rfc:string;
    address: string;
    phone?: string | null;
    email?: string | null;
    observations?: string | null;


};