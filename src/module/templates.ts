/**
 * Preload a set of templates to compile and cache them for
 * fast access during rendering
 */
export const preloadHandlebarsTemplates = async function() {

	const templatePaths = [

		// Global sheet partials
		'systems/fate/templates/sheet-id.html',
		'systems/fate/templates/sheet-aspects.html',
		'systems/fate/templates/sheet-biography.html',
		'systems/fate/templates/sheet-stunts.html'
	];

	// Load the template partials
	return loadTemplates(templatePaths);
}