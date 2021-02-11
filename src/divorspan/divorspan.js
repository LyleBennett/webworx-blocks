
import classnames from 'classnames';

const { registerBlockType } = wp.blocks;
const { select } = wp.data;
const {
    RichText,
    AlignmentToolbar,
    BlockControls,
    InspectorControls,
    ColorPalette,
    PanelColorSettings,
    getFontSize,
    getFontSizeClass,
    getColorClassName,
    getColorObjectByColorValue,
} = wp.blockEditor;

const{
  RadioControl,
  PanelBody,
  FontSizePicker,
  withFontSizes,
} = wp.components;

const { withState } = wp.compose;

const { __ } = wp.i18n; // Import __() from wp.i18n

registerBlockType( 'wwx/divorspan', {
    title: 'Div or Span',
    icon: 'editor-code',
    category: 'layout',
    supports: {
      align: [ 'wide', 'full' ],
      alignwide: true,
    },
    attributes: {
        content: {
            type: 'array',
            source: 'children',
            selector: 'div, span',
        },
        align: {
            type: 'string',
        },
        wrapper: {
          type: 'string',
          default: 'div',
        },
        backgroundColor: {
      		type: 'string',
      	},
      	textColor: {
      		type: 'string',
      	},
        customBackgroundColor: {
      		type: 'string',
      	},
      	customTextColor: {
      		type: 'string',
      	},
        textSize: {
          type: 'string'
        },
      	customTextSize: {
      		type: 'number',
        }
    },
    edit: ( props ) => {
        const {
            attributes: {
                content,
                align,
                wrapper,
                customTextSize,
                textSize,
                textColor,
                customTextColor,
                backgroundColor,
                customBackgroundColor
            },
            className,
        } = props;

        const settings = select( 'core/editor' ).getEditorSettings();

        const fontSizeClass = getFontSizeClass( textSize );

        const onChangeContent = ( newContent ) => {
            props.setAttributes( { content: newContent } );

        };

        const onChangeAlignment = ( newAlignment ) => {
            props.setAttributes( { align: newAlignment } );
        };

        const onChangeWrapper = ( newWrapper ) => {
            props.setAttributes( { wrapper: newWrapper === undefined ? 'div' : newWrapper } );
        };

        const setFontSize =  ( newFontSize ) => {
            props.setAttributes( { customTextSize: newFontSize } );
            props.setAttributes( { textSize: false } );
            for(var i= 0, l = settings.fontSizes.length; i< l; i++){
            	if(settings.fontSizes[i]['size'] === newFontSize){
                props.setAttributes( { textSize: settings.fontSizes[i]['name']} );
                break;
            	}
            }
        };

        const setBackgroundColor =  ( newBackgroundColor ) => {
          const textBackgroundColorObj = getColorObjectByColorValue( settings.colors, newBackgroundColor );
          if (textBackgroundColorObj) {
            const classBackN = getColorClassName( 'background-color', textBackgroundColorObj.slug );
            props.setAttributes( { backgroundColor: classBackN } );
          }else {
            props.setAttributes( { backgroundColor: undefined } );
          }
          props.setAttributes( { customBackgroundColor: newBackgroundColor } );
        };

        const setTextColor =  ( newTextColor ) => {
          const textColorObj = getColorObjectByColorValue( settings.colors, newTextColor );
          if (textColorObj) {
            const classN = getColorClassName( 'color', textColorObj.slug );
            props.setAttributes( { textColor: classN } );
          }else {
            props.setAttributes( { textColor: undefined } );
          }
          props.setAttributes( { customTextColor: newTextColor } );
        };


        return (
            <div>
                {
                  <InspectorControls>
                        <PanelBody title='Wrap Settings'>
                          <RadioControl
                              label="Wrapper Type"
                              help="Choose element tag"
                              selected={ wrapper }
                              options={ [
                                  { label: 'div', value: 'div' },
                                  { label: 'span', value: 'span' },
                              ] }
                              onChange={ onChangeWrapper }
                          />
                        </PanelBody>
              					<PanelBody title={ __( 'Text Settings' ) } className="blocks-font-size" initialOpen={ false } >
              						<FontSizePicker
                            fontSizes={ settings.fontSizes }
              							value={ customTextSize }
              							onChange={ setFontSize }
              						/>
              					</PanelBody>
              					<PanelColorSettings
              						title={ __( 'Color Settings' ) }
              						initialOpen={ false }
              						colorSettings={ [
              							{
              								value: customBackgroundColor,
              								onChange: setBackgroundColor,
              								label: __( 'Background Color' ),
              							},
              							{
              								value: customTextColor,
              								onChange: setTextColor,
              								label: __( 'Text Color' ),
              							},
              						] }
              					>
              					</PanelColorSettings>
                    </InspectorControls>
                }
                {
                    <BlockControls>
                        <AlignmentToolbar
                            value={ align }
                            onChange={ onChangeAlignment }
                        />
                    </BlockControls>
                }
                <RichText
                    className={ classnames( 'wp-block-paragraph', className, {
                    					'has-text-color': textColor,
                    					'has-background': backgroundColor,
                    					[ backgroundColor ]: backgroundColor,
                    					[ textColor ]: textColor,
                    					[ fontSizeClass ]: textSize,
                    } ) }
                    style={{
            								fontSize: customTextSize+"px",
            								textAlign: align,
                            color: customTextColor,
                            backgroundColor: customBackgroundColor
                    }}
                    tagName={ wrapper }
                    onChange={ onChangeContent }
                    value={ content }
                />
            </div>
        );
    },
  save: ( props ) => {
      const {
    		align,
    		content,
    		backgroundColor,
        customBackgroundColor,
    		textColor,
        customTextColor,
    		customTextSize,
        textSize,
    		customFontSize,
        wrapper,
    	} = props.attributes;

      const settings = select( 'core/editor' ).getEditorSettings();

      const fontSizeClass = getFontSizeClass( textSize );

  	  const className = classnames( {
    		'has-text-color': textColor || customTextColor,
    		'has-background': backgroundColor || customBackgroundColor,
    		[ fontSizeClass ]: fontSizeClass,
    		[ textColor ]: textColor,
    	  [ backgroundColor ]: backgroundColor,
    	} );



    	const styles = {
    		backgroundColor: backgroundColor ? undefined : customBackgroundColor,
    		color: textColor ? undefined : customTextColor,
    		fontSize: fontSizeClass ? undefined : customTextSize,
    		textAlign: align,
    	};

    	return (
    		<RichText.Content
    			tagName={ wrapper }
    			style={ styles ? styles : undefined }
    			className={ className ? className : undefined }
    			value={ content }
    		/>
      );

  },
} );
