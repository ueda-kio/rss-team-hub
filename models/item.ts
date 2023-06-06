import { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	url: {
		type: String,
		unique: [true, 'This article already exists!'],
		required: [true, 'Url is required.'],
	},
	like: {
		type: String,
		// required: [true, 'like is required.'],
	},
});

const Item = models.Item || model('Item', ItemSchema);

export default Item;
