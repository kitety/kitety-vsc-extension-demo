// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Range } from "vscode";

const insertText = (val: string) => {
  const editor = vscode.window.activeTextEditor!;
  if (!editor) {
    return;
  }
  const selection = editor.selection;
  // 获取光标当前行
  const lineOfSelectedVar = selection.active.line;
  // edit方法获取editBuilder 实例，在后面添加一行
  editor.edit((editBuilder) => {
    editBuilder.insert(new vscode.Position(lineOfSelectedVar + 1, 0), val);
  });
};
const getAllLogStatement = (): Range[] => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return [];
  }
  const document = editor.document;
  const documentText = document.getText();

  let logStatement = [];
  const logRegex = /console.(log|debug|info|warn|error|assert|dir|dirxml|trace|group|groupEnd|time|timeEnd|profile|profileEnd|count)\((.*)\);?/g;
  let match;
  // 正则循环匹配文本
  while ((match = logRegex.exec(documentText))) {
    // 每次匹配到的当前范围 ----Range
    let matchRange = new vscode.Range(
      document.positionAt(match.index),
      document.positionAt(match.index + match[0].length)
    );
    if (!matchRange.isEmpty) {
      // 放入到数组
      logStatement.push(matchRange);
    }
  }
  return logStatement;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "kitety-vsc-extension-demo" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "kitety-vsc-extension-demo.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window
        .showInformationMessage("打开百度？", "是", "否")
        .then((result) => {
          if (result === "是") {
            console.log(`open 'https://www.baidu.com'`);
          } else {
            console.log("不打开！");
          }
        });
    }
  );

  // 注册命令名和对应的回调函数
  const insertLog = vscode.commands.registerCommand(
    "kitety-vsc-extension-demo.log",
    () => {
      // 拿到当前内容的编辑页面的内容对象 editor
      const editor = vscode.window.activeTextEditor!;
      // 拿到光标选中的文本并且格式化
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      // 拼写console
      const logToInsert = `console.log('${text}: ',${text});\n`;
      // 执行插行方法
      text ? insertText(logToInsert) : insertText("console.log();");
    }
  );
  // 删除所有的log
  const deleteAllLog = vscode.commands.registerCommand(
    "kitety-vsc-extension-demo.deleteLog",
    () => {
      // 拿到当前内容的编辑页面的内容对象 editor
      const editor = vscode.window.activeTextEditor!;
      if (!editor) {
        return;
      }
      let workSpace = new vscode.WorkspaceEdit();
      const document = editor.document;

      const logStatement = getAllLogStatement();
      logStatement.forEach((log) => {
        workSpace.delete(document.uri, log);
      });
      vscode.commands.executeCommand("editor.action.formatDocument");
      // 完成后显示消息提醒
      vscode.workspace.applyEdit(workSpace).then(() => {
        vscode.window.showInformationMessage(
          `${logStatement.length} console.log deleted`
        );
      });
    }
  );

  context.subscriptions.push(deleteAllLog);
  context.subscriptions.push(insertLog);
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
