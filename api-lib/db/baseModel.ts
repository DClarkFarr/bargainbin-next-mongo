import {
    Collection,
    Db,
    Document,
    Filter,
    FindOneAndUpdateOptions,
    FindOptions,
    ObjectId,
    WithId,
} from "mongodb";

export default class BaseModel<
    D extends Document,
    P extends string,
    U extends Document
> {
    collectionName: string = "default";
    db: Db;
    collection: Collection<D>;

    constructor(db: Db) {
        this.db = db;
        this.collection = this.getCollection();
    }

    getCollection() {
        return this.db.collection<D>(this.collectionName);
    }

    getProjection(obj: FindOptions["projection"] = {}, preset?: P) {
        // extend this
        return obj;
    }

    getFindOptions(
        options: FindOptions<D> & {
            preset?: P;
        } = {}
    ): FindOptions<D> {
        options.projection = this.getProjection(
            options.projection,
            options.preset
        );

        return options;
    }

    toArray(d: WithId<Document>) {
        const obj = { ...d };

        delete obj.password;

        return obj as WithId<D>;
    }

    async findOne(
        filter: Filter<D>,
        options: FindOptions<D> & {
            preset?: P;
        } = {}
    ) {
        return this.collection.findOne<D>(filter, this.getFindOptions(options));
    }

    async findById(
        id: string,
        options: FindOptions<D> & {
            preset?: P;
        } = {}
    ) {
        return this.findOne({ _id: new ObjectId(id) } as any, options);
    }

    async updateById(
        id: string,
        data: U,
        options: FindOneAndUpdateOptions = { returnDocument: "after" }
    ) {
        return (this.collection as Collection<D>)
            .findOneAndUpdate(
                { _id: new ObjectId(id) } as any,
                { $set: data },
                {
                    ...options,
                    projection: this.getProjection(options.projection),
                }
            )
            .then(({ value }) => value);
    }
}
