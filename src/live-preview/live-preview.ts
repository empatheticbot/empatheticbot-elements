import {LitElement, html } from 'lit';
import {customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js'

import livePreviewStyles from './live-preview.styles'

/**
 * Draw a horizontal dashed line that maintains stroke width and varies length based on container width.
 *
 * @slot header - content to show before the horizontal rule
 * @slot description - content to show after the horizontal rule
 * @csspart base - the svg responsible for drawing the line
 * @cssproperty --eb-accent-color - the space between slots and line
 * @cssproperty --eb-live-preview-height -
 * @cssproperty --eb-live-preview-width -
 * @cssproperty --eb-live-preview-overflow -
 * @cssproperty --eb-live-preview-scroll-x -
 * @cssproperty --eb-live-preview-scroll-y -
 */
@customElement('eb-live-preview')
export class LivePreviewElement extends LitElement {
	static override styles = [livePreviewStyles];
	
	@property()
	url: URL | string
	
	@property()
	heading: string
	
	@property()
	description: string
	
	@property({ type: Number })
	xOffset = 0
	
	@property({ type: Number })
	yOffset = 0
	
	@property({ type: Boolean })
	interactive: boolean
	
	@property()
	color = 'black'
	
	@property({ type: Number })
	height = 440
	
	@property({ type: Number })
	width = 440
		
	override render() {
		return html`
			<div class="live-preview-container"
			style=${styleMap({
				'--eb-live-preview-scroll-x': `${this.xOffset}px`,
				'--eb-live-preview-scroll-y': `${this.yOffset}px`,
				'--eb-live-preview-overflow': `${this.interactive ? 'initial' : 'hidden'}`,
				'--eb-live-preview-pointer-event': `${this.interactive ? 'all' : 'none'}`,
				'--eb-live-preview-height': `${this.height}px`,
				'--eb-live-preview-width': `${this.width}px`,
				'--eb-accent-color': `${this.color}`,
				
			})
			}>
				${this.getSvg()}
				${this.getIframe()}
			</div>
		`
	}
	
	getIframe() {
		if (this.interactive) {
			return html`
			 <article>
				<iframe name="${this.heading}" 
				src="${this.url}" 
				loading="lazy"
				scrolling="yes" tabindex="-1"></iframe>
			</article>
			`
		}
		return html`
		<a href="${this.url}">
		 <article>
				<iframe name="${this.heading}" loading="lazy" 
				src="${this.url}" scrolling="no" tabindex="-1"></iframe>
			</article>
			</a>
		`
	}
	
	getSvg() {
		return html`
		<svg height="0" width="0" xmlns="http://www.w3.org/2000/svg">
		 <defs>
			 <clipPath id="svgPath" clipPathUnits="objectBoundingBox">
			 <path fill="#FFFFFF" stroke-miterlimit="10"
			 d="M0.256388524,-1.03584032e-17 L0.743611476,1.03584032e-17
			 C0.832763351,-6.01853058e-18 0.865091976,0.00928256125
			 0.897684569,0.0267132708 C0.930277162,0.0441439803
			 0.95585602,0.0697228381 0.973286729,0.102315431
			 C0.990717439,0.134908024 1,0.167236649 1,0.256388524 L1,0.743611476
			 C1,0.832763351 0.990717439,0.865091976 0.973286729,0.897684569
			 C0.95585602,0.930277162 0.930277162,0.95585602 0.897684569,0.973286729
			 C0.865091976,0.990717439 0.832763351,1 0.743611476,1 L0.256388524,1
			 C0.167236649,1 0.134908024,0.990717439 0.102315431,0.973286729
			 C0.0697228381,0.95585602 0.0441439803,0.930277162
			 0.0267132708,0.897684569 C0.00928256125,0.865091976
			 4.01235372e-18,0.832763351 -6.90560215e-18,0.743611476
			 L6.90560215e-18,0.256388524 C-4.01235372e-18,0.167236649
			 0.00928256125,0.134908024 0.0267132708,0.102315431
			 C0.0441439803,0.0697228381 0.0697228381,0.0441439803
			 0.102315431,0.0267132708 C0.134908024,0.00928256125
			 0.167236649,6.01853058e-18 0.256388524,-1.03584032e-17 Z"
		 </clipPath>
		 </defs>
		 </svg>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'eb-live-preview': LivePreviewElement
	}
}
