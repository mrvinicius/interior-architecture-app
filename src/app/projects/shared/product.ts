import { Supplier } from './supplier';

type QuantityUnity = 'unidade' | 'peso' | 'medida2d' | 'medida3d';

export class Product {
	id?: string;
	description: string;
	supplier: Supplier;
	quantityUnity: QuantityUnity;
	quantity: string | number;
	color?: string;
	note?: string;

	constructor(
		description: string,
		supplier: Supplier,
		quantityUnity: QuantityUnity,
		quantity: string | number
	) {
		this.description = description;
		this.supplier = supplier;
		this.quantityUnity = quantityUnity;
		this.quantity = quantity;
	}
}

/*

ProjetoComodoOrcamentoDTO = {
	"OrcamentoId" : "C16A1111-9999-999-9999-999999999",
	"ProjetoId":  "C16A1111-EC02-4DCB-B00C-04A908A1CEC4",
	"ComodoId": "A631598C-1EE5-41EB-B251-1D91581093E7",
	"Observacoes": '',
	"ProdutoId": "1FFE2A2D-A0D0-4AB7-9AE1-289225879E21",
	"FornecedorId": "8563CEDA-4528-4924-A1F9-3528B82196B0",
	"FilialId": "5249F639-9CE8-4B33-A6C6-3262CC3D6FAC",
	"Cor": "Branca",
	"Quantidade": 1,
	"ProjetoComodoOrcamentoProduto": [
	{	
		"Observacoes": '',
		"Cor": '',
		"Quantidade": '',	
		"ProjetoComodoOrcamentoProdutoFornecedor": [
		{	
			"FornecedorId": '',
			"FilialId": '',
			"Observacoes": '',
			"Cor": '',
			"Quantidade": 1,
			"ValorUnitario": 1,
			"Desconto": 0,
			"ValorTotal": 1
		}
		]	
	}
	]

}

*/