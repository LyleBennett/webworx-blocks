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
const { TextControl, TextareaControl, Button, PanelBody, IconButton , Toolbar, RadioControl, SelectControl } = wp.components;

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
registerBlockType( 'wwx/popup', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Pop Up Modal' ), // Block title.
	icon: 'format-video', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'webworx' ),
		__( 'popup' ),
		__( 'modal' ),
	],
  attributes: {
    poptype: {
      type: 'string',
      default: 'video',
    },
    displaytype: {
      type: 'string',
      default: 'inline-block',
    },
    datalink:{
      type: 'string',
    },
  },
  supports:{
    align: [ 'full' ]
  },
 edit: ( props ) => {
   const {
     attributes:
     {
       poptype,
       datalink,
       displaytype,
     }, setAttributes, className } = props;

		return (
      <Fragment>
      {
        <InspectorControls>
        <SelectControl
          label="Display"
          value={ displaytype }
          options={ [
              { label: 'block', value: 'block' },
              { label: 'flex', value: 'flex' },
              { label: 'inline', value: 'inline' },
              { label: 'inline-block', value: 'inline-block' },
              { label: 'grid', value: 'grid' },
              { label: 'table', value: 'table' },
              { label: 'table-row', value: 'table-row' },
              { label: 'table-cell', value: 'table-cell' },
          ] }
          onChange={ x =>	setAttributes({ displaytype: x === undefined ? 'inline-block' : x  }) }
          />
        <hr/>
          <RadioControl
              label="Popup Type"
              selected={ poptype }
              options={ [
                  { label: 'Video Link', value: 'video' },
                  { label: 'Post/Page ID', value: 'content' },
              ] }
              onChange={ x =>	setAttributes({ poptype: x === undefined ? 'video' : x  }) }
          />
          <hr/>
          { poptype=='video' && (
          <TextControl
              label="Video URL"
              value={ datalink }
              onChange={ x  => setAttributes({ datalink: x }) }
          />
          )}
          { poptype=='content' && (
          <TextControl
              label="Post or Page ID"
              value={ datalink }
              onChange={ x  => setAttributes( { datalink: x } ) }
          />
          )}

          </InspectorControls>
      }
            <div className={ ["inner-content"] } style={ {display: displaytype}}>
              <InnerBlocks allowedBlocks={ [ 'core/group', 'core/image', 'core/paragraph', 'core/heading', 'core/button', 'core/separator', 'core/columns' , 'core/spacer', 'core/list', 'wwx/divorspan' ] } />
            </div>

      </Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {
    const { datalink,
            poptype,
            displaytype,
    } = props.attributes;


		return (
        <div className={"has-"+poptype+"-popup"} style={ {display: displaytype}} dataLink={datalink}>
          <InnerBlocks.Content />
        </div>


		);
	},

    deprecated: [
        {
          attributes: {
            poptype: {
              type: 'string',
              default: 'video',
            },
            datalink:{
              type: 'string',
            },
          },

            save( props ) {
              const { datalink,
                      poptype,
              } = props.attributes;


          		return (
                  <div className={"has-"+poptype+"-popup"} dataLink={datalink}>
                    <InnerBlocks.Content />
                  </div>


          		);
            },
        }
    ]
} );
