import * as vscode from 'vscode';
import { updateDecorations } from './decorations';
import { createVersionsHoverMenu } from './clients/versions/versionHoverMenu';

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

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "tinynpm" is now active!');
	const decorationType = vscode.window.createTextEditorDecorationType({
		after: {
			margin: '0 0 0 1em',
			color: new vscode.ThemeColor('editorCodeLens.foreground')
		}
	});

	const editor = vscode.window.activeTextEditor;
	await activeFileHandler(editor, decorationType);

	const disposable = vscode.window.onDidChangeActiveTextEditor(async editor => {
		await activeFileHandler(editor, decorationType);
	});


	context.subscriptions.push(disposable, createVersionsHoverMenu());
}

export function deactivate() {}
