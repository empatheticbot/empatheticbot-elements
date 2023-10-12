import {css} from 'lit';

export default css`
	:host {
		--eb-gap: .5rem;
		
		display: flex;
		align-items: center;
		gap: var(--eb-gap);
	}
	
	svg {
		width: auto;
		flex: 1;
	}
`