/**
 * BLOCK: Kadence Tabs
 */

/**
 * Import Icons
 */


/**
 * Import External
 */
import times from 'lodash/times';
import map from 'lodash/map';
import classnames from 'classnames';
import memoize from 'memize';
import filter from 'lodash/filter';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';
const {
	createBlock,
} = wp.blocks;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.blockEditor;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	TextControl,
} = wp.components;
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;

const ALLOWED_BLOCKS = [ 'wwx/tab' ];

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */
const getPanesTemplate = memoize( ( panes ) => {
	return times( panes, n => [ 'wwx/tab', { id: n + 1 } ] );
} );
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kttabsUniqueIDs = [];
/**
 * Build the row edit
 */
class WwxTabs extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.onMoveForward = this.onMoveForward.bind( this );
		this.onMoveBack = this.onMoveBack.bind( this );
		this.state = {
			hovered: 'false',
			showPreset: false,
			user: ( 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			// const oldBlockConfig = kadence_blocks_params.config[ 'wwx/tabs' ];
			// const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			// if ( blockConfigObject[ 'wwx/tabs' ] !== undefined && typeof blockConfigObject[ 'wwx/tabs' ] === 'object' ) {
			// 	Object.keys( blockConfigObject[ 'wwx/tabs' ] ).map( ( attribute ) => {
			// 		this.props.attributes[ attribute ] = blockConfigObject[ 'wwx/tabs' ][ attribute ];
			// 	} );
			// } else if ( oldBlockConfig !== undefined && typeof oldBlockConfig === 'object' ) {
			// 	Object.keys( oldBlockConfig ).map( ( attribute ) => {
			// 		this.props.attributes[ attribute ] = oldBlockConfig[ attribute ];
			// 	} );
			// }
			if ( this.props.attributes.showPresets ) {
				this.setState( { showPreset: true } );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kttabsUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kttabsUniqueIDs.push( this.props.attributes.uniqueID );
		}
		// const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		// if ( blockSettings[ 'wwx/tabs' ] !== undefined && typeof blockSettings[ 'wwx/tabs' ] === 'object' ) {
		// 	this.setState( { settings: blockSettings[ 'wwx/tabs' ] } );
		// }
	}
	showSettings( key ) {
		if ( undefined === this.state.settings[ key ] || 'all' === this.state.settings[ key ] ) {
			return true;
		} else if ( 'contributor' === this.state.settings[ key ] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'author' === this.state.settings[ key ] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'editor' === this.state.settings[ key ] && ( 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'admin' === this.state.settings[ key ] && 'admin' === this.state.user ) {
			return true;
		}
		return false;
	}
	saveArrayUpdate( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { titles } = attributes;

		const newItems = titles.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			titles: newItems,
		} );
	}
	onMove( oldIndex, newIndex ) {
		const titles = [ ...this.props.attributes.titles ];
		titles.splice( newIndex, 1, this.props.attributes.titles[ oldIndex ] );
		titles.splice( oldIndex, 1, this.props.attributes.titles[ newIndex ] );
		this.props.setAttributes( { titles: titles, currentTab: parseInt( newIndex + 1 ) } );
		if ( this.props.attributes.startTab === ( oldIndex + 1 ) ) {
			this.props.setAttributes( { startTab: ( newIndex + 1 ) } );
		} else if ( this.props.attributes.startTab === ( newIndex + 1 ) ) {
			this.props.setAttributes( { startTab: ( oldIndex + 1 ) } );
		}
		this.props.moveTab( this.props.tabsBlock.innerBlocks[ oldIndex ].clientId, newIndex );
		this.props.resetOrder();
		this.props.setAttributes( { currentTab: parseInt( newIndex + 1 ) } );
	}

	onMoveForward( oldIndex ) {
		return () => {
			if ( oldIndex === this.props.realTabsCount - 1 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex + 1 );
		};
	}

	onMoveBack( oldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex - 1 );
		};
	}
	render() {
		const { attributes: { uniqueID, tabCount, blockAlignment, mobileLayout, currentTab, tabletLayout, layout, titles, tabAlignment, startTab, minHeight }, clientId, className, setAttributes } = this.props;
		const layoutClass = ( ! layout ? 'tabs' : layout );

		const startlayoutOptions = [
			{ key: 'skip', name: __( 'Skip' ), icon: __( 'Skip' ) },
			{ key: 'simple', name: __( 'Simple' ), icon: 'welcome-widgets-menus' },
			{ key: 'boldbg', name: __( 'Boldbg' ), icon: 'welcome-widgets-menus' },
			{ key: 'center', name: __( 'Center' ), icon: 'welcome-widgets-menus' },
			{ key: 'vertical', name: __( 'Vertical' ), icon: 'welcome-widgets-menus' },
		];
		const setInitalLayout = ( key ) => {
			if ( 'skip' === key ) {
			} else if ( 'simple' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'left',
				} );
			} else if ( 'boldbg' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'left',
				} );
			} else if ( 'center' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'center',
				} );
			} else if ( 'vertical' === key ) {
				setAttributes( {
					layout: 'vtabs',
					mobileLayout: 'accordion',
					tabAlignment: 'left',
				} );
			}
		};

		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const classes = classnames( className, `wwx-tabs-wrap wwx-tabs-id${ uniqueID } wwx-tabs-has-${ tabCount }-tabs wwx-active-tab-${ currentTab } wwx-tabs-layout-${ layoutClass } wwx-tabs-block wwx-tabs-tablet-layout-${ tabLayoutClass } wwx-tabs-mobile-layout-${ mobileLayoutClass } wwx-tab-alignment-${ tabAlignment }` );
		const mLayoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: 'welcome-widgets-menus' },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: 'welcome-widgets-menus' },
			{ key: 'accordion', name: __( 'Accordion' ), icon: 'welcome-widgets-menus' },
		];
		const layoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: 'welcome-widgets-menus' },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: 'welcome-widgets-menus' },
		];
		const mobileControls = (
			<div>
				<PanelBody>
					<p className="components-base-control__label">{ __( 'Mobile Layout' ) }</p>
					<ButtonGroup aria-label={ __( 'Mobile Layout' ) }>
						{ map( mLayoutOptions, ( { name, key, icon } ) => (
							<Tooltip text={ name }>
								<Button
									key={ key }
									className="wwx-layout-btn wwx-tablayout"
									isSmall
									isPrimary={ mobileLayout === key }
									aria-pressed={ mobileLayout === key }
									onClick={ () => setAttributes( { mobileLayout: key } ) }
								>
									{ name }
								</Button>
							</Tooltip>
						) ) }
					</ButtonGroup>
				</PanelBody>
			</div>
		);
		const tabletControls = (
			<PanelBody>
				<p className="components-base-control__label">{ __( 'Tablet Layout' ) }</p>
				<ButtonGroup aria-label={ __( 'Tablet Layout' ) }>
					{ map( mLayoutOptions, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="wwx-layout-btn wwx-tablayout"
								isSmall
								isPrimary={ tabletLayout === key }
								aria-pressed={ tabletLayout === key }
								onClick={ () => setAttributes( { tabletLayout: key } ) }
							>
								{ name }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
			</PanelBody>
		);

		const deskControls = (
			<Fragment>
				<PanelBody>
					<p className="components-base-control__label">{ __( 'Layout' ) }</p>
					<ButtonGroup aria-label={ __( 'Layout' ) }>
						{ map( layoutOptions, ( { name, key, icon } ) => (
							<Tooltip text={ name }>
								<Button
									key={ key }
									className="wwx-layout-btn wwx-tablayout"
									isSmall
									isPrimary={ layout === key }
									aria-pressed={ layout === key }
									onClick={ () => {
										setAttributes( {
											layout: key,
										} );
									} }
								>
									{ name }
								</Button>
							</Tooltip>
						) ) }
					</ButtonGroup>
					<h2>{ __( 'Set initial Open Tab' ) }</h2>
					<ButtonGroup aria-label={ __( 'initial Open Tab' ) }>
						{ times( tabCount, n => (
							<Button
								key={ n + 1 }
								className="wwx-init-open-tab"
								isSmall
								isPrimary={ startTab === n + 1 }
								aria-pressed={ startTab === n + 1 }
								onClick={ () => setAttributes( { startTab: n + 1 } ) }
							>
								{ __( 'Tab' ) + ' ' + ( n + 1 ) }
							</Button>
						) ) }
					</ButtonGroup>
				</PanelBody>
			</Fragment>
		);
		const tabControls = (
			<TabPanel className="wwx-inspect-tabs"
				activeClass="active-tab"
				tabs={ [
					{
						name: 'desk',
						title: <Dashicon icon="desktop" />,
						className: 'wwx-desk-tab',
					},
					{
						name: 'tablet',
						title: <Dashicon icon="tablet" />,
						className: 'wwx-tablet-tab',
					},
					{
						name: 'mobile',
						title: <Dashicon icon="smartphone" />,
						className: 'wwx-mobile-tab',
					},
				] }>
				{
					( tab ) => {
						let tabout;
						if ( tab.name ) {
							if ( 'mobile' === tab.name ) {
								tabout = mobileControls;
							} else if ( 'tablet' === tab.name ) {
								tabout = tabletControls;
							} else {
								tabout = deskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const renderTitles = ( index ) => {
			return (
				<Fragment>
					<li className={ `wwx-title-item wwx-title-item-${ index }  wwx-tab-title-${ ( 1 + index === currentTab ? 'active' : 'inactive' ) }` }>
						<div className={ `wwx-tab-title wwx-tab-title-${ 1 + index }` }  onClick={ () => setAttributes( { currentTab: 1 + index } ) } onKeyPress={ () => setAttributes( { currentTab: 1 + index } ) } tabIndex="0" role="button">

								<RichText
									tagName="div"
									placeholder={ __( 'Tab Title' ) }
									value={ ( titles[ index ] && titles[ index ].text ? titles[ index ].text : '' ) }
									unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
									onChange={ value => {
										this.saveArrayUpdate( { text: value }, index );
									} }
									formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
									allowedFormats={ [ 'core/bold', 'core/italic', 'core/strikethrough' ] }
									className={ 'wwx-title-text' }

									keepPlaceholderOnFocus
								/>

						</div>
						<div className="kadence-blocks-tab-item__control-menu">
							{ index !== 0 && (
								<IconButton
									icon={ ( 'vtabs' === layout ? 'arrow-up' : 'arrow-left' ) }
									onClick={ index === 0 ? undefined : this.onMoveBack( index ) }
									className="kadence-blocks-tab-item__move-back"
									label={ ( 'vtabs' === layout ? __( 'Move Item Up' ) : __( 'Move Item Back' ) ) }
									aria-disabled={ index === 0 }
									disabled={ index === 0 }
								/>
							) }
							{ ( index + 1 ) !== tabCount && (
								<IconButton
									icon={ ( 'vtabs' === layout ? 'arrow-down' : 'arrow-right' ) }
									onClick={ ( index + 1 ) === tabCount ? undefined : this.onMoveForward( index ) }
									className="kadence-blocks-tab-item__move-forward"
									label={ ( 'vtabs' === layout ? __( 'Move Item Down' ) : __( 'Move Item Forward' ) ) }
									aria-disabled={ ( index + 1 ) === tabCount }
									disabled={ ( index + 1 ) === tabCount }
								/>
							) }
							{ tabCount > 1 && (
								<IconButton
									icon="no-alt"
									onClick={ () => {
										const removeClientId = this.props.tabsBlock.innerBlocks[ index ].clientId;
										const currentItems = filter( this.props.attributes.titles, ( item, i ) => index !== i );
										const newCount = tabCount - 1;
										let newStartTab;
										if ( startTab === ( index + 1 ) ) {
											newStartTab = '';
										} else if ( startTab > ( index + 1 ) ) {
											newStartTab = startTab - 1;
										} else {
											newStartTab = startTab;
										}
										setAttributes( { titles: currentItems, tabCount: newCount, currentTab: ( index === 0 ? 1 : index ), startTab: newStartTab } );
										this.props.removeTab( removeClientId );
										this.props.resetOrder();
									} }
									className="kadence-blocks-tab-item__remove"
									label={ __( 'Remove Item' ) }
									disabled={ ! currentTab === ( index + 1 ) }
								/>
							) }
						</div>
					</li>
				</Fragment>
			);
		};
		const renderPreviewArray = (
			<Fragment>
				{ times( tabCount, n => renderTitles( n ) ) }
			</Fragment>
		);
		const renderAnchorSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Tab' ) + ' ' + ( index + 1 ) + ' ' + __( 'Anchor' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'HTML Anchor' ) }
						help={ __( 'Anchors lets you link directly to a tab.' ) }
						value={ titles[ index ] && titles[ index ].anchor ? titles[ index ].anchor : '' }
						onChange={ ( nextValue ) => {
							nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
							this.saveArrayUpdate( { anchor: nextValue }, index );
						} } />
				</PanelBody>
			);
		};
		const renderTitleSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Tab' ) + ' ' + ( index + 1 ) + ' ' + __( 'Icon' ) }
					initialOpen={ false }
				>
				Text
				</PanelBody>
			);
		};



		return (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'wide', 'full' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
							<AlignmentToolbar
								label={ __( 'Change Tabs Titles Alignment' ) }
								value={ tabAlignment }
								onChange={ ( nextAlign ) => {
									setAttributes( { tabAlignment: nextAlign } );
								} }
							/>
				</BlockControls>
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						{ this.showSettings( 'tabLayout' ) && (
							tabControls
						) }
						{ ! this.showSettings( 'tabLayout' ) && (
							<PanelBody>
								<h2>{ __( 'Set Initial Open Tab' ) }</h2>
								<ButtonGroup aria-label={ __( 'Initial Open Tab' ) }>
									{ times( tabCount, n => (
										<Button
											key={ n + 1 }
											className="wwx-init-open-tab"
											isSmall
											isPrimary={ startTab === n + 1 }
											aria-pressed={ startTab === n + 1 }
											onClick={ () => setAttributes( { startTab: n + 1 } ) }
										>
											{ __( 'Tab' ) + ' ' + ( n + 1 ) }
										</Button>
									) ) }
								</ButtonGroup>
							</PanelBody>
						) }

						{ this.showSettings( 'titleAnchor' ) && (
							<PanelBody
								title={ __( 'Tab Anchor Settings' ) }
								initialOpen={ false }
							>
								{ times( tabCount, n => renderAnchorSettings( n ) ) }
							</PanelBody>
						) }
						{ this.showSettings( 'structure' ) && (
							<PanelBody
								title={ __( 'Structure Settings' ) }
								initialOpen={ false }
							>
								<RangeControl
									label={ __( 'Content Minimium Height' ) }
									value={ minHeight }
									onChange={ ( value ) => {
										setAttributes( {
											minHeight: value,
										} );
									} }
									min={ 0 }
									max={ 1000 }
								/>
							</PanelBody>
						) }
					</InspectorControls>
				) }
				<div className={ classes } >
					{ this.state.showPreset && (
						<div className="wwx-select-starter-style-tabs">
							<div className="wwx-select-starter-style-tabs-title">
								{ __( 'Select Initial Style' ) }
							</div>
							<ButtonGroup className="wwx-init-tabs-btn-group" aria-label={ __( 'Initial Style' ) }>
								{ map( startlayoutOptions, ( { name, key, icon } ) => (
									<Button
										key={ key }
										className="wwx-inital-tabs-style-btn"
										isSmall
										onClick={ () => {
											setInitalLayout( key );
											this.setState( { showPreset: false } );
										} }
									>
										{ icon }
									</Button>
								) ) }
							</ButtonGroup>
						</div>
					) }
					{ ! this.state.showPreset && (
						<div className="wwx-tabs-wrap">
							<ul className={ `wwx-tabs-title-list` }>
								{ renderPreviewArray }
								<li>
									<div className="kb-add-new-tab-contain">
										<Button
											className="wwx-tab-add"
											onClick={ () => {
												const newBlock = createBlock( 'wwx/tab', { id: tabCount + 1 } );
												setAttributes( { tabCount: tabCount + 1 } );
												this.props.insertTab( newBlock );
												//wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, clientId );
												const newtabs = titles;
												newtabs.push( {
													text: sprintf( __( 'Tab %d' ), tabCount + 1 ),
												} );
												setAttributes( { titles: newtabs } );

											} }
										>
											<Dashicon icon="plus" />
											{ __( 'Add Tab' ) }
										</Button>
									</div>
								</li>
							</ul>

							<div className="wwx-tabs-content-wrap" style={ {
								minHeight: minHeight + 'px',
							} }>
								<InnerBlocks
									template={ getPanesTemplate( tabCount ) }
									templateLock={ false }
									allowedBlocks={ ALLOWED_BLOCKS } />
							</div>
						</div>
					) }
				</div>
			</Fragment>
		);
	}
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			getBlock,
			getBlockOrder,
		} = select( 'core/block-editor' );
		const block = getBlock( clientId );
		return {
			tabsBlock: block,
			realTabsCount: block.innerBlocks.length,
			tabsInner: getBlockOrder( clientId ),
		};
	} ),
	withDispatch( ( dispatch, { clientId }, { select } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' );
		const {
			moveBlockToPosition,
			removeBlock,
			updateBlockAttributes,
			insertBlock,
		} = dispatch( 'core/block-editor' );
		const block = getBlock( clientId );
		return {
			resetOrder() {
				times( block.innerBlocks.length, n => {
					updateBlockAttributes( block.innerBlocks[ n ].clientId, {
						id: n + 1,
					} );
				} );
			},
			moveTab( tabId, newIndex ) {
				moveBlockToPosition( tabId, clientId, clientId, parseInt( newIndex ) );
			},
			insertTab( newBlock ) {
				insertBlock( newBlock, parseInt( block.innerBlocks.length ), clientId );
			},
			removeTab( tabId ) {
				removeBlock( tabId );
			},
		};
	} ),
] )( WwxTabs );
