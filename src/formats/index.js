/**
 * Internal dependencies
 */
import { textColor } from './colors/text-color';
import { backgroundColor } from './colors/background-color';
 import { textSize } from './font/text-size';
import { textHeight } from './font/text-height';


//import './dev-old/block.js';
/**
 * WordPress dependencies
 */
const { registerFormatType } = wp.richText;

function registerFormats () {
	[
		textColor,
		backgroundColor,
		textSize,
		textHeight,

	].forEach( ( { name, ...settings } ) => registerFormatType( name, settings ) );
};
registerFormats();
