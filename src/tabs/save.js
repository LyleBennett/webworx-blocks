/**
 * BLOCK: Kadence Tabs
 */
import classnames from 'classnames';
import times from 'lodash/times';

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	RichText,
} = wp.blockEditor;
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;

class WwxKadenceTabsSave extends Component {
	stripStringRender( string ) {
		return string.toLowerCase().replace( /[^0-9a-z-]/g, '' );
	}
	render() {
		const { attributes: { tabCount, blockAlignment, currentTab, mobileLayout, layout, tabletLayout, uniqueID, titles, tabAlignment, startTab, } } = this.props;
		const layoutClass = ( ! layout ? 'tabs' : layout );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const accordionClass = ( ( mobileLayout && 'accordion' === mobileLayout ) || ( tabletLayout && 'accordion' === tabletLayout ) ? 'wwx-create-accordion' : '' );
		const classId = ( ! uniqueID ? 'notset' : uniqueID );
		const classes = classnames( `align${ blockAlignment }` );
		const activeTab = ( startTab ? startTab : currentTab );
		const innerClasses = classnames( `wwx-tabs-wrap wwx-tabs-id${ classId } wwx-tabs-has-${ tabCount }-tabs wwx-active-tab-${ activeTab } wwx-tabs-layout-${ layoutClass } wwx-tabs-tablet-layout-${ tabLayoutClass } wwx-tabs-mobile-layout-${ mobileLayoutClass } wwx-tab-alignment-${ tabAlignment } ${ accordionClass }` );
		const renderTitles = ( index ) => {
			const backupAnchor = `tab-${ ( titles[ index ] && titles[ index ].text ? this.stripStringRender( titles[ index ].text.toString() ) : this.stripStringRender( __( 'Tab' ) + ( 1 + index ) ) ) }`;
			return (
				<Fragment>
					<li id={ ( titles[ index ] && titles[ index ].anchor ? titles[ index ].anchor : backupAnchor ) } className={ `wwx-title-item wwx-title-item-${ 1 + index } wwx-tab-title-${ ( 1 + index === activeTab ? 'active' : 'inactive' ) }` }>
						<a href={ `#${ ( titles[ index ] && titles[ index ].anchor ? titles[ index ].anchor : backupAnchor ) }` } data-tab={ 1 + index } className={ `wwx-tab-title wwx-tab-title-${ 1 + index } ` } >
								<RichText.Content
									tagName="span"
									value={ ( titles[ index ] && titles[ index ].text ? titles[ index ].text : sprintf( __( 'Tab %d' ), ( 1 + index ) ) ) }
									className={ 'wwx-title-text' }
								/>
						</a>
					</li>
				</Fragment>
			);
		};
		return (
			<div className={ classes } >
				<div className={ innerClasses } style={``}>
					<ul className={ `wwx-tabs-title-list` }>
						{ times( tabCount, n => renderTitles( n ) ) }
					</ul>
					<div className="wwx-tabs-content-wrap">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	}
}
export default WwxKadenceTabsSave;
