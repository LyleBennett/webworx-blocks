/**
 * BLOCK: animated svg background
 *
 *
 */

//  Import CSS.

import './style.scss';
import './editor.scss';
import classnames from 'classnames';
//import Slider from "react-slick";
import arrows from './components/arrows';

const { createHigherOrderComponent } = wp.compose;
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
const { TextControl, TextareaControl, Button, PanelBody, IconButton , Toolbar, RadioControl, SelectControl, RangeControl, ToggleControl } = wp.components;

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
registerBlockType( 'wwx/contentcarousel', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Content Slider' ), // Block title.
	icon: 'slides', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'webworx' ),
		__( 'slides' ),
		__( 'carousel' ),
	],
  attributes: {
    slickOptions:{
      type: 'string',
      default: '{"slidesToShow": 4, "slidesToScroll": 4, "speed": 300, "arrows": true, "dots": false, "infinite": true, "responsive": [ { "breakpoint": 1, "settings": {"slidesToShow":1} } ] }',
      source: 'attribute',
      selector: 'div',
      attribute: 'data-slick',
    },
    arrowStyle:{
      type: 'string',
      default: '',
    },
    dotsSize:{
      type: 'string',
      default: 'dots-medium',
    },
    arrowSize:{
      type: 'string',
      default: 'arrows-medium'
    },
    arrowWrap:{
      type: 'string',
      default: ''
    },
    theme:{
      type: "string",
      default: 'theme-dark',
    }
  },
  supports:{
    align: [ 'full', 'wide' ]
  },
 edit: ( props ) => {
   const {
     attributes:
     { slickOptions,
       arrowStyle,
       arrowSize,
       arrowWrap,
       theme,
       dotsSize,
     }, setAttributes, className } = props;

     const updateOptions = (id, x) => {
        let options = JSON.parse(slickOptions);

        if (x == '' && x != false) {
          delete options[id];
        }else{
          options[id] = x;
        }
        setAttributes({ slickOptions: JSON.stringify(options), });
      }

      const updateResponsiveBreakpoint = (x) => {
         let options = JSON.parse(slickOptions);

         if (x == '' && x != false) {
           options['responsive'][0]['breakpoint'] = 0;
         }else{
           options['responsive'][0]['breakpoint'] = x;
         }
         setAttributes({ slickOptions: JSON.stringify(options), });
       }

     const updateResponsiveSettings = (id, x) => {
        let options = JSON.parse(slickOptions);

        if (x == '' && x != false) {
            delete options['responsive'][0]["settings"][id];
        }else{
          options['responsive'][0]["settings"][id] = x;
        }
        setAttributes({ slickOptions: JSON.stringify(options), });
      }

      const updateArrows = (e) =>{
        let options = JSON.parse(slickOptions);
        switch (e) {
          case 'arrows-default':
            options['prevArrow'] = arrows.defaultPrev;
            options['nextArrow'] = arrows.defaultNext;
            break;
          case 'arrows-slim':
            options['prevArrow'] = arrows.slimPrev;
            options['nextArrow'] = arrows.slimNext;
            break;
          case 'arrows-minimal':
            options['prevArrow'] = arrows.minimalPrev;
            options['nextArrow'] = arrows.minimalNext;
            break;
          case 'arrows-custom':
            delete options.prevArrow
            delete options.nextArrow
            break;
          default:
            options['prevArrow'] = arrows.defaultPrev;
            options['nextArrow'] = arrows.defaultNext;
        }
        // { label: 'Default', value: '' },
        // { label: 'Slim', value: 'arrows-slim' },
        // { label: 'Minimal', value: 'arrows-minimal' },
        // { label: 'Custom', value: 'arrows-custom' }

        setAttributes({ slickOptions: JSON.stringify(options),  arrowStyle:e});
      }



    const TEMPLATE = [
            [ 'wwx/slide', {}, [
              [ 'core/paragraph', { placeholder: 'Add slide 1 content here...' } ],
            ] ],
            [ 'wwx/slide', {}, [
              [ 'core/paragraph', { placeholder: 'Add slide 2 content here...' } ],
            ] ],
            [ 'wwx/slide', {}, [
              [ 'core/paragraph', { placeholder: 'Add slide 3 content here...' } ],
            ] ],
            [ 'wwx/slide', {}, [
              [ 'core/paragraph', { placeholder: 'Add slide 4 content here...' } ],
            ] ],
            [ 'wwx/slide', {}, [
              [ 'core/paragraph', { placeholder: 'Add slide 5 content here...' } ],
            ] ],
            [ 'wwx/slide', {}, [
              [ 'core/paragraph', { placeholder: 'Add slide 6 content here...' } ],
            ] ],
            [ 'wwx/slide', {}, [
              [ 'core/paragraph', { placeholder: 'Add slide 7 content here...' } ],
            ] ],
            [ 'wwx/slide', {}, [
              [ 'core/paragraph', { placeholder: 'Add slide 8 content here...' } ],
            ] ]
          ];

     let options = JSON.parse(slickOptions);

     const visi = 'slides-visible-'+options.slidesToShow ;

		return (
      <Fragment>
      {
        <InspectorControls>
          <PanelBody title='Slider Display Settings'>
            <SelectControl
              label="Color Scheme"
              value={ theme }
              options={ [
                  { label: 'Light', value: 'theme-light' },
                  { label: 'Dark', value: 'theme-dark' },
              ] }
              onChange={ ( x ) => { setAttributes( { theme: x } ) } }
          />
            <RangeControl
                label="Slides in view"
                value={ options.slidesToShow }
                min={ 1 }
                max={ 12 }
                onChange={  (e) => updateOptions('slidesToShow', e) }
            />
            <ToggleControl
              label="Dot Navigation"
                checked={ options.dots }
                onChange={ (e) => updateOptions('dots', e) }
            />
            <ToggleControl
              label="Arrow Navigation"
                checked={ options.arrows }
                onChange={ (e) => updateOptions('arrows', e) }
            />
            <ToggleControl
              label="Center Mode"
                checked={ options.centerMode }
                onChange={ (e) => updateOptions('centerMode', e) }
            />
            <ToggleControl
              label="Loop Slides"
                checked={ options.infinite }
                onChange={ (e) => updateOptions('infinite', e) }
            />
          </PanelBody>
          { options.arrows && (
            <PanelBody title='Slider Arrow Settings' initialOpen={ true }>
              <SelectControl
                  label="Arrows Size"
                  value={ arrowSize }
                  options={ [
                      { label: 'Small', value: 'arrows-small' },
                      { label: 'Medium', value: 'arrows-medium' },
                      { label: 'Large', value: 'arrows-large' },
                      { label: 'X Large', value: 'arrows-x-large' }
                  ] }
                  onChange={ ( x ) => { setAttributes( { arrowSize: x } ) } }
              />
              <SelectControl
                  label="Next/Prev Arrow Type"
                  value={ arrowStyle }
                  options={ [
                      { label: 'Select Arrow Type', value: '' },
                      { label: 'Default', value: 'arrows-default' },
                      { label: 'Slim', value: 'arrows-slim' },
                      { label: 'Minimal', value: 'arrows-minimal' },
                      { label: 'Custom', value: 'arrows-custom' }
                  ] }
                  onChange={ (e) => updateArrows(e) }
              />
              <SelectControl
                  label="Next/Prev Button Style"
                  value={ arrowWrap }
                  options={ [
                      { label: 'None', value: '' },
                      { label: 'Circle', value: 'arrows-btn-circle' },
                      { label: 'Circle Outline', value: 'arrows-btn-circle-outline' },
                      { label: 'Rounded', value: 'arrows-btn-rounded' },
                      { label: 'Rounded Outline', value: 'arrows-btn-rounded-outline' },
                      { label: 'Square', value: 'arrows-btn-square' },
                      { label: 'Square Outline', value: 'arrows-btn-square-outline' }
                  ] }
                  onChange={ ( x ) => { setAttributes( { arrowWrap: x } ) } }
              />
              { arrowStyle === 'arrows-custom' &&(
                <div>
                  <TextareaControl
                      label="Next Arrow"
                      help="Custom HTML for Next Arrow"
                      value={ options.nextArrow }
                      onChange={ (e) => updateOptions('nextArrow', e) }
                  />


                  <TextareaControl
                      label="Previous Arrow"
                      help="Custom HTML for Previous Arrow"
                      value={ options.prevArrow }
                      onChange={ (e) => updateOptions('prevArrow', e) }
                  />

                  {`Eg. <button type="button" class="slick-prev">Previous</button>`}
                </div>
                )}

            </PanelBody>
          )}
          { options.dots && (
            <PanelBody title='Slider Dot Settings' initialOpen={ false }>
              <SelectControl
                  label="Dots Style"
                  value={ options.dotsClass }
                  options={ [
                      { label: 'Circle', value: 'slick-dots default' },
                      { label: 'Circle Outline', value: 'slick-dots outline' },
                      { label: 'Rounded', value: 'slick-dots rounded' },
                      { label: 'Rounded Outline', value: 'slick-dots rounded-outline' },
                      { label: 'Square', value: 'slick-dots squared' },
                      { label: 'Square Outline', value: 'slick-dots squared-outline' }
                  ] }
                  onChange={ (e) => updateOptions('dotsClass', e) }
              />
              <SelectControl
                  label="Dots Size"
                  value={ dotsSize }
                  options={ [
                      { label: 'Small', value: 'dots-small' },
                      { label: 'Medium', value: 'dots-medium' },
                      { label: 'Large', value: 'dots-large' },
                      { label: 'X Large', value: 'dots-x-large' }
                  ] }
                  onChange={ ( x ) => { setAttributes( { dotsSize: x } ) } }
              />
            </PanelBody>
          )}
          <PanelBody title='Animation Settings' initialOpen={ false }>
            <RangeControl
                label="Amount of slides to scroll by"
                min={ 1 }
                max={ 12 }
                value={ options.slidesToScroll }
                onChange={ (e) => updateOptions('slidesToScroll', e)  }
            />
            <RangeControl
                label="Scroll by speed (ms)"
                value={ options.speed }
                min={ 1 }
                max={ 5000 }
                onChange={ (e) => updateOptions('speed', e) }
            />
            <ToggleControl
              label="Autoplay slides"
                checked={ options.autoplay }
                onChange={ (e) => updateOptions('autoplay', e) }
            />
            { options.autoplay && (
              <RangeControl
                  label="Autoplay speed (ms)"
                  value={ options.autoplaySpeed }
                  min={ 1 }
                  max={ 5000 }
                  onChange={ (e) => updateOptions('autoplaySpeed', e) }
              />
            )}
          </PanelBody>
          <PanelBody title='Responsive Settings' initialOpen={ false }>

            <TextControl
                label="Breakpoint (px)"
                type="number"
                value={ options.responsive[0].breakpoint }
                onChange={ (e) => updateResponsiveBreakpoint(e) }
            />
            <RangeControl
                label="Visible Slides"
                value={ options.responsive[0].settings.slidesToShow }
                min={ 1 }
                max={ 12 }
                onChange={ (e) => updateResponsiveSettings('slidesToShow', e) }
            />
          </PanelBody>
          <PanelBody title='Slider Advanced Settings' initialOpen={ false }>
            <RangeControl
                label="Rows in slider"
                value={ options.rows }
                min={ 1 }
                max={ 12 }
                onChange={  (e) => updateOptions('rows', e) }
            />
          </PanelBody>

          </InspectorControls>
      }


            <div className={`${className} ${visi} ${arrowStyle} ${arrowSize} ${dotsSize} ${theme} ${arrowWrap}`} >
                  <InnerBlocks allowedBlocks={['wwx/slide']}  template={ TEMPLATE } />
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
    const {
      slickOptions,
      arrowStyle,
      arrowSize,
      arrowWrap,
      dotsSize,
      theme,
    } = props.attributes;

		return (
        <div className={`${arrowStyle} ${arrowSize} ${dotsSize} ${theme} ${arrowWrap}`}  data-slick={ slickOptions } >
          <InnerBlocks.Content />
        </div>

		);
	},

} );
// const modifyEditHtml = createHigherOrderComponent( ( BlockEdit ) => {
//     return ( props ) => {
//         return (
//             <Fragment>
//                 <BlockEdit { ...props } />
//             </Fragment>
//         );
//     };
// }, "withInspectorControl" );
// wp.hooks.addFilter(
//     "editor.BlockEdit",
//     "wwx/modifySaveHtml",
//     modifyEditHtml
// );

// const addClassName = createHigherOrderComponent(BlockListBlock => {
//     return props => {
//         if (props.name === "wwx/contentcarousel") {
//             return <BlockListBlock {...props} className="test" />;
//         }
//         return <BlockListBlock {...props} />;
//     };
// }, "addClassName");
//
// wp.hooks.addFilter(
//     "editor.BlockListBlock",
//     "wwx/contentcarousel",
//     addClassName
// );
