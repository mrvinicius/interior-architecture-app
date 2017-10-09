import { Supplier } from './supplier';

export class Product {
	id?: string;
	description: string;
	supplier: Supplier;

	constructor(
		description: string,
		supplier: Supplier,
	) {
		this.description = description;
		this.supplier = supplier;
	}
}
