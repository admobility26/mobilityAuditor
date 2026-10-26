export function digest(value:string):Promise<string>;
export function passwordHash(password:string,salt?:string):Promise<string>;
export function verifyPassword(password:string,stored:string):Promise<boolean>;
