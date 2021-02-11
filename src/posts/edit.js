/**
 * External dependencies
 */
import { isUndefined, pickBy } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component, RawHTML, Fragment } = wp.element;
const {
	PanelBody,
	Placeholder,
	QueryControls,
	RangeControl,
	Spinner,
	ToggleControl,
	Toolbar,
	RadioControl,
	SelectControl,
} = wp.components;
const apiFetch = wp.apiFetch;
const { addQueryArgs } = wp.url;
const { __ } = wp.i18n;
const { dateI18n, format, __experimentalGetSettings } = wp.date;
const {
	InspectorControls,
	BlockControls,
} = wp.blockEditor;
const { withSelect, select, useSelect } = wp.data;

/**
 * Module Constants
 */
const CATEGORIES_LIST_QUERY = {
	per_page: -1,
};
const MAX_POSTS_COLUMNS = 6;

class LatestPostsTypesEdit extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			categoriesList: [],
			tagsList: [],
			typesList: [],
		};
	}

	componentDidMount() {
		this.isStillMounted = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/categories`, CATEGORIES_LIST_QUERY ),
		} ).then(
			( categoriesList ) => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList } );
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList: [] } );
				}
			}
		);

		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/tags`, CATEGORIES_LIST_QUERY ),
		} ).then(
			( tagsList ) => {
				if ( this.isStillMounted ) {
					this.setState( { tagsList } );
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { tagsList: [] } );
				}
			}
		);

		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/types`, CATEGORIES_LIST_QUERY ),
		} ).then(
			( typesList ) => {
				if ( this.isStillMounted ) {
					this.setState( { typesList } );
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { typesList: [] } );
				}
			}
		);


	}


	componentWillUnmount() {
		this.isStillMounted = false;
	}

	render() {
		const { attributes, setAttributes, latestPosts, latestFeaturedImages } = this.props;
		const { categoriesList, tagsList, typesList } = this.state;
		const { displayPostContentRadio, displayFeaturedImage, featuredImageSize, displayPostContent, displayPostDate, displayPostCategories, displayPostTags, postLayout, columns, postType, order, orderBy, categories, postsToShow, excerptLength } = attributes;

		const typesOut = [];
		Object.keys(typesList).map((oneKey,i)=>{

			if (typesList[oneKey].slug == "wp_area" ||
					typesList[oneKey].slug == "wp_block" ||
					typesList[oneKey].slug == "attachment") {
						return null;
			}

		 return (
				 typesOut.push({label: typesList[oneKey].name, value: typesList[oneKey].slug})
			 )

	 	})

		const settings = select( 'core/editor' ).getEditorSettings();


		const imgSizes = [];
		settings.imageSizes.map( ( size, i ) => {

				imgSizes.push({label:size.name, value:size.slug });

		});

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Post Content Settings' ) }>
					<ToggleControl
						label={ __( 'Post Featured Image' ) }
						checked={ displayFeaturedImage }
						onChange={ ( value ) => setAttributes( { displayFeaturedImage: value } ) }
					/>
					<ToggleControl
						label={ __( 'Post Content' ) }
						checked={ displayPostContent }
						onChange={ ( value ) => setAttributes( { displayPostContent: value } ) }
					/>
					{ displayPostContent &&
					<RadioControl
						label="Show:"
						selected={ displayPostContentRadio }
						options={ [
							{ label: 'Excerpt', value: 'excerpt' },
							{ label: 'Full Post', value: 'full_post' },
						] }
						onChange={ ( value ) => setAttributes( { displayPostContentRadio: value } ) }
					/>
					}
					{ displayPostContent && displayPostContentRadio === 'excerpt' &&
						<RangeControl
							label={ __( 'Max number of words in excerpt' ) }
							value={ excerptLength }
							onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
							min={ 5 }
							max={ 100 }
						/>
					}
				</PanelBody>

				{ displayFeaturedImage && (<PanelBody title={ __( 'Post Image Settings' ) }>
						<SelectControl
								label="Image Size"
								value={ featuredImageSize ? featuredImageSize : 'full'}
								options={ imgSizes }
								onChange={ ( value ) => { setAttributes( { featuredImageSize: value } ) } }
						/>
				</PanelBody>)}

				<PanelBody title={ __( 'Post Meta Settings' ) }>
					<ToggleControl
						label={ __( 'Display post date' ) }
						checked={ displayPostDate }
						onChange={ ( value ) => setAttributes( { displayPostDate: value } ) }
					/>
					<ToggleControl
						label={ __( 'Display post categories' ) }
						checked={ displayPostCategories }
						onChange={ ( value ) => setAttributes( { displayPostCategories: value } ) }
					/>
					<ToggleControl
						label={ __( 'Display post tags' ) }
						checked={ displayPostTags }
						onChange={ ( value ) => setAttributes( { displayPostTags: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Sorting and Filtering' ) }>

					<SelectControl
							label="Post Type"
							value={ postType }
							options={ typesOut }
							onChange={ ( value ) => { setAttributes( { postType: value } ) } }
					/>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						categoriesList={ categoriesList }
						selectedCategoryId={ categories }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
					{ postLayout === 'grid' &&
						<RangeControl
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 2 }
							max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, latestPosts.length ) }
							required
						/>
					}
				</PanelBody>
			</InspectorControls>
		);

		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder
						icon="admin-post"
						label={ __( 'Loading Posts' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ?
			latestPosts.slice( 0, postsToShow ) :
			latestPosts;

		const displayFeaturedImages = latestFeaturedImages.length > postsToShow ?
			latestFeaturedImages.slice( 0, postsToShow ) :
			latestFeaturedImages;

		const layoutControls = [
			{
				icon: 'list-view',
				title: __( 'List view' ),
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: postLayout === 'list',
			},
			{
				icon: 'grid-view',
				title: __( 'Grid view' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: postLayout === 'grid',
			},
		];

		const dateFormat = __experimentalGetSettings().formats.date;


		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<Toolbar controls={ layoutControls } />
				</BlockControls>
				<ul
					className={ classnames( this.props.className, {
						'wp-block-wwx-custom-posts__list': true,
						'is-grid': postLayout === 'grid',
						'has-dates': displayPostDate,
						[ `featured-image-${ featuredImageSize }` ]: displayFeaturedImage == true,
						[ `columns-${ columns }` ]: postLayout === 'grid',
					} ) }
				>
					{ displayPosts.map( ( post, i ) => {


						const postCategoryObjs = post.categories.map( (category, index) => { return categoriesList.find( ({ id }) => id === category ) } );
						const postTagsObjs = post.tags.map( (category, index) => { return tagsList.find( ({ id }) => id === category ) } );

						const titleTrimmed = post.title.rendered.trim();
						let excerpt = post.excerpt.rendered;
						if ( post.excerpt.raw === '' ) {
							excerpt = post.content.raw;
						}
						const excerptElement = document.createElement( 'div' );
						excerptElement.innerHTML = excerpt;
						excerpt = excerptElement.textContent || excerptElement.innerText || '';
						return (
							<li key={ i }>


							{ displayFeaturedImage && (
								displayFeaturedImages[i] ? <div class="wp-block-wwx-custom-posts__post-image"><img src={ displayFeaturedImages[i].source_url } /></div> : <span class='no-img'>(No Featured Image)</span>
							)}

								<a href={ post.link } className="wp-block-wwx-custom-posts__post-title" target="_blank" rel="noreferrer noopener">
									{ titleTrimmed ? (
										<RawHTML>
											{ titleTrimmed }
										</RawHTML>
									) :
										__( '(no title)' )
									}
								</a>

								{ displayPostCategories && post.categories &&
									<div className="wp-block-wwx-custom-posts__post-categories">
										{ postCategoryObjs.map( (cat, index) => { return <a href={cat.link} target="_blank" rel="noreferrer noopener">{cat.name}</a>} ) }
									</div>
								}

								{ displayPostTags && post.tags &&
									<div className="wp-block-wwx-custom-posts__post-tags">
										{ postTagsObjs.map( (tag, index) => { return <a href={tag.link} target="_blank" rel="noreferrer noopener">{tag.name}</a>} ) }
									</div>
								}


								{ displayPostDate && post.date_gmt &&
									<time dateTime={ format( 'c', post.date_gmt ) } className="wp-block-wwx-custom-posts__post-date">
										{ dateI18n( dateFormat, post.date_gmt ) }
									</time>
								}
								{ displayPostContent && displayPostContentRadio === 'excerpt' &&
								<div className="wp-block-wwx-custom-posts__post-excerpt">
									<RawHTML
										key="html"
									>
										{ excerptLength < excerpt.trim().split( ' ' ).length ?
											excerpt.trim().split( ' ', excerptLength ).join( ' ' ) + ' ... <a href=' + post.link + 'target="_blank" rel="noopener noreferrer">' + __( 'Read more' ) + '</a>' :
											excerpt.trim().split( ' ', excerptLength ).join( ' ' ) }
									</RawHTML>
								</div>
								}
								{ displayPostContent && displayPostContentRadio === 'full_post' &&
								<div className="wp-block-wwx-custom-posts__post-full-content">
									<RawHTML
										key="html"
									>
										{ post.content.raw.trim() }
									</RawHTML>
								</div>
								}
							</li>
						);
					} ) }
				</ul>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, postType, categories } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const latestPostsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );
	const postResults = getEntityRecords( 'postType', postType ? postType : 'post', latestPostsQuery );
	return {
		latestPosts: postResults,

		latestFeaturedImages: postResults ? postResults.map( ( post, i ) => {
			if (post.featured_media !== 0 && post ) {
				return( select( 'core' ).getMedia( post.featured_media ) )
			}
			return null
		}) : null

	};
} )( LatestPostsTypesEdit );
