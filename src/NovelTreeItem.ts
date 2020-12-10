import { Novel } from "./typings.d";
import { TreeItem } from "vscode";

export default class NovelTreeItem extends TreeItem {
  info: Novel;
  constructor(info: Novel) {
    super(`${info.name}`);
    const tips = [`名称：${info.name}`];
    // tooltip是悬浮条的提示
    this.tooltip = tips.join("\r\n");
    // 设置点击命令 传参
    this.command = {
      command: "openSelectedNovel",
      title: "打开该小说",
      arguments: [{ name: info.name, path: info.path }],
    };
  }
  contextValue = "local";
}
