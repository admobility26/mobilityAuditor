// Compatibility name for existing routes; only an application administrator is authorized.
import {getFormationUser} from './formation-auth';
export {sameOrigin} from './formation-auth';
export async function getChatGPTUser(){const user=await getFormationUser();return user?.role==='admin'?{...user,displayName:user.name,fullName:user.name}:null;}
