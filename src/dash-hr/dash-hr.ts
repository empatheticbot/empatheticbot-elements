import {LitElement, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {ref, createRef, Ref} from 'lit/directives/ref.js';

import dashHrStyles from './dash-hr.styles';

/**
 * Draw a horizontal dashed line that maintains stroke width and varies length based on container width.
 *
 * @slot prefix - content to show before the horizontal rule
 * @slot suffix - content to show after the horizontal rule
 * @csspart base - the svg responsible for drawing the line
 * @cssproperty --eb-gap - the space between slots and line
 */
@customElement('eb-dash-hr')
export class DashedHorizontalRuleElement extends LitElement {
  static override styles = [dashHrStyles];

  resizeObserver?: ResizeObserver;

  @query('svg')
  svg: SVGElement;

  @query('path')
  path?: SVGPathElement;

  @state()
  containerWidth?: number;

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
        }
      }
    });
  }

  override firstUpdated(): void {
    this.resizeObserver?.observe(this);
  }

  override render() {
    const padPoint = this.width / 2;
    return html`
      <slot name="prefix"></slot>
      <svg part="base" height="${this.width}px" width="100%">
        <path
          d="M${padPoint} ${padPoint} L${(this.containerWidth ?? 0) -
          padPoint} ${padPoint}"
          stroke-dasharray="${this.dash}"
          stroke-linecap="${this.linecap}"
          stroke-width="${this.width}"
          stroke="${this.color}"
          width="100%"
        />
      </svg>
      <slot name="suffix"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'eb-dash-hr': DashedHorizontalRuleElement;
  }
}
