<script lang="ts">
	import { settings, playingNotificationSound, isLastActiveTab } from '$lib/stores';
	import DOMPurify from 'dompurify';

	import { marked } from 'marked';
	import { createEventDispatcher, onMount } from 'svelte';
	import XMark from '$lib/components/icons/XMark.svelte';

	const dispatch = createEventDispatcher();

	export let onClick: Function = () => {};
	export let title: string = 'HI';
	export let content: string;

	let startX = 0,
		startY = 0;
	let moved = false;
	let closeButtonElement: HTMLButtonElement;
	const DRAG_THRESHOLD_PX = 6;

	const clickHandler = () => {
		onClick();
		dispatch('closeToast');
	};

	const closeHandler = () => {
		dispatch('closeToast');
	};

	function onPointerDown(e: PointerEvent) {
		startX = e.clientX;
		startY = e.clientY;
		moved = false;
		// Ensure we continue to get events even if the toast moves under the pointer.
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (moved) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		if (dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
			moved = true;
		}
	}

	function onPointerUp(e: PointerEvent) {
		// Release capture if taken
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);

		// Skip if clicking the close button
		if (
			closeButtonElement &&
			(e.target === closeButtonElement || closeButtonElement.contains(e.target as Node))
		) {
			return;
		}

		// Only treat as a click if there wasn't a drag
		if (!moved) {
			clickHandler();
		}
	}

	onMount(() => {
		if (!navigator.userActivation.hasBeenActive) {
			return;
		}

		if ($settings?.notificationSound ?? true) {
			if (!$playingNotificationSound && $isLastActiveTab) {
				playingNotificationSound.set(true);

				const audio = new Audio(`/audio/notification.mp3`);
				audio.play().finally(() => {
					// Ensure the global state is reset after the sound finishes
					playingNotificationSound.set(false);
				});
			}
		}
	});
</script>

<div
	role="status"
	aria-live="polite"
	class="relative flex items-center w-[260px] h-[70px] p-[10px] gap-[23px] box-border border-2 border-[#1C68FF] bg-[#D2E1FF] text-black rounded-none cursor-pointer select-none"
	on:dragstart|preventDefault
	on:pointerdown={onPointerDown}
	on:pointermove={onPointerMove}
	on:pointerup={onPointerUp}
	on:pointercancel={() => (moved = true)}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			clickHandler();
		}
	}}
>
	<div class="w-7 h-7 min-w-[28px] min-h-[28px] shrink-0 flex items-center justify-center text-[#1C68FF]">
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
			<path
				d="M14 1.45817C20.9183 1.45817 26.5417 7.0815 26.5417 13.9998C26.5417 20.9182 20.9183 26.5415 14 26.5415C7.08166 26.5415 1.45833 20.9182 1.45833 13.9998C1.45833 7.0815 7.08166 1.45817 14 1.45817ZM14 24.7915C19.95 24.7915 24.7917 19.9498 24.7917 13.9998C24.7917 8.04984 19.95 3.20817 14 3.20817C8.05 3.20817 3.20833 8.04984 3.20833 13.9998C3.20833 19.9498 8.05 24.7915 14 24.7915Z"
				fill="#1C68FF"
			/>
			<path
				d="M14 11.9582C14.4783 11.9582 14.875 12.3548 14.875 12.8332V18.6665C14.875 19.1448 14.4783 19.5415 14 19.5415C13.5217 19.5415 13.125 19.1448 13.125 18.6665V12.8332C13.125 12.3548 13.5217 11.9582 14 11.9582Z"
				fill="#1C68FF"
			/>
			<path
				d="M14 8.16664C14.1517 8.16664 14.3033 8.20164 14.4433 8.25997C14.5833 8.31831 14.7117 8.39998 14.8283 8.50497C14.9333 8.62164 15.015 8.73831 15.0733 8.88997C15.1317 9.02997 15.1667 9.18164 15.1667 9.33331C15.1667 9.48497 15.1317 9.63664 15.0733 9.77664C15.015 9.91664 14.9333 10.045 14.8283 10.1616C14.7117 10.2666 14.5833 10.3483 14.4433 10.4066C14.1633 10.5233 13.8367 10.5233 13.5567 10.4066C13.4167 10.3483 13.2883 10.2666 13.1717 10.1616C13.0667 10.045 12.985 9.91664 12.9267 9.77664C12.8683 9.63664 12.8333 9.48497 12.8333 9.33331C12.8333 9.18164 12.8683 9.02997 12.9267 8.88997C12.985 8.73831 13.0667 8.62164 13.1717 8.50497C13.2883 8.39998 13.4167 8.31831 13.5567 8.25997C13.6967 8.20164 13.8483 8.16664 14 8.16664Z"
				fill="#1C68FF"
			/>
		</svg>
	</div>

	<div class="flex-1 min-w-0 font-medium pr-5">
		{#if title}
			<div class="line-clamp-1 text-xs text-black">{title}</div>
		{/if}

		<div class="line-clamp-2 font-normal text-xs text-black">
			{@html DOMPurify.sanitize(marked(content))}
		</div>
	</div>

	<div class="absolute top-[10px] right-[10px] shrink-0">
		<button
			bind:this={closeButtonElement}
			class="text-[#1C68FF] hover:text-[#1C68FF] transition"
			on:click|stopPropagation={closeHandler}
			aria-label="Dismiss notification"
		>
			<XMark className="size-3.5" />
		</button>
	</div>
</div>
