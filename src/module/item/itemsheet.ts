export class ItemSheetFATE extends ItemSheet {
	static get defaultOptions() {
		const options = super.defaultOptions;
		options.classes = options.classes.concat(['fate', 'item']);
		options.width = 500;
		options.height = 400;
		options.resizable = false;
		options.submitOnUnfocus = true;
		// mergeObject(options, {
		// 	classes: options.classes.concat(['fate', 'item']),
		// 	width: 500,
		// 	height: 400,
		// 	resizable: false,
		// 	submitOnUnfocus: true
		// });
		return options;

	}

	get template() {
		return 'systems/fate/templates/items/item-sheet.html';
	}

	getData() {
		const data = super.getData() as any;
		const type = this.item.type;
		mergeObject(data,  {
			type: type,
			hasDetails: ['skill'].includes(type),
			dataTemplate: () => `systems/fate/templates/items/${type}-data`
		});

		// @TODO: Add Skill data

		return data;
	}

	protected activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		new Tabs(html.find('.tabs'), {
			initial: this.item.data.flags['_tab'],
			callback: clicked => this.item.data.flags['_tab'] = clicked.attr('data-tab')
		});
	}
}