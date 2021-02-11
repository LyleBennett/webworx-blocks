/**
 * BLOCK: Kadence Tabs Attributes
 */
const { __ } = wp.i18n;
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	tabCount: {
		type: 'number',
		default: 3,
	},
	layout: {
		type: 'string',
		default: 'tabs',
	},
	mobileLayout: {
		type: 'string',
		default: 'inherit',
	},
	tabletLayout: {
		type: 'string',
		default: 'inherit',
	},
	currentTab: {
		type: 'number',
		default: 1,
	},
	minHeight: {
		type: 'number',
		default: '',
	},
	tabAlignment: {
		type: 'string',
		default: 'left',
	},
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	titles: {
		type: 'array',
		default: [ {
			text: __( 'Tab 1' ),
			anchor: '',
		}, {
			text: __( 'Tab 2' ),
			anchor: '',
		}, {
			text: __( 'Tab 3' ),
			anchor: '',
		} ],
	},
	startTab: {
		type: 'number',
		default: '',
	},
};
export default attributes;
