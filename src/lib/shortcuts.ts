type ShortcutRegistry = {
	[key in Shortcut]?: {
		name: string;
		keys: string[];
		category: string;
		tooltip?: string;
		setting?: {
			id: string;
			value: any;
		};
	};
};

export enum Shortcut {
	//Chat
	NEW_CHAT = 'newChat',
	DELETE_CHAT = 'deleteChat',
	NEW_TEMPORARY_CHAT = 'newTemporaryChat',

	//Global
	SEARCH = 'search',
	SHOW_SHORTCUTS = 'showShortcuts',
	CLOSE_MODAL = 'closeModal',
	OPEN_SETTINGS = 'openSettings',
	TOGGLE_SIDEBAR = 'toggleSidebar',

	//Input
	FOCUS_INPUT = 'focusInput',
	ADD_PROMPT = 'addPrompt',
	ATTACH_FILE = 'attachFile',

	//Message
	COPY_LAST_RESPONSE = 'copyLastResponse',
	REGENERATE_RESPONSE = 'regenerateResponse',
	COPY_LAST_CODE_BLOCK = 'copyLastCodeBlock',
}

export const shortcuts: ShortcutRegistry = {
	//Chat
	[Shortcut.NEW_CHAT]: {
		name: 'New Chat',
		keys: ['mod', 'shift', 'O'],
		category: 'Chat'
	},
	[Shortcut.NEW_TEMPORARY_CHAT]: {
		name: 'New Temporary Chat',
		keys: ['mod', 'shift', `'`],
		category: 'Chat'
	},
	[Shortcut.DELETE_CHAT]: {
		name: 'Delete Chat',
		keys: ['mod', 'shift', 'Backspace', 'Delete'],
		category: 'Chat'
	},

	//Global
	[Shortcut.SEARCH]: {
		name: 'Search',
		keys: ['mod', 'K'],
		category: 'Global'
	},
	[Shortcut.OPEN_SETTINGS]: {
		name: 'Open Settings',
		keys: ['mod', '.'],
		category: 'Global'
	},
	[Shortcut.SHOW_SHORTCUTS]: {
		name: 'Show Shortcuts',
		keys: ['mod', '/'],
		category: 'Global'
	},
	[Shortcut.TOGGLE_SIDEBAR]: {
		name: 'Toggle Sidebar',
		keys: ['mod', 'shift', 'S'],
		category: 'Global'
	},
	[Shortcut.CLOSE_MODAL]: {
		name: 'Close Modal',
		keys: ['Escape'],
		category: 'Global'
	},

	//Input
	[Shortcut.FOCUS_INPUT]: {
		name: 'Focus Chat Input',
		keys: ['shift', 'Escape'],
		category: 'Input'
	},
	[Shortcut.ATTACH_FILE]: {
		name: 'Attach File From Knowledge',
		keys: ['#'],
		category: 'Input'
	},
	[Shortcut.ADD_PROMPT]: {
		name: 'Add Custom Prompt',
		keys: ['/'],
		category: 'Input'
	},

	//Message
	[Shortcut.REGENERATE_RESPONSE]: {
		name: 'Regenerate Response',
		keys: ['mod', 'R'],
		category: 'Message'
	},
	[Shortcut.COPY_LAST_RESPONSE]: {
		name: 'Copy Last Response',
		keys: ['mod', 'shift', 'C'],
		category: 'Message'
	},
	[Shortcut.COPY_LAST_CODE_BLOCK]: {
		name: 'Copy Last Code Block',
		keys: ['mod', 'shift', ';'],
		category: 'Message'
	}
};
