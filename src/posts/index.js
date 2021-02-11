/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';



registerBlockType( 'wwx/custom-posts', {
	title: __( 'Post Types Grid' ),
	description: __( 'Display a list of your most recent posts.' ),
	icon: 'grid-view',
	category: 'widgets',
	keywords: [ __( 'custom posts' ) ],
	supports: {
		align: true,
		html: false,
	},
	edit,
});
