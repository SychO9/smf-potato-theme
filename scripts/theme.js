$(function() {
	$('ul.dropmenu, ul.quickbuttons').superfish({delay : 250, speed: 100, sensitivity : 8, interval : 50, timeout : 1});

	// tooltips
	$('.preview').SMFtooltip({
		hoverIntent: {
			interval: 30,
		},
	});

	// find all nested linked images and turn off the border
	$('a.bbc_link img.bbc_img').parent().css('border', '0');

	$('.buttonlist > li > .top_menu').each(function(index, item) {
		$(item).prev().click(function(e) {
			e.stopPropagation();
			e.preventDefault();

			$('.top_menu.visible').removeClass('visible');

			$(item).toggleClass('visible');
		});

		$(window).click(function() {
			$(item).removeClass('visible');
		});
	});

	var cssColors = {};
	var styleElement = document.createElement('style');
	styleElement.id = 'realTimeColorChange';

	// Realtime color change
	$('input[id^="options_potato_color_"]').on('input', function(e) {
		var colorName = '--' + e.target.id.replace('options_potato_', '').replace('_', '-');
		var hsl = hexToHSL(e.target.value);

		cssColors[colorName + '-h'] = hsl.h + 'deg';
		cssColors[colorName + '-s'] = hsl.s + '%';
		cssColors[colorName + '-l'] = hsl.l + '%';
		cssColors[colorName] = 'hsl(var('+colorName+'-h), var('+colorName+'-s), var('+colorName+'-l))';

		var css = '';

		Object.keys(cssColors).map(function (color) {
			css += color+': '+cssColors[color]+';';
		});

		styleElement.innerText = ':root{'+css+'}';

		$('#realTimeColorChange').remove();
		$('head').append(styleElement);
	});

	// Backdrop used in smaller screens
	$('.top_menu, .quickbuttons > li > ul').each(function (index, item) {
		$(item).prev().click(function (e) {
			e.stopPropagation();

			$('body').addClass('backdrop');
		});

		$(window).click(function() {
			$('body').removeClass('backdrop');
		});
	});
});

// The purpose of this code is to fix the height of overflow: auto blocks, because some browsers can't figure it out for themselves.
function smf_codeBoxFix()
{
	var codeFix = $('code');
	$.each(codeFix, function(index, tag)
	{
		if (is_webkit && $(tag).height() < 20)
			$(tag).css({height: ($(tag).height + 20) + 'px'});

		else if (is_ff && ($(tag)[0].scrollWidth > $(tag).innerWidth() || $(tag).innerWidth() == 0))
			$(tag).css({overflow: 'scroll'});

		// Holy conditional, Batman!
		else if (
			'currentStyle' in $(tag) && $(tag)[0].currentStyle.overflow == 'auto'
			&& ($(tag).innerHeight() == '' || $(tag).innerHeight() == 'auto')
			&& ($(tag)[0].scrollWidth > $(tag).innerWidth() || $(tag).innerWidth == 0)
			&& ($(tag).outerHeight() != 0)
		)
			$(tag).css({height: ($(tag).height + 24) + 'px'});
	});
}

// Add a fix for code stuff?
if (is_ie || is_webkit || is_ff)
	addLoadEvent(smf_codeBoxFix);

// Toggles the element height and width styles of an image.
function smc_toggleImageDimensions()
{
	$('.postarea .bbc_img.resized').each(function(index, item)
	{
		$(item).click(function(e)
		{
			$(item).toggleClass('original_size');
		});
	});
}

// Add a load event for the function above.
addLoadEvent(smc_toggleImageDimensions);

function smf_addButton(stripId, image, options)
{
	$('#' + stripId).append(
		'<a href="' + options.sUrl + '" class="button last" ' + ('sCustom' in options ? options.sCustom : '') + ' ' + ('sId' in options ? ' id="' + options.sId + '_text"' : '') + '>'
			+ options.sText +
		'</a>'
	);
}

/**
 * Shows the page numbers by clicking the dots (in compact view).
 *
 * @param spanNode {Node}
 * @param baseLink {string}
 * @param firstPage {number}
 * @param lastPage {number}
 * @param perPage {number}
 */
function potatoExpandPages(spanNode, baseLink, firstPage, lastPage, perPage)
{
	if (spanNode.nextSibling) {
		spanNode.nextSibling.classList.toggle('visible');

		return;
	}

	var replacement = document.createElement('div');
	replacement.className = "top_menu visible";

	var i, oldLastPage = 0;
	var perPageLimit = 50;

	// Calculate the new pages.
	for (i = firstPage; i < lastPage; i += perPage)
		replacement.innerHTML += baseLink.replace(/%1\$d/, i).replace(/%2\$s/, 1 + i / perPage).replace(/%%/g, '%');

	replacement.innerHTML = '<div class="dropdown-content">'+replacement.innerHTML+'</div>';

	document.onclick = function(e) {
		if (e.target !== spanNode)
			replacement.classList.remove('visible');
	};

	// Add the new page links.
	$(spanNode).after(replacement);
}

/**
 * @param element {Node}
 */
function toggleDarkMode(element) {
	if (typeof potato_dark_mode_toggle_var === 'undefined' || typeof smf_member_id === 'undefined' || smf_member_id === 0)
		return;

	$(element).append('<div style="margin-inline-start: auto"><i class="fas fa-spinner fa-spin"></i></div>');

	var darkMode = $('html').hasClass('dark-mode');

	var data = {
		"default_options[potato_dark_mode]": darkMode ? 0 : 1,
		u: smf_member_id,
		sa: "theme",
		save: 1,
	};
	data[potato_dark_mode_toggle_var] = potato_dark_mode_toggle;
	data[smf_session_var] = smf_session_id;

	$.ajax({
		method: "POST",
		url: smf_scripturl + '?action=profile;area=theme',
		contentType: "application/x-www-form-urlencoded",
		data,
		success() {
			location.reload();
		},
	});

	return false;
}

/**
 *
 * @param hex {string}
 * @returns {object}
 */
function hexToHSL(hex) {
	var rgb = hexToRGB(hex);

	return RGBToHSL(rgb.r, rgb.g, rgb.b);
}

/**
 * @author https://css-tricks.com/converting-color-spaces-in-javascript/
 * @param h {string}
 * @returns {object}
 */
function hexToRGB(h) {
	let r = 0, g = 0, b = 0;

	// 3 digits
	if (h.length === 4) {
		r = "0x" + h[1] + h[1];
		g = "0x" + h[2] + h[2];
		b = "0x" + h[3] + h[3];

		// 6 digits
	} else if (h.length === 7) {
		r = "0x" + h[1] + h[2];
		g = "0x" + h[3] + h[4];
		b = "0x" + h[5] + h[6];
	}

	return {r, g, b};
}

/**
 * @author https://css-tricks.com/converting-color-spaces-in-javascript/
 * @param r {number}
 * @param g {number}
 * @param b {number}
 * @returns {object}
 */
function RGBToHSL(r, g, b) {
	// Make r, g, and b fractions of 1
	r /= 255;
	g /= 255;
	b /= 255;

	// Find greatest and smallest channel values
	var cmin = Math.min(r,g,b),
		cmax = Math.max(r,g,b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	// Calculate hue
	// No difference
	if (delta === 0)
		h = 0;
	// Red is max
	else if (cmax === r)
		h = ((g - b) / delta) % 6;
	// Green is max
	else if (cmax === g)
		h = (b - r) / delta + 2;
	// Blue is max
	else
		h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0)
		h += 360;

	// Calculate lightness
	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return {h, s, l};
}
