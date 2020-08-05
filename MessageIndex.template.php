<?php
/**
 * Simple Machines Forum (SMF)
 *
 * @package SMF
 * @author Simple Machines https://www.simplemachines.org
 * @copyright 2020 Simple Machines and individual contributors
 * @license https://www.simplemachines.org/about/smf/license.php BSD
 *
 * @version 2.1 RC2
 */

/**
 * Board Description
 */
function template_page_details()
{
	global $context, $txt;

	if (empty($context['description']) && empty($context['moderators']))
		return;

	echo '
	<div>';

	if (!empty($context['description']))
		echo '
			', $context['description'];

	if (!empty($context['moderators']))
		echo '
			', count($context['moderators']) === 1 ? $txt['moderator'] : $txt['moderators'], ': ', implode(', ', $context['link_moderators']), '.';

	echo '
	</div>';
}

/**
 * The main messageindex.
 */
function template_main()
{
	global $context, $settings, $options, $scripturl, $modSettings, $txt;

	// Let them know why their message became unapproved.
	if ($context['becomesUnapproved'])
		echo '
	<div class="noticebox">
		', $txt['post_becomes_unapproved'], '
	</div>';

	if (!empty($context['boards']) && (!empty($options['show_children']) || $context['start'] == 0))
	{
		echo '
	<div id="board_', $context['current_board'], '_childboards" class="boardindex_table">
		<div class="cat_bar">
			<h3 class="catbg">', $txt['sub_boards'], '</h3>
		</div>
		<div class="board-container">';

		foreach ($context['boards'] as $board)
		{
			echo '
		<div id="board_', $board['id'], '" class="up_contain ', (!empty($board['css_class']) ? $board['css_class'] : ''), '">
			<div class="board_icon">
				', function_exists('template_bi_' . $board['type'] . '_icon') ? call_user_func('template_bi_' . $board['type'] . '_icon', $board) : template_bi_board_icon($board), '
			</div>
			<div class="info">
				', function_exists('template_bi_' . $board['type'] . '_info') ? call_user_func('template_bi_' . $board['type'] . '_info', $board) : template_bi_board_info($board), '
			</div><!-- .info -->';

			// Show some basic information about the number of posts, etc.
			echo '
			<div class="board_stats">
				', function_exists('template_bi_' . $board['type'] . '_stats') ? call_user_func('template_bi_' . $board['type'] . '_stats', $board) : template_bi_board_stats($board), '
			</div>';

			// Show the last post if there is one.
			if(!empty($board['last_post']['id']))
				echo '
			<div class="lastpost lpr_border">
				', function_exists('template_bi_' . $board['type'] . '_lastpost') ? call_user_func('template_bi_' . $board['type'] . '_lastpost', $board) : template_bi_board_lastpost($board), '
			</div>';

			// Won't somebody think of the children!
			if (function_exists('template_bi_' . $board['type'] . '_children'))
				call_user_func('template_bi_' . $board['type'] . '_children', $board);
			else
				template_bi_board_children($board);

				echo '
		</div><!-- #board_[id] -->';
		}

		echo '
		</div>
	</div><!-- #board_[current_board]_childboards -->';
	}

	if (!$context['no_topic_listing'])
	{

		echo '
	<div class="pagesection">
		<div class="pagelinks floatleft">
			<a href="#bot" class="button">', $txt['go_down'], '</a>
			', $context['page_index'], '
		</div>
		', $context['menu_separator'], '
		', template_button_strip($context['normal_buttons'], 'right', array('merge' => true)), '
	</div>';

		// If Quick Moderation is enabled start the form.
		if (!empty($context['can_quick_mod']) && $options['display_quick_mod'] > 0 && !empty($context['topics']))
			echo '
	<form action="', $scripturl, '?action=quickmod;board=', $context['current_board'], '.', $context['start'], '" method="post" accept-charset="', $context['character_set'], '" class="clear" name="quickModForm" id="quickModForm">';

		echo '
		<div id="messageindex">';

		if (!empty($settings['display_who_viewing']))
		{
			echo '
			<div class="information">';

			if ($settings['display_who_viewing'] == 1)
				echo count($context['view_members']), ' ', count($context['view_members']) === 1 ? $txt['who_member'] : $txt['members'];

			else
				echo empty($context['view_members_list']) ? '0 ' . $txt['members'] : implode(', ', $context['view_members_list']) . (empty($context['view_num_hidden']) || $context['can_moderate_forum'] ? '' : ' (+ ' . $context['view_num_hidden'] . ' ' . $txt['hidden'] . ')');
			echo $txt['who_and'], $context['view_num_guests'], ' ', $context['view_num_guests'] == 1 ? $txt['guest'] : $txt['guests'], $txt['who_viewing_board'];

			echo '
			</div>';
		}

		// If this person can approve items and we have some awaiting approval tell them.
		if (!empty($context['unapproved_posts_message']))
			echo '
			<div class="databox databox--notice">
				<div class="databox-icon">', icon('fas fa-exclamation-circle'), '</div>
				<div class="databox-content">
					<div class="databox-text">', $context['unapproved_posts_message'], '</div>
				</div>
			</div>';

		echo '
			<div class="topic-list-area">
				<div class="title_bar topic-header" id="topic_header">';

		// Are there actually any topics to show?
		if (!empty($context['topics']))
		{
			echo '
				<div class="board_icon"></div>
				<div class="info">', $context['topics_headers']['subject'], ' / ', $context['topics_headers']['starter'], '</div>
				<div class="board_stats centertext">', $context['topics_headers']['replies'], ' / ', $context['topics_headers']['views'], '</div>
				<div class="lastpost">', $context['topics_headers']['last_post'], '</div>';

			// Show a "select all" box for quick moderation?
			if (!empty($context['can_quick_mod']) && $options['display_quick_mod'] == 1)
				echo '
				<div class="moderation">
					<input type="checkbox" onclick="invertAll(this, this.form, \'topics[]\');">
				</div>';

			// If it's on in "image" mode, don't show anything but the column.
			elseif (!empty($context['can_quick_mod']))
				echo '
				<div class="moderation"></div>';
		}

		// No topics... just say, "sorry bub".
		else
			echo '
				<div class="databox databox--neutral databox--full">
					<div class="databox-icon">', icon('fas fa-exclamation-circle'), '</div>
					<div class="databox-content">
						<div class="databox-text">', $txt['topic_alert_none'], '</div>
					</div>
				</div>';

		echo '
			</div><!-- #topic_header -->';

		// Contain the topic list
		echo '
			<div id="topic_container" class="topic-item-container">';

		foreach ($context['topics'] as $topic)
		{
			$topic['css_class'] = trim(str_replace('windowbg', '', $topic['css_class']));

			echo '
				<div class="', $topic['css_class'], ' topic-item">
					<div class="board_icon">
						<img src="', $topic['first_post']['icon_url'], '" alt="">
						', $topic['is_posted_in'] ? '<img class="posted" src="' . $settings['images_url'] . '/icons/profile_sm.png" alt="">' : '', '
					</div>
					<div class="info', !empty($context['can_quick_mod']) ? '' : ' info_block', '">
						<div ', (!empty($topic['quick_mod']['modify']) ? 'id="topic_' . $topic['first_post']['id'] . '"  ondblclick="oQuickModifyTopic.modify_topic(\'' . $topic['id'] . '\', \'' . $topic['first_post']['id'] . '\');"' : ''), '>';

			// Now we handle the icons
			echo '
							<div class="icons floatright">';

			if ($topic['is_watched'])
				echo '
								<span class="main_icons watch badge" title="', $txt['watching_this_topic'], '"></span>';

			if ($topic['is_locked'])
				echo '
								<span class="main_icons lock badge"></span>';

			if ($topic['is_sticky'])
				echo '
								<span class="main_icons sticky badge"></span>';

			if ($topic['is_redirect'])
				echo '
								<span class="main_icons move badge"></span>';

			if ($topic['is_poll'])
				echo '
								<span class="main_icons poll badge"></span>';

			echo '
							</div>';

			echo '
							<div class="message_index_title">
								', $topic['new'] && $context['user']['is_logged'] ? '<a href="' . $topic['new_href'] . '" id="newicon' . $topic['first_post']['id'] . '" class="new_posts">' . $txt['new'] . '</a>' : '', '
								<span class="preview', $topic['is_sticky'] ? ' bold_text' : '', '" title="', $topic[(empty($modSettings['message_index_preview_first']) ? 'last_post' : 'first_post')]['preview'], '">
									<span id="msg_', $topic['first_post']['id'], '">', $topic['first_post']['link'], (!$topic['approved'] ? '&nbsp;<em>(' . $txt['awaiting_approval'] . ')</em>' : ''), '</span>
								</span>
							</div>
							<div class="item-details">
								<span>', $txt['started_by'], ' ', $topic['first_post']['member']['link'], '</span>
								<span class="inline-lastpost">
									<a href="', $topic['last_post']['href'], '">', icon('fas fa-sign-out-alt'), '</a>
								</span>
								', !empty($topic['pages']) ? '<span id="pages' . $topic['first_post']['id'] . '" class="topic_pages">' . $topic['pages'] . '</span>' : '', '
							</div>
						</div><!-- #topic_[first_post][id] -->
					</div><!-- .info -->
					<div class="board_stats centertext">
						<p>', $txt['replies'], ': ', $topic['replies'], '<br>', $txt['views'], ': ', $topic['views'], '</p>
					</div>
					<div class="lastpost">
						', template_bi_board_lastpost($topic), '
					</div>';

			// Show the quick moderation options?
			if (!empty($context['can_quick_mod']))
			{
				echo '
					<div class="moderation">';

				if ($options['display_quick_mod'] == 1)
					echo '
						<input type="checkbox" name="topics[]" value="', $topic['id'], '">';
				else
				{
					// Check permissions on each and show only the ones they are allowed to use.
					if ($topic['quick_mod']['remove'])
						echo '<a href="', $scripturl, '?action=quickmod;board=', $context['current_board'], '.', $context['start'], ';actions%5B', $topic['id'], '%5D=remove;', $context['session_var'], '=', $context['session_id'], '" class="you_sure"><span class="main_icons delete" title="', $txt['remove_topic'], '"></span></a>';

					if ($topic['quick_mod']['lock'])
						echo '<a href="', $scripturl, '?action=quickmod;board=', $context['current_board'], '.', $context['start'], ';actions%5B', $topic['id'], '%5D=lock;', $context['session_var'], '=', $context['session_id'], '" class="you_sure"><span class="main_icons lock" title="', $topic['is_locked'] ? $txt['set_unlock'] : $txt['set_lock'], '"></span></a>';

					if ($topic['quick_mod']['lock'] || $topic['quick_mod']['remove'])
						echo '<br>';

					if ($topic['quick_mod']['sticky'])
						echo '<a href="', $scripturl, '?action=quickmod;board=', $context['current_board'], '.', $context['start'], ';actions%5B', $topic['id'], '%5D=sticky;', $context['session_var'], '=', $context['session_id'], '" class="you_sure"><span class="main_icons sticky" title="', $topic['is_sticky'] ? $txt['set_nonsticky'] : $txt['set_sticky'], '"></span></a>';

					if ($topic['quick_mod']['move'])
						echo '<a href="', $scripturl, '?action=movetopic;current_board=', $context['current_board'], ';board=', $context['current_board'], '.', $context['start'], ';topic=', $topic['id'], '.0"><span class="main_icons move" title="', $txt['move_topic'], '"></span></a>';
				}
				echo '
					</div><!-- .moderation -->';
			}
			echo '
				</div><!-- $topic[css_class] -->';
		}

		echo '
				</div><!-- #topic_container -->
			</div>';

		if (!empty($context['can_quick_mod']) && $options['display_quick_mod'] == 1 && !empty($context['topics']))
		{
			echo '
			<div class="righttext" id="quick_actions">
				<select class="qaction" name="qaction"', $context['can_move'] ? ' onchange="this.form.move_to.disabled = (this.options[this.selectedIndex].value != \'move\');"' : '', '>
					<option value="">--------</option>';

			foreach ($context['qmod_actions'] as $qmod_action)
				if ($context['can_' . $qmod_action])
					echo '
					<option value="' . $qmod_action . '">' . $txt['quick_mod_' . $qmod_action] . '</option>';

			echo '
				</select>';

			// Show a list of boards they can move the topic to.
			if ($context['can_move'])
				echo '
				<span id="quick_mod_jump_to"></span>';

			echo '
				<input type="submit" value="', $txt['quick_mod_go'], '" onclick="return document.forms.quickModForm.qaction.value != \'\' &amp;&amp; confirm(\'', $txt['quickmod_confirm'], '\');" class="button qaction">
			</div><!-- #quick_actions -->';
		}


		echo '
		</div><!-- #messageindex -->';

		// Finish off the form - again.
		if (!empty($context['can_quick_mod']) && $options['display_quick_mod'] > 0 && !empty($context['topics']))
			echo '
		<input type="hidden" name="' . $context['session_var'] . '" value="' . $context['session_id'] . '">
	</form>';

		echo '
	<div class="pagesection">
		<div class="pagelinks floatleft">
			<a href="#main_content_section" class="button" id="bot">', $txt['go_up'], '</a>
			', $context['page_index'], '
		</div>
		', $context['menu_separator'], '
		', template_button_strip($context['normal_buttons'], 'right', array('merge' => true)), '
	</div>';
	}

	if (!empty($context['can_quick_mod']) && $options['display_quick_mod'] == 1 && !empty($context['topics']) && $context['can_move'])
		echo '
	<script>
		if (typeof(window.XMLHttpRequest) != "undefined")
			aJumpTo[aJumpTo.length] = new JumpTo({
				sContainerId: "quick_mod_jump_to",
				sClassName: "qaction",
				sJumpToTemplate: "%dropdown_list%",
				iCurBoardId: ', $context['current_board'], ',
				iCurBoardChildLevel: ', $context['jump_to']['child_level'], ',
				sCurBoardName: "', $context['jump_to']['board_name'], '",
				sBoardChildLevelIndicator: "==",
				sBoardPrefix: "=> ",
				sCatSeparator: "-----------------------------",
				sCatPrefix: "",
				bNoRedirect: true,
				bDisabled: true,
				sCustomName: "move_to"
			});
	</script>';

	// Javascript for inline editing.
	echo '
	<script>
		var oQuickModifyTopic = new QuickModifyTopic({
			aHidePrefixes: Array("lockicon", "stickyicon", "pages", "newicon"),
			bMouseOnDiv: false,
		});
	</script>';

	template_topic_legend();
}

/**
 * Outputs the board icon for a standard board.
 *
 * @param array $board Current board information.
 */
function template_bi_board_icon($board)
{
	global $context, $scripturl;

	$icon_type = $board['new'] ? 'fas' : 'far';

	echo '
		<a href="', ($context['user']['is_guest'] ? $board['href'] : $scripturl . '?action=unread;board=' . $board['id'] . '.0;children'), '" class="board_', $board['board_class'], '"', !empty($board['board_tooltip']) ? ' title="' . $board['board_tooltip'] . '"' : '', '>
			', icon("$icon_type fa-comments"), '
		</a>';
}

/**
 * Outputs the board icon for a redirect.
 *
 * @param array $board Current board information.
 */
function template_bi_redirect_icon($board)
{
	global $context, $scripturl;

	echo '
		<a href="', $board['href'], '" class="board_', $board['board_class'], '"', !empty($board['board_tooltip']) ? ' title="' . $board['board_tooltip'] . '"' : '', '>
			', icon('fas fa-external-link-alt'), '
		</a>';
}

/**
 * Outputs the board info for a standard board or redirect.
 *
 * @param array $board Current board information.
 */
function template_bi_board_info($board)
{
	global $context, $scripturl, $txt;

	echo '
		<a class="subject mobile_subject" href="', $board['href'], '" id="b', $board['id'], '">
			', $board['name'], '
		</a>';

	// Has it outstanding posts for approval?
	if ($board['can_approve_posts'] && ($board['unapproved_posts'] || $board['unapproved_topics']))
		echo '
		<a href="', $scripturl, '?action=moderate;area=postmod;sa=', ($board['unapproved_topics'] > 0 ? 'topics' : 'posts'), ';brd=', $board['id'], ';', $context['session_var'], '=', $context['session_id'], '" title="', sprintf($txt['unapproved_posts'], $board['unapproved_topics'], $board['unapproved_posts']), '" class="moderation_link amt">!</a>';

	echo '
		<div class="board_description">', $board['description'], '</div>';

	// Show the "Moderators: ". Each has name, href, link, and id. (but we're gonna use link_moderators.)
	if (!empty($board['moderators']) || !empty($board['moderator_groups']))
		echo '
		<p class="moderators">', count($board['link_moderators']) === 1 ? icon('fas fa-user').' '.$txt['moderator'] : icon('fas fa-user-friends').' '.$txt['moderators'], ': ', implode(', ', $board['link_moderators']), '</p>';
}

/**
 * Outputs the board stats for a standard board.
 *
 * @param array $board Current board information.
 */
function template_bi_board_stats($board)
{
	global $txt;

	echo '
		<div>', icon('fas fa-reply-all'), ' ', comma_format($board['posts']), '</div>
		<div>', icon('fas fa-file-alt'), ' ', comma_format($board['topics']), '</div>';
}

/**
 * Outputs the board stats for a redirect.
 *
 * @param array $board Current board information.
 */
function template_bi_redirect_stats($board)
{
	global $txt;

	echo '
		<div>', icon('fas fa-external-link-alt'), ' ', comma_format($board['posts']), '</div>';
}
/**
 * Outputs the board lastposts for a standard board or a redirect.
 * When on a mobile device, this may be hidden if no last post exists.
 *
 * @param array $board Current board information.
 */
function template_bi_board_lastpost($board)
{
	if (empty($board['last_post']['id']))
		return;

	echo '
		<div class="topic-item">
			<div class="topic-item-poster-avatar">', $board['last_post']['member']['avatar']['image'], '</div>
			<div class="topic-item-content">
				<div class="topic-item-title">', $board['last_post']['link'], '</div>
				<div class="topic-item-details">
					<div class="topic-item-poster">', $board['last_post']['member']['link'], '</div>
					<div class="topic-item-time">', icon('far fa-clock'), ' ', timeformat($board['last_post']['timestamp']), '</div>
				</div>
			</div>
		</div>';
}

/**
 * Outputs the board children for a standard board.
 *
 * @param array $board Current board information.
 */
function template_bi_board_children($board)
{
	global $txt, $scripturl, $context;

	// Show the "Child Boards: ". (there's a link_children but we're going to bold the new ones...)
	if (!empty($board['children']))
	{
		// Sort the links into an array with new boards bold so it can be imploded.
		$children = array();
		/* Each child in each board's children has:
			id, name, description, new (is it new?), topics (#), posts (#), href, link, and last_post. */
		foreach ($board['children'] as $child)
		{
			if (!$child['is_redirect'])
				$child['link'] = '' . ($child['new'] ? '<a href="' . $scripturl . '?action=unread;board=' . $child['id'] . '" title="' . $txt['new_posts'] . ' (' . $txt['board_topics'] . ': ' . comma_format($child['topics']) . ', ' . $txt['posts'] . ': ' . comma_format($child['posts']) . ')" class="new_posts">' . $txt['new'] . '</a>' : '') . '<a href="' . $child['href'] . '" ' . ($child['new'] ? 'class="board_new_posts" ' : '') . 'title="' . ($child['new'] ? $txt['new_posts'] : $txt['old_posts']) . ' (' . $txt['board_topics'] . ': ' . comma_format($child['topics']) . ', ' . $txt['posts'] . ': ' . comma_format($child['posts']) . ')">' . $child['name'] . '</a>';
			else
				$child['link'] = '<a href="' . $child['href'] . '" title="' . comma_format($child['posts']) . ' ' . $txt['redirects'] . ' - ' . $child['short_description'] . '">' . $child['name'] . '</a>';

			// Has it posts awaiting approval?
			if ($child['can_approve_posts'] && ($child['unapproved_posts'] || $child['unapproved_topics']))
				$child['link'] .= ' <a href="' . $scripturl . '?action=moderate;area=postmod;sa=' . ($child['unapproved_topics'] > 0 ? 'topics' : 'posts') . ';brd=' . $child['id'] . ';' . $context['session_var'] . '=' . $context['session_id'] . '" title="' . sprintf($txt['unapproved_posts'], $child['unapproved_topics'], $child['unapproved_posts']) . '" class="moderation_link amt">!</a>';

			$children[] = $child['new'] ? '<span class="strong">' . $child['link'] . '</span>' : '<span>' . $child['link'] . '</span>';
		}

		echo '
			<div id="board_', $board['id'], '_children" class="children">
				<p><strong id="child_list_', $board['id'], '">', icon('fas fa-folder-open'), ' ', $txt['sub_boards'], '</strong>', implode($children), '</p>
			</div>';
	}
}

/**
 * Shows a legend for topic icons.
 */
function template_topic_legend()
{
	global $context, $settings, $txt, $modSettings;

	echo '
	<div class="tborder" id="topic_icons">
		<div class="information">
			<p class="floatright" id="message_index_jump_to"></p>';

	if (empty($context['no_topic_listing']))
		echo '
			<p class="floatleft">', !empty($modSettings['enableParticipation']) && $context['user']['is_logged'] ? '
				<img src="' . $settings['images_url'] . '/icons/profile_sm.png" alt="" class="centericon"> ' . $txt['participation_caption'] . '<br>' : '', '
				' . ($modSettings['pollMode'] == '1' ? '<span class="main_icons poll centericon"></span> ' . $txt['poll'] : '') . '<br>
				<img src="' . $settings['images_url'] . '/post/moved.png" alt="" class="centericon sizefix"> ' . $txt['moved_topic'] . '<br>
			</p>
			<p>
				<span class="main_icons lock centericon"></span> ' . $txt['locked_topic'] . '<br>
				<span class="main_icons sticky centericon"></span> ' . $txt['sticky_topic'] . '<br>
			</p>';

	if (!empty($context['jump_to']))
		echo '
			<script>
				if (typeof(window.XMLHttpRequest) != "undefined")
					aJumpTo[aJumpTo.length] = new JumpTo({
						sContainerId: "message_index_jump_to",
						sJumpToTemplate: "<label class=\"smalltext jump_to\" for=\"%select_id%\">', $context['jump_to']['label'], '<" + "/label> %dropdown_list%",
						iCurBoardId: ', $context['current_board'], ',
						iCurBoardChildLevel: ', $context['jump_to']['child_level'], ',
						sCurBoardName: "', $context['jump_to']['board_name'], '",
						sBoardChildLevelIndicator: "==",
						sBoardPrefix: "=> ",
						sCatSeparator: "-----------------------------",
						sCatPrefix: "",
						sGoButtonLabel: "', $txt['quick_mod_go'], '"
					});
			</script>';

	echo '
			<br class="clear">
		</div><!-- .information -->
	</div><!-- #topic_icons -->';
}

?>
