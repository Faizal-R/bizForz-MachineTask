import dotenv from "dotenv";
dotenv.config();
console.log('DEBUG: JWT_SECRET from process.env:', process.env.JWT_SECRET);

export class EnvConfig{
    static get PORT():number{
        return Number(process.env.PORT || 5002);
    
    }
    static get DATABASE_URI():string{
        if(!process.env.DATABASE_URI && !process.env.MONGO_URI){
            throw new Error("DATABASE_URI or MONGO_URI is required");
        }
        return (process.env.DATABASE_URI || process.env.MONGO_URI) as string;
    }

    static get FRONTEND_URL():string{
        if(!process.env.FRONTEND_URL){
            throw new Error("FRONTEND_URL is required");
        }
        return process.env.FRONTEND_URL;
    }

    static get JWT_SECRET(): string {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is required");
        }
        return process.env.JWT_SECRET;
    }

}