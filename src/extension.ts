import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Rebar Plugin Generator is now active. Use the command "Rebar Plugin Generator: Create Plugin" to create a new plugin.');

  let disposable = vscode.commands.registerCommand("rebar-plugin-generator.createRebarPlugin", () => {
    vscode.window.showInputBox({ prompt: "Enter the Plugin name:" }).then((folderName) => {
      if (folderName) {
        vscode.window
          .showQuickPick(["Yes", "No"], {
            placeHolder: "Do you want a webview folder?",
          })
          .then((option) => {
            const hasWebviewFolder = option === "Yes";
            createFolderStructure(folderName, hasWebviewFolder);
          });
      } else {
        vscode.window.showErrorMessage("Please enter a Plugin name.");
      }
    });
  });

  context.subscriptions.push(disposable);

  let advancedDisposable = vscode.commands.registerCommand("rebar-plugin-generator.createAdvancedRebarPlugin", () => {
    vscode.window.showInputBox({ prompt: "Enter the Plugin name:" }).then((folderName) => {
      if (folderName) {
        createAdvancedFolderStructure(folderName);
      } else {
        vscode.window.showErrorMessage("Please enter a Plugin name.");
      }
    });
  });

  context.subscriptions.push(advancedDisposable);
}

function createFolderStructure(folderName: string, hasWebviewFolder: boolean) {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const activeWorkspace = workspaceFolders[0];

    const workspacePath = activeWorkspace.uri.fsPath;

    const pluginsFolderPath = path.join(workspacePath, "src", "plugins");
    const clientFolderPath = path.join(pluginsFolderPath, folderName, "client");
    const serverFolderPath = path.join(pluginsFolderPath, folderName, "server");
    const sharedFolderPath = path.join(pluginsFolderPath, folderName, "shared");
    const webviewFolderPath = path.join(pluginsFolderPath, folderName, "webview");

    try {
      fs.mkdirSync(path.join(pluginsFolderPath, folderName));
      fs.mkdirSync(clientFolderPath);
      fs.mkdirSync(serverFolderPath);
      fs.mkdirSync(sharedFolderPath);
      fs.writeFileSync(path.join(sharedFolderPath, ".gitkeep"), "");

      if (hasWebviewFolder) {
        fs.mkdirSync(webviewFolderPath);
        fs.writeFileSync(path.join(webviewFolderPath, "App.vue"), "");
      }

      fs.writeFileSync(path.join(clientFolderPath, "index.ts"), "");

      fs.writeFileSync(path.join(serverFolderPath, "index.ts"), generateServerIndexContent(folderName));

      vscode.window.showInformationMessage(`Plugin ${folderName} created successfully.`);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        vscode.window.showErrorMessage(`Couldn't create the Plugins folder. Are you sure you are using Rebar?`);
      } else {
        vscode.window.showErrorMessage("Error creating folder structure.");
      }
    }
  } else {
    vscode.window.showErrorMessage("No workspace is opened.");
  }
}

function createAdvancedFolderStructure(folderName: string) {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const activeWorkspace = workspaceFolders[0];

    const workspacePath = activeWorkspace.uri.fsPath;

    const pluginsFolderPath = path.join(workspacePath, "src", "plugins");
    const pluginFolderPath = path.join(pluginsFolderPath, folderName);

    const dependenciesPath = path.join(pluginFolderPath, "dependencies.json");
    const clientPath = path.join(pluginFolderPath, "client");
    const imagesPath = path.join(pluginFolderPath, "images");
    const serverPath = path.join(pluginFolderPath, "server");
    const soundsPath = path.join(pluginFolderPath, "sounds");
    const translatePath = path.join(pluginFolderPath, "translate");
    const webviewPath = path.join(pluginFolderPath, "webview");

    try {
      fs.mkdirSync(pluginFolderPath);
      fs.mkdirSync(clientPath);
      fs.mkdirSync(imagesPath);
      fs.mkdirSync(serverPath);
      fs.mkdirSync(soundsPath);
      fs.mkdirSync(translatePath);
      fs.mkdirSync(webviewPath);

      fs.writeFileSync(dependenciesPath, "{}");
      fs.writeFileSync(path.join(clientPath, "index.ts"), "");
      fs.writeFileSync(path.join(imagesPath, ".gitkeep"), "");
      fs.writeFileSync(path.join(serverPath, "index.ts"), generateServerIndexContent(folderName));
      fs.writeFileSync(path.join(soundsPath, ".gitkeep"), "");
      fs.writeFileSync(path.join(soundsPath, ".gitkeep"), "");
      fs.writeFileSync(path.join(translatePath, "index.ts"), "");
      fs.writeFileSync(path.join(webviewPath, "App.vue"), "");

      vscode.window.showInformationMessage(`Plugin ${folderName} created successfully.`);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        vscode.window.showErrorMessage(`Couldn't create the Plugins folder. Are you sure you are using Rebar?`);
      } else {
        vscode.window.showErrorMessage("Error creating folder structure.");
      }
    }
  } else {
    vscode.window.showErrorMessage("No workspace is opened.");
  }
}

function generateServerIndexContent(folderName: string): string {
  return `import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const api = Rebar.useApi();`;
}
