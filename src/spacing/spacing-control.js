/**
 * External dependencies
 */
import { assign } from 'lodash';

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { PanelBody, TextControl } = wp.components;
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;

// Enable spacing control on the following blocks
const enableSpacingControlOnBlocks = [
	'core/image',
  'core/paragraph',
	'core/heading',
	'wwx/divorspan',
];

const regxpad = /^ *(((\d+)(px|%|em))|0) *(?:(?: *((\d+)(px|%|em)|0))? *(?:(?: *((\d+)(px|%|em))|0)? *(?: *((\d+)(px|%|em))|0)?)?)?$/ ;
const regxmar = /^ *(((\d+)(px|%|em))|0|auto) *(?:(?: *((\d+)(px|%|em)|0|auto))? *(?:(?: *((\d+)(px|%|em))|0|auto)? *(?: *((\d+)(px|%|em))|0|auto)?)?)?$/ ;
/**
 * Add spacing control attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addSpacingControlAttribute = ( settings, name ) => {
	// Do nothing if it's another block than our defined ones.
	if ( ! enableSpacingControlOnBlocks.includes( name ) ) {
		return settings;
	}

	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = assign( settings.attributes, {
		padding: {
			type: 'string',
		},
		margin: {
			type: 'string',
		},
	} );

	return settings;
};

addFilter( 'blocks.registerBlockType', 'wwx/attribute/spacing', addSpacingControlAttribute );

/**
 * Create HOC to add spacing control to inspector controls of block.
 */
const withSpacingControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// Do nothing if it's another block than our defined ones.
		if ( ! enableSpacingControlOnBlocks.includes( props.name ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const { padding, margin } = props.attributes;


		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Spacing' ) }
						initialOpen={ true }
					>
						<TextControl
							label={ __( 'Padding' ) }
							help={ __( 'css shorthand syntax, allows px,%,em' ) }
							value={ padding }
							onChange={ ( v ) => {
									props.setAttributes( {
										padding: v,
									} );
							} }
						/>
						<TextControl
							label={ __( 'Margin' ) }
							help={ __( 'css shorthand syntax, allows px,%,em, auto' ) }
							value={ margin }
							onChange={ ( v ) => {
									props.setAttributes( {
										margin: v,
									} );
							} }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withSpacingControl' );

addFilter( 'editor.BlockEdit', 'wwx/with-spacing-control', withSpacingControl );

/**
 * Add inline style attribute to save element of block.
 *
 * @param {object} saveElementProps Props of save element.
 * @param {Object} blockType Block type information.
 * @param {Object} attributes Attributes of block.
 *
 * @returns {object} Modified props of save element.
 */
const addSpacingExtraProps = ( saveElementProps, blockType, attributes ) => {
	// Do nothing if it's another block than our defined ones.
	if ( ! enableSpacingControlOnBlocks.includes( blockType.name ) ) {
		return saveElementProps;
	}
	const margStat = regxmar.test(attributes.margin);
	const paddingStat = regxpad.test(attributes.padding);

	if ( margStat && paddingStat) {
		// Use Lodash's assign to gracefully handle if attributes are undefined
			assign( saveElementProps, { style: { 'padding': attributes.padding , 'margin': attributes.margin } } );
	}else if ( margStat ) {
		assign( saveElementProps, { style: { 'margin': attributes.margin } } );
	}else if (paddingStat) {
		assign( saveElementProps, { style: { 'padding': attributes.padding } } );
	}

	return saveElementProps;
};

addFilter( 'blocks.getSaveContent.extraProps', 'wwx/get-save-content/extra-props', addSpacingExtraProps );
