import * as vscode from 'vscode';
import Sanscript from '@indic-transliteration/sanscript';

let autoTransliterate = true;
let isTransliterating = false;

export function activate(context: vscode.ExtensionContext) {
    console.log('Sanskrit Transliteration Extension Activated!');

    const toggleAutoTransliterate = () => {
        autoTransliterate = !autoTransliterate;
        vscode.window.showInformationMessage(`Automatic transliteration ${autoTransliterate ? 'enabled' : 'disabled'}`);
        statusBarItem.text = `$(symbol-keyword) Sanskrit ${autoTransliterate ? '(Auto)' : ''}`;
    };

    let toggleCommand = vscode.commands.registerCommand('sanskritTransliterate.toggleAuto', toggleAutoTransliterate);

    let manualCommand = vscode.commands.registerCommand(
        'sanskritTransliterate.convertSelection',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('No active editor');
                return;
            }

            const selection = editor.selection;
            const text = editor.document.getText(selection);

            if (text.length === 0) {
                vscode.window.showInformationMessage('Select text to transliterate');
                return;
            }

            const transliterated = Sanscript.t(text, 'hk', 'devanagari');
            
            editor.edit(editBuilder => {
                editBuilder.replace(selection, transliterated);
            });
        }
    );

    let changeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (!autoTransliterate || isTransliterating) return;
        
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) return;

        event.contentChanges.forEach(change => {
            // Trigger on space, newline, or punctuation
            if (change.text === ' ' || change.text === '\n' || /[.,;!?|]/.test(change.text)) {
                const position = change.range.start;
                const line = editor.document.lineAt(position.line);
                
                // Get the text from the start of the line up to the cursor
                const textBeforeCursor = line.text.substring(0, position.character);
                
                // Find the last word before the cursor
                const wordMatch = textBeforeCursor.match(/([a-zA-Z]+)$/);
                
                if (!wordMatch) {
                    return;
                }
                
                const word = wordMatch[1];
                const wordStartIndex = wordMatch.index || (textBeforeCursor.length - word.length);

                const transliterated = Sanscript.t(word, 'hk', 'devanagari');
                
                if (transliterated !== word) {
                    const wordRange = new vscode.Range(
                        position.line, wordStartIndex,
                        position.line, position.character
                    );
                    
                    isTransliterating = true;
                    editor.edit(editBuilder => {
                        editBuilder.replace(wordRange, transliterated);
                    }).then(success => {
                        isTransliterating = false;
                    });
                }
            }
        });
    });

    
    let statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = `$(symbol-keyword) Sanskrit ${autoTransliterate ? '(Auto)' : ''}`;
    statusBarItem.tooltip = "Click to toggle automatic transliteration";
    statusBarItem.command = 'sanskritTransliterate.toggleAuto';
    statusBarItem.show();

    context.subscriptions.push(manualCommand, changeListener, statusBarItem, toggleCommand);
}

export function deactivate() {
    console.log('Sanskrit Transliteration Extension Deactivated');
}
