import {App, PluginSettingTab, Setting} from "obsidian";
import MyPlugin from "./main";

export interface MyPluginSettings {
	defaultWidth: number;
	defaultHeight: number;
	padding: number;
	maxWidth: number;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	defaultWidth: 600,
	defaultHeight: 300,
	padding: 16,
	maxWidth: 0,
}

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('默认宽度')
			.setDesc('图表默认宽度（像素）')
			.addText(text => text
				.setPlaceholder('600')
				.setValue(String(this.plugin.settings.defaultWidth))
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num) && num > 0) {
						this.plugin.settings.defaultWidth = num;
						await this.plugin.saveSettings();
					}
				}));

		new Setting(containerEl)
			.setName('默认高度')
			.setDesc('图表默认高度（像素）')
			.addText(text => text
				.setPlaceholder('300')
				.setValue(String(this.plugin.settings.defaultHeight))
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num) && num > 0) {
						this.plugin.settings.defaultHeight = num;
						await this.plugin.saveSettings();
					}
				}));

		new Setting(containerEl)
			.setName('内边距')
			.setDesc('图表内边距（像素）')
			.addText(text => text
				.setPlaceholder('16')
				.setValue(String(this.plugin.settings.padding))
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num) && num >= 0) {
						this.plugin.settings.padding = num;
						await this.plugin.saveSettings();
					}
				}));

		new Setting(containerEl)
			.setName('最大宽度')
			.setDesc('图表最大宽度（像素），0表示不限制')
			.addText(text => text
				.setPlaceholder('0')
				.setValue(String(this.plugin.settings.maxWidth || 0))
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num) && num >= 0) {
						this.plugin.settings.maxWidth = num;
						await this.plugin.saveSettings();
					}
				}));
	}
}
