import * as vscode from 'vscode';
import Sanscript from '@indic-transliteration/sanscript';

let isTransliterating = false;

export function activate(context: vscode.ExtensionContext) {
    console.log('Sanskrit Transliteration Extension Activated!'); // Add this
    
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

            console.log('Input text:', text); // Add this
            const transliterated = Sanscript.t(text, 'hk', 'devanagari');
            console.log('Transliterated text:', transliterated); // Add this
            
            editor.edit(editBuilder => {
                editBuilder.replace(selection, transliterated);
            });
        }
    );

    let changeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (isTransliterating) return;
        
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) return;

        console.log('Text changed event fired'); // Add this

        const languageId = editor.document.languageId;
        const fileName = editor.document.fileName;
        
        console.log('Language:', languageId, 'File:', fileName); // Add this
        
        if (!['plaintext', 'markdown'].includes(languageId) && 
            !fileName.endsWith('.san') && 
            !fileName.endsWith('.sanskrit')) {
            console.log('Skipping - not a supported file type'); // Add this
            return;
        }

        event.contentChanges.forEach(change => {
            console.log('Change detected:', change.text); // Add this
            
            if (change.text.length === 0) return;
            
            const position = change.range.start;
            const line = editor.document.lineAt(position.line);
            const lineText = line.text;
            
            const cursorOffset = position.character + change.text.length;
            const textBeforeCursor = lineText.substring(0, cursorOffset);
            const wordMatch = textBeforeCursor.match(/[a-zA-Z]+$/);
            
            if (!wordMatch) {
                console.log('No word match found'); // Add this
                return;
            }
            
            const word = wordMatch[0];
            console.log('Word to transliterate:', word); // Add this
            
            const wordStartChar = cursorOffset - word.length;
            
            if (change.text === ' ' || change.text === '\n' || 
                /[.,;!?]/.test(change.text)) {
                
                const transliterated = Sanscript.t(word, 'hk', 'devanagari');
                console.log('Transliterated word:', transliterated); // Add this
                
                if (transliterated !== word) {
                    isTransliterating = true;
                    
                    editor.edit(editBuilder => {
                        const wordRange = new vscode.Range(
                            position.line, wordStartChar,
                            position.line, cursorOffset - change.text.length
                        );
                        editBuilder.replace(wordRange, transliterated);
                    }).then(() => {
                        isTransliterating = false;
                        console.log('Replacement complete'); // Add this
                    });
                }
            }
        });
    });

    let statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right, 
        100
    );
    statusBarItem.text = "$(symbol-keyword) Sanskrit";
    statusBarItem.tooltip = "Click to transliterate selection";
    statusBarItem.command = 'sanskritTransliterate.convertSelection';
    statusBarItem.show();

    context.subscriptions.push(manualCommand, changeListener, statusBarItem);
}

export function deactivate() {
    console.log('Sanskrit Transliteration Extension Deactivated');
}
