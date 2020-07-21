<?php

add_integration_function('integrate_buffer', 'buffer_transformations', false);
add_integration_function('integrate_messageindex_buttons', 'set_active_notify_item', false);
add_integration_function('integrate_display_buttons', 'set_active_notify_item', false);
add_integration_function('integrate_prepare_display_context', 'add_like_post_to_quickbuttons', false);
add_integration_function('integrate_recent_RecentPosts', 'load_recent_posts_avatars', false);

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
 * Edits HTML code using the integrate_buffer hook
 *
 * @param $buffer
 * @return mixed
 */
function buffer_transformations($buffer)
{
	return $buffer;
}

/**
 * Sets the active notification setting item value to active
 *
 * @param $buttons
 */
function set_active_notify_item(&$buttons)
{
	global $context;

	if (empty($buttons['notify']) || empty($buttons['notify']['sub_buttons']))
		return;

	$current_location = !empty($context['current_topic']) ? 'topic' : 'board';
	$notification_mode = !empty($context["{$current_location}_notification_mode"]) ? $context["{$current_location}_notification_mode"] : 0;

	foreach ($buttons['notify']['sub_buttons'] as $key => $notify_option)
	{
		if ($notify_option['text'] === "notify_{$current_location}_{$notification_mode}")
			$buttons['notify']['sub_buttons'][$key]['active'] = true;
	}
}

/**
 *
 */
function add_like_post_to_quickbuttons(&$output, &$message, $counter)
{
	global $context, $txt, $scripturl, $modSettings;

	if ($output['member']['id'] === $context['user']['id'])
		return;

	// Add the like button to the quickbuttons
	$output['quickbuttons'] = array_reverse($output['quickbuttons']);
	$output['quickbuttons']['like'] = [
		'label' => $txt['like'],
		'href' => $scripturl.'?action=likes;ltype=msg;sa=like;like='.$output['id'].';'.$context['session_var'].'='.$context['session_id'],
		'anchor_class' => 'msg_like',
		'icon' => !empty($output['likes']['you']) ? 'unlike' : 'like',
		'id' => 'msg_'.$output['id'].'_likes',
		'class' => 'smflikebutton',
		'show' => $context['can_like'] && !$output['is_ignored'] && !empty($modSettings['enable_likes'])
	];
	$output['quickbuttons'] = array_reverse($output['quickbuttons']);

	// Remove the error class from the report to moderator button
	$output['quickbuttons']['more']['report']['class'] = '';
}

/**
 *
 */
function load_recent_posts_avatars()
{
	global $context, $memberContext, $modSettings;

	$member_ids = array_map(function ($post) {
		return $post['poster']['id'];
	}, $context['posts']);

	loadMemberData($member_ids);

	foreach ($context['posts'] as $key => $post)
	{
		loadMemberContext($post['poster']['id']);

		$avatar = !empty($memberContext[$post['poster']['id']]) ? $memberContext[$post['poster']['id']]['avatar'] : array('image' => '<img class="avatar" src="'.$modSettings['avatar_url'] . '/default.png'.'" alt="avatar">');

		$context['posts'][$key]['poster']['avatar'] = $avatar;
	}
}
