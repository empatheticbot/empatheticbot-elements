import {css} from 'lit';

export default css`
	:host {
	display: inline-flex;
	}
	
	.live-preview-container {
		--eb-live-preview-height: 440px;
		--eb-live-preview-width: 440px;
		--eb-live-preview-overflow: initial;
		--eb-live-preview-scroll-x: 0;
		--eb-live-preview-scroll-y: 0;
		--eb-accent-color: black;
		--eb-live-preview-pointer-event: none;
		
		position: relative;
		height: calc(var(--eb-live-preview-height));
		width: calc(var(--eb-live-preview-width));
	}

		a {
		display: inline-block;
		transform: scale(.5);
		transform-origin: top left;
		height: calc(2 * var(--eb-live-preview-height));
		width: calc(2 * var(--eb-live-preview-width));
		background-color: transparent;
		clip-path: url(#svgPath);
		position: relative;
		transition: background-color .25s ease;
	}
	
	iframe {
		overflow: var(--eb-live-preview-width);
		border: 0;
		pointer-events: var(--eb-live-preview-pointer-event);
		width: calc(100% + var(--eb-live-preview-scroll-x));
		height: calc(100% + var(--eb-live-preview-scroll-y));
		margin-top: calc(-1 * var(--eb-live-preview-scroll-y));
		margin-left: calc(-1 * var(--eb-live-preview-scroll-x));
	}
	
	article {
		position: absolute;
		clip-path: url(#svgPath);
		top: ${4 / 0.5}px;
		right: ${4 / 0.5}px;
		bottom: ${4 / 0.5}px;
		left: ${4 / 0.5}px;
		overflow: hidden;
	}
	
	a:hover, a:focus {
		background-color: var(--eb-accent-color);
	}
`