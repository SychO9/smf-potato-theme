<?php

/**
 * @package BestAnswer
 * @author Sami "SychO" Mazouz (sychocouldy@gmail.com)
 * @license MIT
 */

/**
 * @param array $best_answer
 * @return string
 */
function template_best_answer_single_post($best_answer)
{
	global $modSettings, $scripturl, $context, $txt;

	$output = '
		<div class="postblock best_answer">
			<div class="post_wrapper">
				<div class="poster">
					<ul class="user_info">
						<li class="avatar">'.$best_answer['member']['avatar']['image'].'</li>
						<li class="poster-name">
							<h4>'.$best_answer['member']['link'].'</h4>
						</li>';

	// Show the post group icons, but not for guests.
	if (!$best_answer['member']['is_guest'])
		$output .= '
						<li class="icons">'.$best_answer['member']['group_icons'].'</li>';

	// Show the member's primary group (like 'Administrator') if they have one.
	if (!empty($best_answer['member']['group']))
		$output .= '
						<li class="membergroup">'.$best_answer['member']['group'].'</li>';

	$output .= '
					</ul>
				</div>
				<div class="postarea">
					<div class="keyinfo">
						<h5 class="inline_details">
							<span>
								<i class="fas fa-clock"></i>
								<a href="'.$best_answer['href'].'" rel="nofollow" title="'.$best_answer['subject'].'" class="smalltext">'.timeformat($best_answer['poster_time']).'</a>
							</span>
							'.template_best_answer_marker();


	// What about likes?
	if (!empty($modSettings['enable_likes']) && !empty($best_answer['likes']['count']))
	{
		$context['some_likes'] = true;
		$count = $best_answer['likes']['count'];
		$base = 'likes_';

		if ($best_answer['likes']['you'])
		{
			$base = 'you_' . $base;
			$count--;
		}

		$base .= (isset($txt[$base . $count])) ? $count : 'n';

		$output .= '
							<span class="like_count smalltext">
								<i class="fas fa-heart"></i>
								'. sprintf($txt[$base], $scripturl . '?action=likes;sa=view;ltype=msg;like=' . $best_answer['id_msg'] . ';' . $context['session_var'] . '=' . $context['session_id'], comma_format($count)). '
							</span>';
	}

	$output .= '
						</h5>';

	$output .= template_quickbuttons(array(), 'best_answer', 'return');

	$output .= '
					</div>
					<div class="post">
						<div class="inner">'.$best_answer['body'].'</div>
					</div>
				</div>
			</div>
			<!-- .post_wrapper -->
		</div>
		<!-- $message[css_class] -->
		<hr class="post_separator">';

	return $output;
}

/**
 * @return string
 */
function template_best_answer_marker()
{
	global $txt;

	return "<span class='success best_answer_marker'><span class='main_icons icon valid'></span> {$txt['best_answer']}</span>";
}
