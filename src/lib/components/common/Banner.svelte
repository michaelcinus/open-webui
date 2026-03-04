<script lang="ts">
	import type { Banner } from '$lib/types';
	import { onMount, createEventDispatcher, getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';
	import { WEBUI_BASE_URL } from '$lib/constants';

	const dispatch = createEventDispatcher();
	const i18n = getContext('i18n');

	export let banner: Banner = {
		id: '',
		type: 'info',
		title: '',
		content: '',
		url: '',
		dismissible: true,
		timestamp: Math.floor(Date.now() / 1000)
	};
	export let className = 'mx-2 px-2 rounded-lg';

	export let dismissed = false;

	let mounted = false;

	const badgeClassNames: Record<string, string> = {
		info: 'bg-blue-500/20 text-blue-700 dark:text-blue-200 ',
		success: 'bg-green-500/20 text-green-700 dark:text-green-200',
		warning: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200',
		error: 'bg-red-500/20 text-red-700 dark:text-red-200'
	};

	const containerClassNames: Record<string, string> = {
		info: 'border-blue-200 bg-blue-500/10 dark:border-blue-500/30 dark:bg-blue-500/15',
		success: 'border-green-200 bg-green-500/10 dark:border-green-500/30 dark:bg-green-500/15',
		warning: 'border-yellow-200 bg-yellow-500/10 dark:border-yellow-500/30 dark:bg-yellow-500/15',
		error: 'border-red-200 bg-red-500/10 dark:border-red-500/30 dark:bg-red-500/15'
	};

	let bannerType = 'info';
	$: bannerType = (banner?.type ?? 'info').toLowerCase();

	const dismiss = (id) => {
		dismissed = true;
		dispatch('dismiss', id);
	};

	onMount(() => {
		mounted = true;
	});
</script>

{#if !dismissed}
	{#if mounted}
		<div
			class="{className} top-0 left-0 right-0 py-1 flex justify-center items-center relative border text-gray-800 dark:text-gray-100 backdrop-blur-xl z-30 {containerClassNames[
				bannerType
			] ?? containerClassNames['info']}"
			transition:fade={{ delay: 100, duration: 300 }}
		>
			<div class=" flex flex-col md:flex-row md:items-center flex-1 text-sm w-fit gap-1.5">
				<div class="flex justify-between self-start">
					<div
						class=" text-xs font-semibold {badgeClassNames[bannerType] ??
							badgeClassNames['info']}  w-fit px-2 rounded-sm uppercase line-clamp-1 mr-0.5"
					>
						{#if bannerType === 'info'}
							{$i18n.t('Info')}
						{:else if bannerType === 'warning'}
							{$i18n.t('Warning')}
						{:else if bannerType === 'error'}
							{$i18n.t('Error')}
						{:else if bannerType === 'success'}
							{$i18n.t('Success')}
						{:else}
							{banner.type}
						{/if}
					</div>

					{#if banner.url}
						<div class="flex md:hidden group w-fit md:items-center">
							<a
								class="text-gray-700 dark:text-white text-xs font-semibold underline"
								href="{WEBUI_BASE_URL}/assets/files/whitepaper.pdf"
								target="_blank"
							>
								{$i18n.t('Learn More')}
							</a>

							<div
								class=" ml-1 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white"
							>
								<!--  -->
								<svg
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									class="w-4 h-4"
								>
									<path
										fill-rule="evenodd"
										d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						</div>
					{/if}
				</div>
				<div class="flex-1 text-xs text-gray-700 dark:text-white max-h-60 overflow-y-auto">
					{@html DOMPurify.sanitize(marked.parse((banner?.content ?? '').replace(/\n/g, '<br>')))}
				</div>
			</div>

			{#if banner.url}
				<div class="hidden md:flex group w-fit md:items-center">
					<a
						class="text-gray-700 dark:text-white text-xs font-semibold underline"
						href="/"
						target="_blank"
					>
						{$i18n.t('Learn More')}
					</a>

					<div class=" ml-1 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white">
						<!--  -->
						<svg
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="size-4"
						>
							<path
								fill-rule="evenodd"
								d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
			{/if}
			<div class="flex self-start">
				<button
					aria-label={$i18n.t('Close Banner')}
					on:click={() => {
						dismiss(banner.id);
					}}
					class="  -mt-1 -mb-2 -translate-y-[1px] ml-1.5 mr-1 text-gray-400 dark:hover:text-white"
					>&times;</button
				>
			</div>
		</div>
	{/if}
{/if}
