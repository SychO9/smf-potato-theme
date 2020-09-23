<?php

namespace SychO;

class Base
{
	/**
	 *
	 */
	public static function setUp()
	{
		add_integration_function('integrate_buffer', self::class.'::addSychoAttribution', false);
		add_integration_function('integrate_messageindex_buttons', self::class.'::setActiveNotifyItem', false);
		add_integration_function('integrate_display_buttons', self::class.'::setActiveNotifyItem', false);
		add_integration_function('integrate_prepare_display_context', self::class.'::addLikePostToQuickbuttons', false);
		add_integration_function('integrate_recent_RecentPosts', self::class.'::loadRecentPostsAvatars', false);
		add_integration_function('integrate_menu_buttons', self::class.'::addThemeSettingsLinkMenuItem', false);
	}

	/**
	 * Edits HTML code using the integrate_buffer hook
	 *
	 * @param $buffer
	 * @return mixed
	 */
	public static function addSychoAttribution($buffer)
	{
		global $txt;

		$attribution = str_replace('%icon%', icon('fas fa-heart'), str_replace('%author%', $txt['sycho_author'], $txt['potato_attribution']));

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
	 * @param $buttons
	 */
	public static function addThemeSettingsLinkMenuItem(&$buttons)
	{
		global $txt, $scripturl, $settings;

		$buttons['admin']['sub_buttons']['current_theme'] = array(
			'title' => $txt['potato_theme_settings'],
			'href' => $scripturl . '?action=admin;area=theme;sa=list;th=' . $settings['theme_id'],
			'show' => allowedTo('admin_forum'),
		);
	}
}
