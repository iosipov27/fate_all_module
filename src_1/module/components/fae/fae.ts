// import { ActorSheetFate } from "./basesheet.js";

export class FAECharacterSheet extends ActorSheet {
	static get defaultOptions() {
		const options = super.defaultOptions;
		mergeObject(options, {
			classes: options.classes.concat(['fate', 'accelerated', 'character-sheet']),
			width: 650,
			height: 760,
			resizable: false
		});
		return options;
	}

	get template() {
		return 'systems/myfate/templates/fae.html';
		// return './../../templates/fae.html';
	}

	getData() {
		const sheetData = super.getData()
        console.log(sheetData);
		
		return sheetData;
	}
}