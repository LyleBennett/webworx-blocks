/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import './styles/editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { select, withSelect } = wp.data;
const { BlockControls } = wp.blockEditor;
const { applyFormat, toggleFormat, removeFormat, getActiveFormat } = wp.richText;
const { Toolbar, IconButton, Icon, Popover, TextControl, FontSizePicker } = wp.components;
const { compose } = wp.compose;

class InlineFontsToolbar extends Component {
	constructor( props ) {
		super( ...arguments );

		this.state = {
			openPopover: false,
		};
	}

	render() {

		const {
			name,
			isActive,
			value,
			onChange,
			isDisabled,
			activeAttributes,
		} = this.props;

		if( isDisabled ){
			return null;
		}
		const TextIcon = () => (
		    <Icon icon={ <svg height="20px"><path d="M19,7h-5.5v12h-3V7H5V4h14V7z M14.656,10.127v1.774h3.253V19h1.774v-7.099h3.253v-1.774H14.656z" /></svg> } />
		);
		const lineHeight = 'wwx/inlineheight';

		const fonts = get( select( 'core/block-editor' ).getSettings(), [ 'fontSizes' ], [] );

		let activeSize, activeLineHeight, size;

		const activeSizeFormat = getActiveFormat( value, name );
		const activeLineHeightFormat = getActiveFormat( value, lineHeight );

    	if( activeSizeFormat ){
					const styleSize = activeSizeFormat.attributes.style;
					activeSize = parseFloat(styleSize.replace(new RegExp(`^font-size:\\s*`), ''));
    	}

    	if( activeLineHeightFormat ){
    		const styleHeight = activeLineHeightFormat.attributes.style;
				activeLineHeight = parseFloat(styleHeight.replace(new RegExp(`^line-height:\\s*`), ''));
    	}

		return (
			<Fragment>
				<BlockControls>
					<Toolbar className="components-dropdown-menu">
						<IconButton
							className="components-button components-icon-button components-dropdown-menu__toggle components-dropdown-menu__toggle"
							icon={TextIcon()}
							aria-haspopup="true"
							label={ __( 'Text Size' ) }
							tooltip={ __( 'Text Size' ) }
							onClick={ () => this.setState( { openPopover: ! this.state.openPopover } ) }
						>
							<span className="components-dropdown-menu__indicator" />
						</IconButton>

						{ this.state.openPopover && (
							<Popover
								position="bottom center"
								className="components-wwx__inline-color-popover"
								focusOnMount="container"
								onClickOutside={ ( onClickOutside ) => {
									if(
									( ! onClickOutside.target.classList.contains( 'components-dropdown-menu__toggle' )
									&& ! document.querySelector('.components-dropdown-menu__toggle').contains( onClickOutside.target )
									)
									&&
									( !document.querySelector('.components-color-palette__picker') || ( document.querySelector('.components-color-palette__picker')
									&& ! document.querySelector('.components-color-palette__picker').contains( onClickOutside.target ) )
									)
									) {
										this.setState( { openPopover: ! this.state.openPopover } );
									}
								} }
							>
								<span class="components-base-control__label components-base-control__title">{ __( 'Highlighted Text Size Settings' ) }</span>
								<TextControl
									label={ __( 'Font Size' ) }
									type="number"
									value={ activeSize }
									onChange={ ( size ) => {
										if( size ){
											onChange(
												applyFormat( value, {
													type: name,
													attributes: {
														style: `font-size:${size}px`,
													},
												} )
											);
										}else{
											onChange( removeFormat( value, name ) )
										}
									} }
								>
								</TextControl >

								<TextControl
									label={ __( 'Line Height' ) }
									type="number"
									value={ activeLineHeight }
									onChange={ ( height ) => {
										if( height ){
											onChange(
												applyFormat( value, {
													type: lineHeight,
													attributes: {
														style: `line-height:${height}px`,
													},
												} )
											);
										}else{
											onChange( removeFormat( value, lineHeight ) )
										}
									} }
								>
								</TextControl>
							</Popover>
						) }
					</Toolbar>
				</BlockControls>
			</Fragment>
		);
	}

}

export default compose(
	withSelect( select => {
		return {
			isDisabled: select( 'core/edit-post' ).isFeatureActive( 'disablewwxTextFormats' ),
		};
	} )
)( InlineFontsToolbar );
