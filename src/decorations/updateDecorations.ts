import type { DecorationOptions, TextEditor, TextEditorDecorationType } from "vscode";
import { processDependencies } from "./processDependencies.js";
import { fetchPackages } from "../packageRequests/fetchPackages.js";

export async function updateDecorations(editor: TextEditor, decorationType: TextEditorDecorationType) {
	const document = editor.document;

	if (!document.fileName.endsWith('package.json')) {
		editor.setDecorations(decorationType, []);
		return;
	}

	const text = document.getText();
	const decorations: DecorationOptions[] = [];

	try {
		const pacakgeJson = JSON.parse(text);
		if (pacakgeJson.dependencies) {
            await fetchPackages(Object.keys(pacakgeJson.dependencies));
			processDependencies(document, text, pacakgeJson.dependencies, decorations);
		}
		if (pacakgeJson.devDependencies) {
            await fetchPackages(Object.keys(pacakgeJson.devDependencies));
			processDependencies(document, text, pacakgeJson.devDependencies, decorations);
		}

		editor.setDecorations(decorationType, decorations);
	} catch (e) {
		editor.setDecorations(decorationType, []);
	}
}
