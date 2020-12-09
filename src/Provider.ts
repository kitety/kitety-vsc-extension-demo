import { TreeDataProvider } from "vscode";
import { getLocalBooks } from "./getLocalBooks";
import NovelTreeItem from "./NovelTreeItem";
import { Novel } from "./typings";

export default class DataProvider implements TreeDataProvider<any> {
  // 提供单行的UI显示 返回一个数组
  getTreeItem(info: Novel): NovelTreeItem {
    return new NovelTreeItem(info);
  }
  // 提供每一行的数据
  getChildren(): Promise<Novel[]> {
    return getLocalBooks();
  }
}
