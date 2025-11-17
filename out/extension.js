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
let autoTransliterate = true;
let isTransliterating = false;
function activate(context) {
    console.log('Sanskrit Transliteration Extension Activated!');
    const toggleAutoTransliterate = () => {
        autoTransliterate = !autoTransliterate;
        vscode.window.showInformationMessage(`Automatic transliteration ${autoTransliterate ? 'enabled' : 'disabled'}`);
        statusBarItem.text = `$(symbol-keyword) Sanskrit ${autoTransliterate ? '(Auto)' : ''}`;
    };
    let toggleCommand = vscode.commands.registerCommand('sanskritTransliterate.toggleAuto', toggleAutoTransliterate);
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
        const transliterated = sanscript_1.default.t(text, 'hk', 'devanagari');
        editor.edit(editBuilder => {
            editBuilder.replace(selection, transliterated);
        });
    });
    let changeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (!autoTransliterate || isTransliterating)
            return;
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document)
            return;
        event.contentChanges.forEach(change => {
            // Trigger on space, newline, or punctuation
            if (change.text === ' ' || change.text === '\n' || /[.,;!?]/.test(change.text)) {
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
                const transliterated = sanscript_1.default.t(word, 'hk', 'devanagari');
                if (transliterated !== word) {
                    const wordRange = new vscode.Range(position.line, wordStartIndex, position.line, position.character);
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
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = `$(symbol-keyword) Sanskrit ${autoTransliterate ? '(Auto)' : ''}`;
    statusBarItem.tooltip = "Click to toggle automatic transliteration";
    statusBarItem.command = 'sanskritTransliterate.toggleAuto';
    statusBarItem.show();
    context.subscriptions.push(manualCommand, changeListener, statusBarItem, toggleCommand);
}
function deactivate() {
    console.log('Sanskrit Transliteration Extension Deactivated');
}
//# sourceMappingURL=extension.js.map