<?php
/**
 * Simple Machines Forum (SMF)
 *
 * @package SMF
 * @author Simple Machines https://www.simplemachines.org
 * @copyright 2020 Simple Machines and individual contributors
 * @license https://www.simplemachines.org/about/smf/license.php BSD
 *
 * @version 2.1 RC3
 */

/**
 * Template for showing recent posts
 */
function template_recent()
{
	global $context, $txt, $scripturl;

	echo '
	<div id="recent" class="main_section">
		<div class="cat_bar">
			<h3 class="catbg">
				<span class="xx"></span>', $txt['recent_posts'], '
			</h3>
		</div>
		<div class="pagesection">', $context['page_index'], '</div>';

	if (empty($context['posts']))
		echo '
		<div class="windowbg">', $txt['no_messages'], '</div>';
	else
	{
		echo '
		<div class="topic-item-container">';

		foreach ($context['posts'] as $post) {
			echo '
		<div class="topic-item topic-item--extended ', trim(str_replace('windowbg', '', $post['css_class'])), '">
			<div class="topic-item-poster-avatar">', $post['poster']['avatar']['image'], '</div>
			<div class="topic-item-content">
				<div class="topic-item-title">', $post['link'], '</div>
				<div class="topic-item-details">
					<div class="topic-item-board">', icon('fas fa-user'), ' ', $post['poster']['link'], '</div>
					<div class="topic-item-board">', icon('fas fa-folder'), ' ', $post['board']['link'], '</div>
					<div class="topic-item-board">', icon('far fa-clock'), ' ', $post['time'], '</div>
				</div>
				<div class="topic-item-body">', $post['message'], '</div>
			</div>
			', template_quickbuttons($post['quickbuttons'], 'recent');

			echo '
		</div><!-- $post[css_class] -->';
		}

		echo '
		</div>';
	}

	echo '
		<div class="pagesection">', $context['page_index'], '</div>
	</div><!-- #recent -->';
}

/**
 * Template for showing unread posts
 */
function template_unread()
{
	global $context, $settings, $txt, $scripturl, $modSettings;

	echo '
	<div id="recent" class="main_content">';

	if ($context['showCheckboxes'])
		echo '
		<form action="', $scripturl, '?action=quickmod" method="post" accept-charset="', $context['character_set'], '" name="quickModForm" id="quickModForm">
			<input type="hidden" name="', $context['session_var'], '" value="', $context['session_id'], '">
			<input type="hidden" name="qaction" value="markread">
			<input type="hidden" name="redirect_url" value="action=unread', (!empty($context['showing_all_topics']) ? ';all' : ''), $context['querystring_board_limits'], '">';

	if (!empty($context['topics']))
	{
		echo '
			<div class="pagesection">
				', $context['menu_separator'], '
				<div class="pagelinks floatleft">
					<a href="#bot" class="button">', $txt['go_down'], '</a>
					', $context['page_index'], '
				</div>
				', !empty($context['recent_buttons']) ? template_button_strip($context['recent_buttons'], 'right') : '', '
			</div>';

		echo '
			<div id="unread" class="topic-list-area">
				<div id="topic_header" class="title_bar topic-header">
					<div class="board_icon"></div>
					<div class="info">
						<a href="', $scripturl, '?action=unread', $context['showing_all_topics'] ? ';all' : '', $context['querystring_board_limits'], ';sort=subject', $context['sort_by'] == 'subject' && $context['sort_direction'] == 'up' ? ';desc' : '', '">', $txt['subject'], $context['sort_by'] == 'subject' ? ' <span class="main_icons sort_' . $context['sort_direction'] . '"></span>' : '', '</a>
					</div>
					<div class="board_stats centertext">
						<a href="', $scripturl, '?action=unread', $context['showing_all_topics'] ? ';all' : '', $context['querystring_board_limits'], ';sort=replies', $context['sort_by'] == 'replies' && $context['sort_direction'] == 'up' ? ';desc' : '', '">', $txt['replies'], $context['sort_by'] == 'replies' ? ' <span class="main_icons sort_' . $context['sort_direction'] . '"></span>' : '', '</a>
					</div>
					<div class="lastpost">
						<a href="', $scripturl, '?action=unread', $context['showing_all_topics'] ? ';all' : '', $context['querystring_board_limits'], ';sort=last_post', $context['sort_by'] == 'last_post' && $context['sort_direction'] == 'up' ? ';desc' : '', '">', $txt['last_post'], $context['sort_by'] == 'last_post' ? ' <span class="main_icons sort_' . $context['sort_direction'] . '"></span>' : '', '</a>
					</div>';

		// Show a "select all" box for quick moderation?
		if ($context['showCheckboxes'])
			echo '
					<div class="moderation">
						<input type="checkbox" onclick="invertAll(this, this.form, \'topics[]\');">
					</div>';

		echo '
				</div><!-- #topic_header -->
				<div id="topic_container" class="topic-item-container">';

		foreach ($context['topics'] as $topic)
		{
			echo '
					<div class="', trim(str_replace('windowbg', '', $topic['css_class'])), ' topic-item">
						<div class="board_icon">
							<img src="', $topic['first_post']['icon_url'], '" alt="">
							', $topic['is_posted_in'] ? '<img class="posted" src="' . $settings['images_url'] . '/icons/profile_sm.png" alt="">' : '', '
						</div>
						<div class="info">';

			// Now we handle the icons
			echo '
							<div class="icons floatright">';

			if ($topic['is_locked'])
				echo '
								<span class="main_icons lock badge"></span>';

			if ($topic['is_sticky'])
				echo '
								<span class="main_icons sticky badge"></span>';

			if ($topic['is_poll'])
				echo '
								<span class="main_icons poll badge"></span>';

			echo '
							</div>';

			echo '
							<div class="recent_title">
								<a href="', $topic['new_href'], '" id="newicon', $topic['first_post']['id'], '" class="new_posts">' . $txt['new'] . '</a>
								', $topic['is_sticky'] ? '<strong>' : '', '<span class="preview" title="', $topic[(empty($modSettings['message_index_preview_first']) ? 'last_post' : 'first_post')]['preview'], '"><span id="msg_' . $topic['first_post']['id'] . '">', $topic['first_post']['link'], '</span></span>', $topic['is_sticky'] ? '</strong>' : '', '
							</div>
							<div class="item-details">
								<span>', $topic['first_post']['started_by'], '</span>
								<span class="inline-lastpost">
									<a href="', $topic['last_post']['href'], '">', icon('fas fa-sign-out-alt'), '</a>
								</span>
								', !empty($topic['pages']) ? '<span id="pages' . $topic['first_post']['id'] . '" class="topic_pages">' . $topic['pages'] . '</span>' : '', '
							</div>
						</div><!-- .info -->
						<div class="board_stats centertext">
							<p>
								', $topic['replies'], ' ', $txt['replies'], '
								<br>
								', $topic['views'], ' ', $txt['views'], '
							</p>
						</div>
						<div class="lastpost">';

			if (!empty($topic['last_post']['id']))
				echo '
							<div class="topic-item">
								<div class="topic-item-poster-avatar">', $topic['last_post']['member']['avatar']['image'], '</div>
								<div class="topic-item-content">
									<div class="topic-item-title">', $topic['last_post']['link'], '</div>
									<div class="topic-item-details">
										<div class="topic-item-poster">', $topic['last_post']['member']['link'], '</div>
										<div class="topic-item-time">', icon('far fa-clock'), ' ', timeformat($topic['last_post']['timestamp']), '</div>
									</div>
								</div>
							</div>';

			echo '

						</div>';

			if ($context['showCheckboxes'])
				echo '
						<div class="moderation">
							<input type="checkbox" name="topics[]" value="', $topic['id'], '">
						</div>';

			echo '
					</div><!-- $topic[css_class] -->';
		}

		if (empty($context['topics']))
			echo '
					<div style="display: none;"></div>';

		echo '
				</div><!-- #topic_container -->
			</div><!-- #unread -->';

		echo '
			<div class="pagesection">
				', !empty($context['recent_buttons']) ? template_button_strip($context['recent_buttons'], 'right') : '', '
				', $context['menu_separator'], '
				<div class="pagelinks">
					<a href="#recent" class="button">', $txt['go_up'], '</a>
					', $context['page_index'], '
				</div>
			</div>';
	}
	else
		echo '
			<div class="databox databox--neutral databox--full">
				<div class="databox-icon">', icon('fas fa-exclamation-circle'), '</div>
				<div class="databox-content">
					<div class="databox-text">', $context['showing_all_topics'] ? $txt['topic_alert_none'] : sprintf($txt['unread_topics_visit_none'], $scripturl), '</div>
				</div>
			</div>';

	if ($context['showCheckboxes'])
		echo '
		</form>';

	echo '
	</div><!-- #recent -->';

	if (empty($context['no_topic_listing']))
		template_topic_legend();
}

/**
 * Template for showing unread replies (eg new replies to topics you've posted in)
 */
function template_replies()
{
	global $context, $settings, $txt, $scripturl, $modSettings;

	echo '
	<div id="recent">';

	if ($context['showCheckboxes'])
		echo '
		<form action="', $scripturl, '?action=quickmod" method="post" accept-charset="', $context['character_set'], '" name="quickModForm" id="quickModForm">
			<input type="hidden" name="', $context['session_var'], '" value="', $context['session_id'], '">
			<input type="hidden" name="qaction" value="markread">
			<input type="hidden" name="redirect_url" value="action=unreadreplies', (!empty($context['showing_all_topics']) ? ';all' : ''), $context['querystring_board_limits'], '">';

	if (!empty($context['topics']))
	{
		echo '
			<div class="pagesection">
				', $context['menu_separator'], '
				<div class="pagelinks floatleft">
					<a href="#bot" class="button">', $txt['go_down'], '</a>
					', $context['page_index'], '
				</div>
				', !empty($context['recent_buttons']) ? template_button_strip($context['recent_buttons'], 'right') : '', '
			</div>';

		echo '
			<div id="unreadreplies" class="topic-list-area">
				<div id="topic_header" class="title_bar topic-header">
					<div class="board_icon"></div>
					<div class="info">
						<a href="', $scripturl, '?action=unread', $context['showing_all_topics'] ? ';all' : '', $context['querystring_board_limits'], ';sort=subject', $context['sort_by'] == 'subject' && $context['sort_direction'] == 'up' ? ';desc' : '', '">', $txt['subject'], $context['sort_by'] == 'subject' ? ' <span class="main_icons sort_' . $context['sort_direction'] . '"></span>' : '', '</a>
					</div>
					<div class="board_stats centertext">
						<a href="', $scripturl, '?action=unread', $context['showing_all_topics'] ? ';all' : '', $context['querystring_board_limits'], ';sort=replies', $context['sort_by'] == 'replies' && $context['sort_direction'] == 'up' ? ';desc' : '', '">', $txt['replies'], $context['sort_by'] == 'replies' ? ' <span class="main_icons sort_' . $context['sort_direction'] . '"></span>' : '', '</a>
					</div>
					<div class="lastpost">
						<a href="', $scripturl, '?action=unread', $context['showing_all_topics'] ? ';all' : '', $context['querystring_board_limits'], ';sort=last_post', $context['sort_by'] == 'last_post' && $context['sort_direction'] == 'up' ? ';desc' : '', '">', $txt['last_post'], $context['sort_by'] == 'last_post' ? ' <span class="main_icons sort_' . $context['sort_direction'] . '"></span>' : '', '</a>
					</div>';

		// Show a "select all" box for quick moderation?
		if ($context['showCheckboxes'])
			echo '
					<div class="moderation">
						<input type="checkbox" onclick="invertAll(this, this.form, \'topics[]\');">
					</div>';

		echo '
				</div><!-- #topic_header -->
				<div id="topic_container" class="topic-item-container">';

		foreach ($context['topics'] as $topic)
		{
			echo '
					<div class="', trim(str_replace('windowbg', '', $topic['css_class'])), ' topic-item">
						<div class="board_icon">
							<img src="', $topic['first_post']['icon_url'], '" alt="">
							', $topic['is_posted_in'] ? '<img class="posted" src="' . $settings['images_url'] . '/icons/profile_sm.png" alt="">' : '', '
						</div>
						<div class="info">';

			// Now we handle the icons
			echo '
							<div class="icons floatright">';

			if ($topic['is_locked'])
				echo '
								<span class="main_icons lock badge"></span>';

			if ($topic['is_sticky'])
				echo '
								<span class="main_icons sticky badge"></span>';

			if ($topic['is_poll'])
				echo '
								<span class="main_icons poll badge"></span>';

			echo '
							</div>';

			echo '
							<div class="recent_title">
								<a href="', $topic['new_href'], '" id="newicon', $topic['first_post']['id'], '" class="new_posts">' . $txt['new'] . '</a>
								', $topic['is_sticky'] ? '<strong>' : '', '<span class="preview" title="', $topic[(empty($modSettings['message_index_preview_first']) ? 'last_post' : 'first_post')]['preview'], '"><span id="msg_' . $topic['first_post']['id'] . '">', $topic['first_post']['link'], '</span></span>', $topic['is_sticky'] ? '</strong>' : '', '
							</div>
							<div class="item-details">
								<span>', $topic['first_post']['started_by'], '</span>
								<span class="inline-lastpost">
									<a href="', $topic['last_post']['href'], '">', icon('fas fa-sign-out-alt'), '</a>
								</span>
								', !empty($topic['pages']) ? '<span id="pages' . $topic['first_post']['id'] . '" class="topic_pages">' . $topic['pages'] . '</span>' : '', '
							</div>
						</div><!-- .info -->
						<div class="board_stats centertext">
							<p>
								', $topic['replies'], ' ', $txt['replies'], '
								<br>
								', $topic['views'], ' ', $txt['views'], '
							</p>
						</div>
						<div class="lastpost">';

			if (!empty($topic['last_post']['id']))
				echo '
							<div class="topic-item">
								<div class="topic-item-poster-avatar">', $topic['last_post']['member']['avatar']['image'], '</div>
								<div class="topic-item-content">
									<div class="topic-item-title">', $topic['last_post']['link'], '</div>
									<div class="topic-item-details">
										<div class="topic-item-poster">', $topic['last_post']['member']['link'], '</div>
										<div class="topic-item-time">', icon('far fa-clock'), ' ', timeformat($topic['last_post']['timestamp']), '</div>
									</div>
								</div>
							</div>';

			echo '

						</div>';

			if ($context['showCheckboxes'])
				echo '
						<div class="moderation">
							<input type="checkbox" name="topics[]" value="', $topic['id'], '">
						</div>';

			echo '
					</div><!-- $topic[css_class] -->';
		}

		echo '
				</div><!-- #topic_container -->
			</div><!-- #unreadreplies -->
			<div class="pagesection">
				', !empty($context['recent_buttons']) ? template_button_strip($context['recent_buttons'], 'right') : '', '
				', $context['menu_separator'], '
				<div class="pagelinks">
					<a href="#recent" class="button">', $txt['go_up'], '</a>
					', $context['page_index'], '
				</div>
			</div>';
	}
	else
		echo '
			<div class="databox databox--neutral databox--full">
				<div class="databox-icon">', icon('fas fa-exclamation-circle'), '</div>
				<div class="databox-content">
					<div class="databox-text">', $context['showing_all_topics'] ? $txt['topic_alert_none'] : $txt['updated_topics_visit_none'], '</div>
				</div>
			</div>';

	if ($context['showCheckboxes'])
		echo '
		</form>';

	echo '
	</div><!-- #recent -->';

	if (empty($context['no_topic_listing']))
		template_topic_legend();
}

?>
