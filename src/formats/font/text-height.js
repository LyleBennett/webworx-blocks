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
const { toggleFormat } = wp.richText;
const { RichTextShortcut, __unstableRichTextInputEvent } = wp.blockEditor;


/**
 * Block constants
 */
const name = 'wwx/inlineheight';

export const textHeight = {
	name,
	title: __( 'Line Height' ),
	tagName: 'span',
	className: 'has-inline-lineheight',
	attributes: {
		style: 'style',
	},
	edit( { isActive, value, onChange, activeAttributes } ) {
		return null;
	},
};
