import { Event, EventEmitter, TreeDataProvider } from "vscode";
import { getLocalBooks } from "./getLocalBooks";
import NovelTreeItem from "./NovelTreeItem";
import OnlineTreeItem from "./onlineTreeItem";
import { Novel } from "./typings";
import { getChapter } from "./utils";

export default class DataProvider implements TreeDataProvider<any> {
  // 发布订阅的事件
  public refreshEvent: EventEmitter<Novel | null> = new EventEmitter<Novel | null>();
  // 挂到该方法上实现刷新
  onDidChangeTreeData: Event<Novel | null> = this.refreshEvent.event;
  // 判断是本地还是在线
  public isOnline = false;
  public treeNode: Novel[] = [];

  constructor() {
    // 默认加载本地的列表
    this.getLocal();
  }
  getLocal() {
    getLocalBooks().then((res) => {
      this.treeNode = res;
    });
  }
  // 封装一个本地和在线的切换方法
  refresh(isOnline: boolean): void {
    this.isOnline = isOnline;
    this.refreshEvent.fire(null);
    if (!isOnline) {
      this.getLocal();
    }
  }
  // 提供单行的UI显示 返回一个数组
  // 根据本地还是在线加载不同的列表项
  getTreeItem(info: Novel): NovelTreeItem {
    if (this.isOnline) {
      return new OnlineTreeItem(info);
    }
    return new NovelTreeItem(info);
  }
  // 提供每一行的数据
  // getChildren(): Promise<Novel[]> {
  //   return getLocalBooks();
  // }

  // 现在把列表每项的数据放在treenode上 除了在线小说展开章节的情况
  async getChildren(element?: Novel | undefined): Promise<Novel[]> {
    console.log("element: ", element);
    if (element) {
      return await getChapter(element.path);
    }
    return this.treeNode;
  }
}
