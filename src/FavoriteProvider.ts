import { Event, EventEmitter, TreeDataProvider, workspace } from "vscode";
import { getChapter } from "./utils";
import NovelTreeItem from "./NovelTreeItem";
import OnlineTreeItem from "./OnlineTreeItem";
import { Novel } from "./typings";
export default class FavoriteProvider implements TreeDataProvider<Novel> {
  public refreshEvent: EventEmitter<Novel | null> = new EventEmitter<Novel | null>();

  readonly onDidChangeTreeData: Event<Novel | null> = this.refreshEvent.event;

  refresh() {
    this.refreshEvent.fire(null);
  }

  getTreeItem(info: Novel): NovelTreeItem {
    // ui可以复用OnlineTreeItem
    return new OnlineTreeItem(info);
  }

  async getChildren(element?: Novel | undefined): Promise<Novel[]> {
    if (element) {
      return await getChapter(element.path);
    }
    // 收藏栏数据从配置项中拿取
    return workspace.getConfiguration().get("novel.favorites", []);
  }

  contextValue = "favorite";
}
