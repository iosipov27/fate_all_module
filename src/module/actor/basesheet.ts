import { FATE } from '../config.js';

export class ActorSheetFate extends ActorSheet {
	private _sheetTab: string;

	get actorType() {
		return this.actor.data.type;
	}

	/**
	 * Add computed data common to all Actor Sheets to reduce template complexity.
	 * ActorData that is modified with computed values should be copied to
	 * the Sheet Data, to avoid possible conflicts with the actual Actor
	 */
	getData() {
		const sheetData = super.getData() as FateActorSheetData;
		
		this._prepareItems(sheetData);

		return sheetData;
	}

	/**
	 * Parse Owned Items to sort them by type for displaying
	 * on the Sheet
	 */
	private _prepareItems(sheetData: FateActorSheetData) {
		const stunts: Item[] = [];

		// Sort Stunt Items
		for (let i of sheetData.items) {
			if (i.type === 'Stunt') {
				stunts.push(i);
			}
		}

		// Assign Items to the Sheet data
		sheetData.stunts = stunts;
	}

	protected activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		this._replaceSelect(html);

		new Tabs(html.find('.tabs'), {
			initial: this._sheetTab,
			callback: clicked => {
				this._sheetTab = clicked.data('tab');
			}
		});

		// Disable custom elements when User is not the Owner
		if (!this.actor.owner) {
			html.find('div[contenteditable="true"][data-edit]').attr('contenteditable', 'false');
			html.find('label.stress-box').addClass('disabled');
			html.find('.artwork img').addClass('disabled');
			html.find('.artwork img').off();
		};

		if (this.options.submitOnUnfocus) {
			// Enable contenteditable divs to submit the form when they lose focus
			html.find('div[contenteditable="true"][data-edit]').on('focusout', this._onSubmit.bind(this));
			//html.find('.approach-select .options li').on('click', this._onSubmit.bind(this));
		}

		// Submit when changing the state of checkboxes
		html.find('input[type="checkbox"]').on('change', (ev) => this._onSubmit(ev));

		// When creating an Item
		html.find('.item-create').on('click', (ev) => {
			ev.preventDefault();
			const header = ev.currentTarget;
			const type = header.dataset.type;
			const itemData = {
				name: `New ${type.capitalize()}`,
				type,
				data: duplicate(header.dataset)
			};
			delete itemData.data['type'];
			this.actor.createOwnedItem(itemData);
		});

		// When editing an Item
		html.find('.item-edit').on('click', (ev) => {
			ev.preventDefault();
			const li = $(ev.currentTarget).closest('.item');
			const item = this.actor.getOwnedItem(li.attr('data-item-id'));
			item.sheet.render(true);
		});

		// When deleting an Item
		html.find('.item-delete').on('click', (ev) => {
			ev.preventDefault();
			const li = $(ev.currentTarget).closest('.item');
			li.slideUp(200, () => {
				this.actor.deleteOwnedItem(li.attr('data-item-id'));
			});
		});
	}

	// render(force = false, options?: RenderOptions) {
	// 	this.options.editable = this.actor.owner;
	// 	return super.render(force, options);
	// }

	/**
	 * Replace regular <select> elements with a custom one
	 */
	private _replaceSelect(html: JQuery) {
		const selects = html.find('select.approach');
		const fadeDuration = 200;

		selects.each(function() {
			// Cache the select and options elements
			const select = $(this);
			const options = select.children('option');

			// Wrap the select
			select.wrap('<div class="approach-select"></div>');

			// Create the new element to display the selected value
			const selected = $('<div />', {
				'class': 'selected',
				tabIndex: 0,
				text: options.siblings(':selected').text()
			}).insertAfter(select);

			// Create the new element to show the options
			const list = $('<ul />', {
				'class': 'options'
			}).insertAfter(selected);

			const hover = $('<div />', {
				'class': 'selected-hover'
			}).insertAfter(list);

			// Copy all the options to the new list
			for (const option of options) {
				const $this = $(option);
				$('<li />', {
					text: $this.text(),
					value: $this.val(),
					selected: $this.is(':selected')
				}).appendTo(list);
			}

			// Cache the new options
			const items = list.children('li');

			if(select.is(':disabled')) {
				selected.addClass('disabled');
				return;
			};

			// Crudely set the initial position of the list and hide it
			html.ready(() => {
				list.show();
				list.css('top', function () {
					const item = items.siblings('[selected]');
					const position = (item.index() * item.outerHeight()) + 1;
					return `-${position}px`;
				});
				list.hide();
			});

			selected.on('click', function(event) {
				event.stopPropagation();
				$(this).toggleClass('active');
				hover.fadeToggle(fadeDuration);
				list.fadeToggle(fadeDuration);
				list.css('top', function () {
					const item = items.siblings('[selected]');
					const position = (item.index() * item.outerHeight()) + 1;
					return `-${position}px`;
				});
			});

			hover.on('click', function(event) {
				selected.trigger('focus');
			});

			selected.on('keydown', function(event) {
				const val = select.val();
				const item = items.siblings(`[value="${val}"]`);
				
				list.children('li').attr('selected', null);

				switch (event.key) {
					case 'ArrowUp':
						if (item.prev().length === 0) break;

						item.prev().attr('selected', '');
						selected.text(item.prev().text());
						select.val(item.prev().attr('value'));

						list.css('top', () => {
							const val = (item.prev().index() * (item.prev().outerHeight())) + 1;
							return `-${val}px`;
						});
						break;
					case 'ArrowDown':
						if (item.next().length === 0) break;

						item.next().attr('selected', '');
						selected.text(item.next().text());
						select.val(item.next().attr('value'));
	
						list.css('top', () => {
							const val = (item.next().index() * (item.next().outerHeight())) + 1;
							return `-${val}px`;
						});
						break;
					case 'Enter':
						if (list.is(':visible')) {
							select.trigger('change');
							hover.fadeOut(fadeDuration);
							list.fadeOut(fadeDuration);
						} else {
							hover.fadeIn(fadeDuration);
							list.fadeIn(fadeDuration);
						}
						break;
					case 'Escape':
						if (list.is(':visible')) {
							select.trigger('change');
							hover.fadeOut(fadeDuration);
							list.fadeOut(fadeDuration);
						}
						break;
					default:
						break;
				}
			});

			selected.on('focusout', (event) => {
				event.stopPropagation();
				hover.fadeOut(fadeDuration);
				list.fadeOut(fadeDuration);
			});

			items.on('click', function(event) {
				event.stopPropagation();
				selected.trigger('focus');
				selected.text($(this).text()).removeClass('active');
				select.val($(this).attr('value'));
				select.trigger('change');
				list.children('li').attr('selected', null);
				$(this).attr('selected', '');
			});

			$(document).click(function() {
				selected.removeClass('active');
				select.trigger('change');
				hover.fadeOut(fadeDuration);
				list.fadeOut(fadeDuration);
			});
		});
	}
}