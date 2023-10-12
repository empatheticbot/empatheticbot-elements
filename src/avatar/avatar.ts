import {LitElement, html } from 'lit';
import {customElement, property, state, query } from 'lit/decorators.js';

import avatarStyles from './avatar.styles'

/**
 * Draw a horizontal dashed line that maintains stroke width and varies length based on container width.
 *
 * @slot prefix - content to show before the horizontal rule
 * @slot suffix - content to show after the horizontal rule
 * @csspart base - the svg responsible for drawing the line
 * @cssproperty --eb-gap - the space between slots and line
 */
@customElement('eb-avatar')
export class AvatarElement extends LitElement {
	static override styles = [avatarStyles];
	
	resizeObserver?: ResizeObserver;
	
	@query('svg')
	svg: SVGElement;
	
	@state()
	containerWidth?: number;
	
	@state()
	containerHeight?: number;
	
	@property()
	title: string
	
	@property()
	description?: string
	
	@property()
	src: string
	
	@property()
	radius: number = 8
	
	@property()
	color = '#000';
	
	@property({type: Number})
	width = 2;
	
	@property()
	dash = '7, 3';
	
	
	@property()
	linecap: 'round' | 'square' | 'butt' = 'round';

	override connectedCallback(): void {
		super.connectedCallback();
		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentBoxSize) {
					const contentBoxSize = entry.contentBoxSize[0];
					this.containerWidth = contentBoxSize.inlineSize;
					this.containerHeight = contentBoxSize.blockSize;
				}
			}
		});
	}
	
	override firstUpdated(): void {
			this.resizeObserver?.observe(this);
	}
	
	override render() {
		// const padPoint = this.width / 2;
		return html`
			<svg height="100%" width="100%">
				<rect height=${this.containerHeight} width=${this.containerWidth}
				stroke-dasharray="${this.dash}"
				stroke-linecap="${this.linecap}"
				stroke-width="${this.width}"
				stroke="${this.color}" />
				<title id="title">${this.title}</title>
				<desc id="desc">${this.description}</desc>
			</svg>
				<img src=${this.src} />
			<slot></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'eb-avatar': AvatarElement;
	}
}
