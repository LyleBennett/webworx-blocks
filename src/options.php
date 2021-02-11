<?php
// create custom plugin settings menu
add_action('admin_menu', 'wwx_create_menu');

function wwx_create_menu() {

	//create new top-level menu
	add_options_page('Webworx Settings', 'Webworx Settings', 'administrator', 'wwx-settings-page', 'wwx_settings_page' );

	//call register settings function
	add_action( 'admin_init', 'register_wwx_settings' );
}


function register_wwx_settings() {
	//register our settings
	register_setting( 'wwx-settings-group', 'loader_html' );
	register_setting( 'wwx-settings-group', 'loader_css' );

}

function wwx_settings_page() {
?>
<div class="wrap">
<h1>Webworx Settings</h1>

<form method="post" action="options.php">
    <?php settings_fields( 'wwx-settings-group' ); ?>
    <?php do_settings_sections( 'wwx-settings-group' ); ?>
    <table class="form-table">
      <h2>Custom Loader</h2>
      <p>Examples: <a href="https://loading.io/css/" target="_blank">https://loading.io/css/</a> </p>
        <tr valign="top">
        <th scope="row">Loader HTML</th>
        <td><textarea type="textarea" name="loader_html" cols="100" rows="10" ><?php echo esc_attr( get_option('loader_html') ); ?></textarea></td>
        </tr>

        <tr valign="top">
        <th scope="row">Loader CSS</th>
        <td><textarea type="textarea" name="loader_css" cols="100" rows="10" ><?php echo esc_attr( get_option('loader_css') ); ?></textarea></td>
        </tr>

    </table>

    <?php submit_button(); ?>

</form>
</div>
<?php } ?>
