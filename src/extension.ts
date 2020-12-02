// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const insertText = (val: string) => {
  const editor = vscode.window.activeTextEditor!;
  if (!editor) {
    vscode.window.showErrorMessage(
      "Can't insert log because no document is open"
    );
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

  context.subscriptions.push(insertLog);
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
