import {LitElement, html, css } from 'lit';
import {customElement, property, query} from 'lit/decorators.js';


/**
 * 
 */
@customElement('eb-share')
export class ShareElement extends LitElement {
  static override styles = [css`
    .share-button {
      visibility: hidden;
      opacity: 0;
      transition: all .25s ease;
    }
    
    .share-button-available {
      visibility: visible;
      opacity: 1;
    }
  `];
  
  @query('.share-button')
  button: HTMLButtonElement
  
  @property()
  url: string
  
  @property()
  title: string
  
  @property()
  description?: string

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override firstUpdated(): void {
    if (this.nativeShareAvailable()) {
      this.button.classList.add('share-button-available')
    }
  }

  override render() {
    return html`
      <button 
        class="share-button"
        aria-label="Share '${this.title}'" 
        part="button"
        type="button"
        @click=${this.attemptNativeShare}
        >
        <slot></slot>
      </button>
    `;
  }
  
  private getShareData(): ShareData {
    return {
      title: this.title,
      text: this.description,
      url: this.url,
    }
  }
  
  private async attemptNativeShare() {
    try {
      await navigator.share(this.getShareData())
      const event = new CustomEvent('success')
      this.dispatchEvent(event) 
    } catch (err) {
      const event = new CustomEvent('failed', {
        detail: {
          reason: '"navigator.share()" failed.'
        }
      })
      this.dispatchEvent(event)    
    }
  }
  
  private nativeShareAvailable() {
    let reasonShareUnavailable = ''
    if (!navigator.canShare) {
      reasonShareUnavailable = '"navigator.canShare()" isn\'t available.'
    } else if (navigator.canShare(this.getShareData())) {
      return true
    } else {
      reasonShareUnavailable = '"navigator.canShare()" returned false with data provided.'
    }
    
    const event = new CustomEvent('unavailable', {
      detail: {
        reason: reasonShareUnavailable,
      }
    })
    this.dispatchEvent(event)
    
    return false
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'eb-share': ShareElement;
  }
}
