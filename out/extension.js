"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const sanscript_1 = __importDefault(require("@indic-transliteration/sanscript"));
let isTransliterating = false;
function activate(context) {
    console.log('Sanskrit Transliteration Extension Activated!'); // Add this
    let manualCommand = vscode.commands.registerCommand('sanskritTransliterate.convertSelection', () => {
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
        const transliterated = sanscript_1.default.t(text, 'hk', 'devanagari');
        console.log('Transliterated text:', transliterated); // Add this
        editor.edit(editBuilder => {
            editBuilder.replace(selection, transliterated);
        });
    });
    let changeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (isTransliterating)
            return;
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document)
            return;
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
            if (change.text.length === 0)
                return;
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
                const transliterated = sanscript_1.default.t(word, 'hk', 'devanagari');
                console.log('Transliterated word:', transliterated); // Add this
                if (transliterated !== word) {
                    isTransliterating = true;
                    editor.edit(editBuilder => {
                        const wordRange = new vscode.Range(position.line, wordStartChar, position.line, cursorOffset - change.text.length);
                        editBuilder.replace(wordRange, transliterated);
                    }).then(() => {
                        isTransliterating = false;
                        console.log('Replacement complete'); // Add this
                    });
                }
            }
        });
    });
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(symbol-keyword) Sanskrit";
    statusBarItem.tooltip = "Click to transliterate selection";
    statusBarItem.command = 'sanskritTransliterate.convertSelection';
    statusBarItem.show();
    context.subscriptions.push(manualCommand, changeListener, statusBarItem);
}
function deactivate() {
    console.log('Sanskrit Transliteration Extension Deactivated');
}
//# sourceMappingURL=extension.js.map