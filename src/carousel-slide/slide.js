/**
 * BLOCK: animated svg background
 *
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import classnames from 'classnames';

const { select } = wp.data;
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const {
    BlockControls,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    MediaPlaceholder,
    InnerBlocks
} = wp.blockEditor;
const { Fragment} = wp.element;
const { TextControl, TextareaControl, Button, PanelBody, IconButton, Toolbar, RadioControl, SelectControl, RangeControl, ToggleControl } = wp.components;

/**
 * Register: the Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'wwx/slide', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Carousel Slide' ), // Block title.
	icon: 'slides', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  parent: ['wwx/contentcarousel'],
  attributes: {

  },

 edit: ( props ) => {
   const {
     attributes:
     {

     }, setAttributes, className } = props;


		return (
      <Fragment>
      {
        <InspectorControls>
          <p>This block is an individual slide for the content slide carousel.</p>
          </InspectorControls>
      }

            <div className={className} >
              <InnerBlocks />
            </div>

      </Fragment>
		);
	},
	save: function( props ) {
    const {
      attributes:
      {

      }, setAttributes, className } = props;
    		return (
        <div className={className}>
          <InnerBlocks.Content />
        </div>

		);
	},

} );
//help build carousel - https://github.com/WordPress/gutenberg/issues/10479, https://stackoverflow.com/questions/53345956/gutenberg-custom-block-add-elements-by-innerblocks-length, https://www.npmjs.com/package/pure-react-carousel
