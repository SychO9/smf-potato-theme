<?php

/**
 * @package Potato Theme
 * @author Sami "SychO" Mazouz
 * @license MIT
 */

namespace SychO;

class Potato
{
	/**
	 * @var string
	 */
	const VERSION = '0.1.1';

	/**
	 *
	 */
	public static function setUp()
	{
		Base::setUp();

		add_integration_function('integrate_load_theme', self::class.'::addCustomColorVars', false);
		add_integration_function('integrate_pre_javascript_output', self::class.'::addJavascriptVars', false);
		add_integration_function('integrate_load_profile_fields', self::class.'::addProfileCustomFields', false);
		add_integration_function('integrate_setup_profile_context', self::class.'::loadCustomFields', false);
	}

	/**
	 * @param $profile_fields
	 */
	public static function addProfileCustomFields(&$profile_fields)
	{
		global $context, $txt, $options;

		$profile_fields['default_options[potato_dark_mode]'] = array(
			'type' => 'check',
			'label' => $txt['potato_dark_mode'],
			'value' => !empty($options['potato_dark_mode']),
		);
	}

	/**
	 * @param $fields
	 */
	public static function loadCustomFields(&$fields)
	{
		if (empty($_REQUEST['area']))
			return;

		if ($_REQUEST['area'] === 'theme')
		{
			$fields[] = 'hr';
			$fields[] = 'default_options[potato_dark_mode]';
		}
	}

	/**
	 * @param $profile_items
	 */
	public static function addDarkModeToggler(&$profile_items)
	{
		global $context, $txt, $options;

		if (!$context['user']['is_logged'])
			return;

		loadLanguage('ThemeStrings');

		$mode = array(
			'icon' => !empty($options['potato_dark_mode']) ? 'fas fa-sun' : 'fas fa-moon',
			'label' => !empty($options['potato_dark_mode']) ? $txt['potato_light_mode'] : $txt['potato_dark_mode'],
		);

		$profile_items = array_reverse($profile_items);
		$profile_items[] = 'separator';
		$profile_items[] = array(
			'icon' => icon($mode['icon']),
			'menu' => 'edit_profile',
			'area' => 'theme',
			'title' => $mode['label'],
			'custom' => 'onclick="return toggleDarkMode(this);"',
		);
		$profile_items = array_reverse($profile_items);
	}

	/**
	 *
	 */
	public static function addJavascriptVars()
	{
		global $context, $txt;

		if (!$context['user']['is_logged'])
			return;

		$token_name = "profile-th{$context['user']['id']}";

		if (empty($context["{$token_name}_token_var"]))
			createToken($token_name, 'post');

		addJavaScriptVar('potato_dark_mode_toggle_var', '"'.$context["{$token_name}_token_var"].'"');
		addJavaScriptVar('potato_dark_mode_toggle', '"'.$context["{$token_name}_token"].'"');
	}

	public static function addCustomColorVars()
	{
		global $settings;

		$color_key = 'potato_color_';
		$colors = array();

		foreach ($settings as $key => $setting)
		{
			if (substr($key, 0, strlen($color_key)) !== $color_key || empty($setting))
				continue;

			$color_name = str_replace(
				array('potato_', '_'),
				array('', '-'),
				$key
			);

			$hsl = sycho_hex_to_hsl($setting);
			$colors["--$color_name-h"] = $hsl[0] . 'deg';
			$colors["--$color_name-s"] = $hsl[1] * 100 . '%';
			$colors["--$color_name-l"] = $hsl[2] * 100 . '%';
			$colors["--$color_name"] = "hsl(var(--$color_name-h), var(--$color_name-s), var(--$color_name-l))";
		}

		$css = '';

		foreach ($colors as $color => $value)
			$css .= "$color: $value;\n";

		addInlineCss(":root {{$css}}");
	}
}
