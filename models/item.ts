import { Model, Schema, model, models } from 'mongoose';

interface Item {
	creator: string;
	title: string;
	url: string;
	likes_count: number;
}

const ItemSchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	title: {
		type: String,
		required: [true, 'Title is required.'],
	},
	url: {
		type: String,
		unique: [true, 'This article already exists!'],
		required: [true, 'Url is required.'],
	},
	likes_count: {
		type: Number,
		// required: [true, 'like is required.'],
	},
});

const Item: Model<Item> = models.Item || model('Item', ItemSchema);

export default Item;
