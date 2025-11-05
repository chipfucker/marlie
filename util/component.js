import * as Discord from "discord.js";

export const Message = (obj) => {
	obj.flags += Discord.MessageFlags.IsComponentsV2;
	return obj;
};

export const ActionRow = (obj) => {
	obj.type = Discord.ComponentType.ActionRow;
	return obj;
};
export const Button = (obj) => {
	obj.type = Discord.ComponentType.Button;
	return obj;
};
export const StringSelect = (obj) => {
	obj.type = Discord.ComponentType.StringSelect;
	return obj;
};
export const TextInput = (obj) => {
	obj.type = Discord.ComponentType.TextInput;
	return obj;
};
export const UserSelect = (obj) => {
	obj.type = Discord.ComponentType.UserSelect;
	return obj;
};
export const RoleSelect = (obj) => {
	obj.type = Discord.ComponentType.RoleSelect;
	return obj;
};
export const MentionableSelect = (obj) => {
	obj.type = Discord.ComponentType.MentionableSelect;
	return obj;
};
export const ChannelSelect = (obj) => {
	obj.type = Discord.ComponentType.ChannelSelect;
	return obj;
};
export const Section = (obj) => {
	obj.type = Discord.ComponentType.Section;
	return obj;
};
export const TextDisplay = (obj) => {
	obj.type = Discord.ComponentType.TextDisplay;
	return obj;
};
export const Thumbnail = (obj) => {
	obj.type = Discord.ComponentType.Thumbnail;
	return obj;
};
export const MediaGallery = (obj) => {
	obj.type = Discord.ComponentType.MediaGallery;
	return obj;
};
export const File = (obj) => {
	obj.type = Discord.ComponentType.File;
	return obj;
};
export const Separator = (obj) => {
	obj.type = Discord.ComponentType.Separator;
	return obj;
};
// NO 15
export const ContentInventoryEntry = (obj) => {
	obj.type = Discord.ComponentType.ContentInventoryEntry;
	return obj;
};
export const Container = (obj) => {
	obj.type = Discord.ComponentType.Container;
	return obj;
};
export const Label = (obj) => {
	obj.type = Discord.ComponentType.Label;
	return obj;
};
export const FileUpload = (obj) => {
	obj.type = Discord.ComponentType.FileUpload;
	return obj;
}