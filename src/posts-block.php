<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

register_block_type(
	'wwx/custom-posts',
	array(
		'attributes'      => array(
			'align'                   => array(
				'type' => 'string',
				'enum' => array( 'left', 'center', 'right', 'wide', 'full' ),
			),
			'className'               => array(
				'type' => 'string',
			),
			'postType'              => array(
				'type' => 'string',
			),
			'categories'              => array(
				'type' => 'string',
			),
			'postsToShow'             => array(
				'type'    => 'number',
				'default' => 5,
			),
			'displayFeaturedImage'      => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'featuredImageSize'      => array(
				'type'    => 'string',
				'default' => 'full',
			),
			'displayPostContent'      => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'displayPostContentRadio' => array(
				'type'    => 'string',
				'default' => 'excerpt',
			),
			'excerptLength'           => array(
				'type'    => 'number',
				'default' => 55,
			),
			'displayPostDate'         => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'displayPostCategories'         => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'displayPostTags'         => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'postLayout'              => array(
				'type'    => 'string',
				'default' => 'list',
			),
			'columns'                 => array(
				'type'    => 'number',
				'default' => 3,
			),
			'order'                   => array(
				'type'    => 'string',
				'default' => 'desc',
			),
			'orderBy'                 => array(
				'type'    => 'string',
				'default' => 'date',
			),
		),
		'editor_script' => 'wwx-block-js',
		'render_callback' => 'render_block_wwx_custom_posts',
	)
);

function render_block_wwx_custom_posts( $attributes ) {
	$args = array(
		'posts_per_page'   => $attributes['postsToShow'],
		'post_status'      => 'publish',
		'order'            => $attributes['order'],
		'orderby'          => $attributes['orderBy'],
		'suppress_filters' => false,
	);

	if ( isset( $attributes['postType'] ) ) {
		$args['post_type'] = $attributes['postType'];
	}

	if ( isset( $attributes['categories'] ) ) {
		$args['category'] = $attributes['categories'];
	}

	$recent_posts = get_posts( $args );

	$list_items_markup = '';

	$excerpt_length = $attributes['excerptLength'];

	foreach ( $recent_posts as $post ) {

		//	echo "<pre>",print_r($post,1),"</pre>";
		$list_items_markup .= '<li>';

		$imgSize = 'full';
		if (isset($attributes['featuredImageSize'])) {
			$imgSize = $attributes['featuredImageSize'];
		}

		$featimg = '';
		if ( isset( $attributes['displayFeaturedImage'] ) && $attributes['displayFeaturedImage'] ) {
			$featimg = sprintf(
				'<div class="wp-block-wwx-custom-posts__post-image">%1$s</div>',
				 get_the_post_thumbnail( $post->ID, $imgSize )
				 //https://developer.wordpress.org/reference/functions/get_the_post_thumbnail/
			);
		}

		$list_items_markup .= sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( get_permalink( $post ) ),
			$featimg
		);

		$title = get_the_title( $post );
		if ( ! $title ) {
			$title = __( '(no title)' );
		}
		$list_items_markup .= sprintf(
			'<a href="%1$s" class="wp-block-wwx-custom-posts__post-title">%2$s</a>',
			esc_url( get_permalink( $post ) ),
			$title
		);

		if ( isset( $attributes['displayPostDate'] ) && $attributes['displayPostDate'] ) {
			$list_items_markup .= sprintf(
				'<time datetime="%1$s" class="wp-block-wwx-custom-posts__post-date">%2$s</time>',
				esc_attr( get_the_date( 'c', $post ) ),
				esc_html( get_the_date( '', $post ) )
			);
		}

		if ( isset( $attributes['displayPostCategories'] ) && $attributes['displayPostCategories'] ) {

			$post_categories = get_the_term_list( $post->ID, 'category', '<div class="wp-block-wwx-custom-posts__post-categories">', ' ', '</div>' );

			if ( ! empty( $post_categories ) && ! is_wp_error( $post_categories ) ) {

					$list_items_markup .= $post_categories;

			}

		}

		if ( isset( $attributes['displayPostTags'] ) && $attributes['displayPostTags'] ) {

			$post_tags = get_the_term_list( $post->ID, 'post_tag', '<div class="wp-block-wwx-custom-posts__post-tags">', ' ', '</div>' );

			if ( ! empty( $post_tags ) && ! is_wp_error( $post_tags ) ) {

					$list_items_markup .= $post_tags;

			}

		}

		if ( isset( $attributes['displayPostContent'] ) && $attributes['displayPostContent']
			&& isset( $attributes['displayPostContentRadio'] ) && 'excerpt' === $attributes['displayPostContentRadio'] ) {
			$post_excerpt = $post->post_excerpt;
			if ( ! ( $post_excerpt ) ) {
				$post_excerpt = $post->post_content;
			}
			$trimmed_excerpt = esc_html( wp_trim_words( $post_excerpt, $excerpt_length, ' &hellip; ' ) );

			$list_items_markup .= sprintf(
				'<div class="wp-block-wwx-custom-posts__post-excerpt">%1$s',
				$trimmed_excerpt
			);

			if ( strpos( $trimmed_excerpt, ' &hellip; ' ) !== false ) {
				$list_items_markup .= sprintf(
					'<a href="%1$s">%2$s</a></div>',
					esc_url( get_permalink( $post ) ),
					__( 'Read more' )
				);
			} else {
				$list_items_markup .= sprintf(
					'</div>'
				);
			}
		}

		if ( isset( $attributes['displayPostContent'] ) && $attributes['displayPostContent']
			&& isset( $attributes['displayPostContentRadio'] ) && 'full_post' === $attributes['displayPostContentRadio'] ) {
			$list_items_markup .= sprintf(
				'<div class="wp-block-wwx-custom-posts__post-full-content">%1$s</div>',
				wp_kses_post( html_entity_decode( $post->post_content, ENT_QUOTES, get_option( 'blog_charset' ) ) )
			);
		}

		$list_items_markup .= "</li>\n";
	}

	$class = 'wp-block-wwx-custom-posts wp-block-wwx-custom-posts__list';
	if ( isset( $attributes['align'] ) ) {
		$class .= ' align' . $attributes['align'];
	}

	if ( isset( $attributes['postLayout'] ) && 'grid' === $attributes['postLayout'] ) {
		$class .= ' is-grid';
	}

	if ( isset( $attributes['columns'] ) && 'grid' === $attributes['postLayout'] ) {
		$class .= ' columns-' . $attributes['columns'];
	}

	if ( isset( $attributes['displayPostDate'] ) && $attributes['displayPostDate'] ) {
		$class .= ' has-dates';
	}

	if ( isset( $attributes['className'] ) ) {
		$class .= ' ' . $attributes['className'];
	}

	return sprintf(
		'<ul class="%1$s">%2$s</ul>',
		esc_attr( $class ),
		$list_items_markup
	);
}
