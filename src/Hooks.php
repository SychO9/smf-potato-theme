<?php

namespace SychO;

class Potato
{
	/**
	 *
	 */
	public static function setUp()
	{
		add_integration_function('integrate_pre_javascript_output', self::class.'::addJavascriptVars', false);
		add_integration_function('integrate_buffer', self::class.'::bufferTransformations', false);
		add_integration_function('integrate_messageindex_buttons', self::class.'::setActiveNotifyItem', false);
		add_integration_function('integrate_display_buttons', self::class.'::setActiveNotifyItem', false);
		add_integration_function('integrate_prepare_display_context', self::class.'::addLikePostToQuickbuttons', false);
		add_integration_function('integrate_recent_RecentPosts', self::class.'::loadRecentPostsAvatars', false);
		add_integration_function('integrate_load_profile_fields', self::class.'::addProfileCustomFields', false);
		add_integration_function('integrate_setup_profile_context', self::class.'::loadCustomFields', false);
	}

	/**
	 * Edits HTML code using the integrate_buffer hook
	 *
	 * @param $buffer
	 * @return mixed
	 */
	public static function bufferTransformations($buffer)
	{
		global $txt;

		$attribution = str_replace('%icon%', icon('fas fa-heart'), $txt['potato_attribution']);

		$buffer = preg_replace('/<li class="copyright">((?:(?!li).)+)<\/li>/ms', '<li class="copyright">$1<div>'.$attribution.'</div></li>', $buffer);

		return $buffer;
	}

	/**
	 * Sets the active notification setting item value to active
	 *
	 * @param $buttons
	 */
	public static function setActiveNotifyItem(&$buttons)
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
	 * @param $output
	 * @param $message
	 * @param $counter
	 */
	public static function addLikePostToQuickbuttons(&$output, &$message, $counter)
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
	public static function loadRecentPostsAvatars()
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

	/**
	 * @param $profile_fields
	 */
	public static function addProfileCustomFields(&$profile_fields)
	{
		global $txt, $options;

		$profile_fields['default_options[potato_profile_cover]'] = array(
			'type' => 'url',
			'permission' => 'profile_extra',
			'label' => $txt['potato_profile_cover'],
			'value' => !empty($options['potato_profile_cover']) ? $options['potato_profile_cover'] : '',
			'input_validate' => function($value) {
				$value = filter_var($value, FILTER_SANITIZE_URL);

				if (filter_var($value, FILTER_VALIDATE_URL) === false)
					return false;

				return true;
			},
		);

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

		if ($_REQUEST['area'] === 'forumprofile')
		{
			$fields[] = 'hr';
			$fields[] = 'default_options[potato_profile_cover]';
		}

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
}
