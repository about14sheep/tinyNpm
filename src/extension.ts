import * as vscode from 'vscode';
import { updateDecorations } from './decorations';
import { createVersionsHoverMenu } from './clients/versions/versionHoverMenu';
import { createPackageDetailsHoverMenu } from './clients/package/packageDetailsHoverMenu';
import { createUpdateCommand } from './clients/versions/updateCommand';
import { getNpmRc } from './clients/util/readnpmfile';

let activeEditorChangeTimeout: NodeJS.Timeout | undefined;

async function activeFileHandler(editor: vscode.TextEditor | undefined, decorationType: vscode.TextEditorDecorationType) {
	if (activeEditorChangeTimeout) {
		clearTimeout(activeEditorChangeTimeout);
	}

	activeEditorChangeTimeout = setTimeout(async () => {
		if (editor) {
			await updateDecorations(editor, decorationType);
		}
		activeEditorChangeTimeout = undefined;
	}, 100);
}

export const decorationType = vscode.window.createTextEditorDecorationType({
	after: {
		margin: '0 0 0 1em',
		color: new vscode.ThemeColor('editorCodeLens.foreground')
	}
});

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "tinynpm" is now active!');
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		for (const folder of workspaceFolders) {
			const workspaceRoot = folder.uri.fsPath;
			await getNpmRc(workspaceRoot);
		}
	}

	const editor = vscode.window.activeTextEditor;
	await activeFileHandler(editor, decorationType);

	const disposable = vscode.window.onDidChangeActiveTextEditor(async editor => {
		await activeFileHandler(editor, decorationType);
	});

	const watcher = vscode.workspace.createFileSystemWatcher('**/package.json');
	watcher.onDidChange(async uri => {
		await activeFileHandler(editor, decorationType);
	});

	context.subscriptions.push(watcher, disposable, createVersionsHoverMenu(), createPackageDetailsHoverMenu(), createUpdateCommand());
}

export function deactivate() {}
