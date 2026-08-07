import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    findByEmail(email: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, User, "findOne", {}>;
    findById(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, User, "findOne", {}>;
    create(data: {
        email: string;
        passwordHash: string;
        fullName: string;
    }): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
