import dotenv from "dotenv";
dotenv.config();

export class EnvConfig{
    static get PORT():number{
        return Number(process.env.PORT || 5002);
    
    }
    static get DATABASE_URI():string{
        if(!process.env.DATABASE_URI){
            throw new Error("DATABASE_URI is required");
        }
        return (process.env.DATABASE_URI) as string;
    }

    static get FRONTEND_URL():string{
        if(!process.env.FRONTEND_URL){
            throw new Error("FRONTEND_URL is required");
        }
        return process.env.FRONTEND_URL;
    }

    static get ACCESS_TOKEN_SECRET(): string {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET is required");
        }
        return process.env.ACCESS_TOKEN_SECRET;
    }

    static get REFRESH_TOKEN_SECRET(): string {
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("REFRESH_TOKEN_SECRET is required");
        }
        return process.env.REFRESH_TOKEN_SECRET;
    }

}