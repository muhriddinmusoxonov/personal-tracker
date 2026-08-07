import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(user: any, type?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/category.schema").Category, {}, {}> & import("./schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(user: any, body: {
        name: string;
        icon: string;
        type: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/category.schema").Category, {}, {}> & import("./schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(user: any, id: string, body: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/category.schema").Category, {}, {}> & import("./schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, import("./schemas/category.schema").Category, {}, {}> & import("./schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, import("./schemas/category.schema").Category, "findOneAndUpdate", {}>;
    remove(user: any, id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/category.schema").Category, {}, {}> & import("./schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, import("./schemas/category.schema").Category, {}, {}> & import("./schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, import("./schemas/category.schema").Category, "findOneAndDelete", {}>;
}
