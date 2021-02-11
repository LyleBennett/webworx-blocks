/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import './styles/editor.scss';
import InlineFontsToolbar from './controls';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;


/**
 * Block constants
 */
const name = 'wwx/inlinesize';

export const textSize = {
	name,
	title: __( 'Text Size' ),
	tagName: 'span',
	className: 'has-inline-size',
	attributes: {
		style: 'style',
	},
	edit( { isActive, value, onChange, activeAttributes } ) {

		return (
			<Fragment>
				<InlineFontsToolbar name={ name } isActive={ isActive } value={ value } onChange={ onChange } activeAttributes={ activeAttributes }  />
			</Fragment>
		);

	},
};
