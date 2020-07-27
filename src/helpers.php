<?php

require_once 'Hooks.php';

\SychO\Potato::setUp();

/**
 * @param string $name
 * @return string
 */
function icon($name)
{
	return "<i class='icon $name'></i>";
}

/**
 * Transforms the normal buttons array of a topic
 */
function transform_normal_buttons(&$normal_buttons)
{
	global $context;

	if (empty($context['mod_buttons']))
		return;

	$normal_buttons['separator'] = 'separator';
	$normal_buttons += $context['mod_buttons'];
}

/**
 * Transforms the buttonlist strip to a simpler form
 *
 * @param array $button_strip
 * @param array $strip_options
 * @return array
 */
function transform_buttonlist($button_strip, $strip_options = array())
{
	if (empty($button_strip))
		return $button_strip;

	inject_buttonlist_icons($button_strip);

	if (empty($strip_options['merge']))
		return $button_strip;

	$first_item_key = array_keys($button_strip)[0];

	foreach ($button_strip as $key => $button)
	{
		if (!empty($button['sub_buttons']) || $key === $first_item_key)
			continue;

		$button_strip[$first_item_key]['sub_buttons'][] = $button;
		unset($button_strip[$key]);
	}

	if (isset($strip_options['identifier']) && $strip_options['identifier'] === 'bottom_topic_normal_buttons')
	{
		$button_strip = array_reverse($button_strip);
		$button_strip[] = array(
			'li_custom' => 'id="moderationbuttons_strip"',
			'content' => '',
		);
		$button_strip = array_reverse($button_strip);
	}

	return $button_strip;
}

/**
 * @param $button_strip
 */
function inject_buttonlist_icons(&$button_strip)
{
	$icons = array(
		'reply' => 'fas fa-reply',
		'add_poll' => 'fas fa-poll',
		'notify' => 'fas fa-bell',
		'print' => 'fas fa-print',
		'mark_unread' => 'fas fa-eye-slash',
		'move' => 'fas fa-arrows-alt',
		'delete' => 'fas fa-trash',
		'lock' => 'fas fa-lock',
		'unlock' => 'fas fa-unlock',
		'sticky' => 'fas fa-thumbtack',
		'merge' => 'fas fa-link',
		'post_poll' => 'fas fa-poll',
		'new_topic' => 'fas fa-plus',
		'markread' => 'fas fa-check',
		'calendar' => 'fas fa-calendar-alt',
	);

	foreach ($icons as $button_key => $icon)
	{
		if (!isset($button_strip[$button_key]))
			continue;

		$button_strip[$button_key]['icon'] = $icon;
	}
}

/**
 * Debugging function
 * @param $var
 */
function dd($var)
{
	echo '<pre>';
	print_r($var);
	die('</pre>');
}

/**
 *
 */
function organize_page_index()
{
	global $context;

	if (!isset($context['page_index']))
		return;

	if (substr_count($context['page_index'], 'button') <= 1)
	{
		$context['page_index'] = '';
		return;
	}

	if (strpos($context['page_index'], 'pagelinks') === false)
		$context['page_index'] = "<div class='pagelinks'>{$context['page_index']}</div>";
}

/**
 * Converts HEX color to HSL format
 *
 * @param $hex
 * @return float[]
 */
function potato_hex_to_hsl($hex)
{
	$hex = str_split(ltrim($hex, '#'), 2);

	$rgb = array_map(function($part) {
		return hexdec($part) / 255;
	}, $hex);

	$min = min($rgb);
	$max = max($rgb);

	// Initialize all to 0
	$h = $s = $l = 0;

	// calculate the luminace value by adding the max and min values and divide by 2
	$l = ($min + $max) / 2;

	// If $max and $min are unequal, we need to calculate the saturation and hue
	if ($max !== $min)
	{
		// Saturation
		if ($l < 0.5)
			$s = ($max - $min) / ($max + $min);
		else
			$s = ($max - $min) / (2 - $max - $min);

		// Hue
		switch ($max)
		{
			case $rgb[0]:
				$h = ($rgb[1] - $rgb[2]) / ($max - $min);
				break;
			case $rgb[1]:
				$h = 2 + ($rgb[2] - $rgb[0]) / ($max - $min);
				break;
			case $rgb[2]:
				$h = 4 + ($rgb[0] - $rgb[1]) / ($max - $min);
		}

		// Convert the Hue to degrees
		$h *= 60;

		if ($h < 0)
			$h += 360;
	}

	return array($h, $s, $l);
}