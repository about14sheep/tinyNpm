import { commands, Position, Range, window } from "vscode";
import { updateDecorations } from "../../decorations";
import { decorationType } from "../../extension";

export function createUpdateCommand() {
    return commands.registerCommand(
        'tinynpm.updateVersion',
        async (packageName: string, newVersion: string, line: number, key: number) => {
            const editor = window.activeTextEditor;
            if (!editor || !editor.document.fileName.endsWith('package.json')) {
                window.showErrorMessage('Please open package.json');
                return;
            }

            const document = editor.document;
            const lineText = document.lineAt(line).text;
            const versionMatch = lineText.match(/"([^"]+)"\s*:\s*"([^"]+)"/); 
            if (!versionMatch) {
                window.showErrorMessage('Could not find version to update');
                return;
            }

            const [, pkg, oldVersion] = versionMatch;

            const startIndex = lineText.indexOf(oldVersion);
            const range = new Range(
                new Position(line, startIndex),
                new Position(line, startIndex + oldVersion.length)
            );

            await editor.edit(editBuilder => {
                editBuilder.replace(range, newVersion);
            });

            await updateDecorations(editor, decorationType);
            await commands.executeCommand('closeParameterHints');
            await commands.executeCommand('closeMarkersNavigation');
      
            await window.showTextDocument(editor.document, {
                viewColumn: editor.viewColumn,
                preserveFocus: false
            });
        }
    );
}