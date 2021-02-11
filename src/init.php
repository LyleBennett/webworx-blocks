<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package WWX
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function wwx_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'wwx-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		is_admin() ? array( 'wp-editor' ) : null, // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'wwx-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'wwx-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'wwx/block-webworxenberg', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'wwx-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'wwx-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'wwx-block-editor-css',
		)
	);


	include_once 'posts-block.php';

}

// Hook: Block assets.
add_action( 'init', 'wwx_block_assets' );


// Hook: Front End Scripts
function wwx_scripts() {
	if (has_block("wwx/popup")) {
		wp_register_script('wwx-scripts', plugins_url( 'dist/assets/popup.js', dirname( __FILE__ )), array(), null, true );
		wp_enqueue_script('wwx-scripts');
		wp_localize_script( 'wwx-scripts', 'ajax', array(
	    'url' => admin_url( 'admin-ajax.php' )
		) );
		include 'loaderstyles.php';
		$css = get_option( 'loader_css', $cssdefault );
		if ($css != '') {
			wp_add_inline_style('wwx-style-css', $css);
		}else {
			wp_add_inline_style('wwx-style-css', $cssdefault);
		}
	}

//	if (has_block('wwx/contentcarousel')) {
		wp_register_script('wwx-carousel', plugins_url( 'dist/assets/slick/slick.min.js', dirname( __FILE__ )), array(), null, true );
		wp_enqueue_script('wwx-carousel');
		wp_register_script('wwx-carousel-load', plugins_url( 'dist/assets/slick/slick-load.js', dirname( __FILE__ )), array(), null, true );
		wp_enqueue_script('wwx-carousel-load');
		//wp_enqueue_style( 'wwx-carousel-style', plugins_url( 'dist/assets/slick/slick.css', dirname( __FILE__ )) );
		//wp_enqueue_style( 'wwx-carousel-theme', plugins_url( 'dist/assets/slick/slick-theme.css', dirname( __FILE__ )) );
//	}

	//if (has_block('wwx/tabs')) {
		wp_register_script('wwx-tabs', plugins_url( 'dist/assets/wwx-tabs.js', dirname( __FILE__ )), array(), null, true );
		wp_enqueue_script('wwx-tabs');
		//wp_enqueue_style( 'wwx-carousel-style', plugins_url( 'dist/assets/slick/slick.css', dirname( __FILE__ )) );
		//wp_enqueue_style( 'wwx-carousel-theme', plugins_url( 'dist/assets/slick/slick-theme.css', dirname( __FILE__ )) );
	//}

}
add_action( 'wp_enqueue_scripts', 'wwx_scripts' );


// Hook:footer - popup div in footer
function footerpop() {
	$loader = get_option( 'loader_html', '<div class="loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>' );
if ($loader == '') {
	$loader = '<div class="loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
}

echo '<div id="popupwrapperoverlay" style="display:none;"><div id="popupwrapper"></div><div id="popuploader">'.$loader.'</div>';

}
add_action( 'wp_footer', 'footerpop' );

//ajax popup call
add_action('wp_ajax_get_page_content_by_id','get_page_content_by_id');
add_action('wp_ajax_nopriv_get_page_content_by_id','get_page_content_by_id');
function get_page_content_by_id(){
	if(!empty($_POST['page'])){
		$id = $_POST['page'];
		$post = get_post($id);
		$title = get_the_title( $post );
		$content = apply_filters('the_content', $post->post_content);
		echo "<div class='content'><h3>".$title."</h3>".$content."</div>";
		exit;
	}
}
