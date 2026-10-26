declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
declare namespace Cloudflare { interface Env { FORMATION_ADMIN_HASH?:string; FORMATION_ADMIN_EMAIL?:string; PUBLIC_ORIGIN?:string; } }
