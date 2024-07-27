import * as vscode from 'vscode';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = 'AIzaSyBb4QZ3jFwBVadrnHnQuOyeczaoBNVKrXI';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let solvedCode: string | null = null;

export function activate(context: vscode.ExtensionContext) {

    // explain code
    let explainCodeCommand = vscode.commands.registerCommand('verve-ai.helloWorld', async () => {
        // for checking that command is working or not
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            if (selection) {
                const selectionText = editor.document.getText(selection);
                if (selectionText) {
                    try {
                        const explainResponse = await explainCodeService(selectionText);
                        if(explainResponse){
                            await editor.edit(editBuilder =>{
                                editBuilder.insert(selection.end, `\n\n/*  */\n/* Solution: ${explainResponse} */\n`);
                            });
                        }else{
                            vscode.window.showInformationMessage("Error " + "Some issue encountered , please try again" );
                        }
                    } catch (e) {
                        console.error("failed to explain code: ", e);
                    }
                } else {
                    console.log("Some issue occured!");

                }
            } else {
                vscode.window.showInformationMessage("Please select a code to continue...");

            }
        } else {
            console.log("No Editor Found!");
        }
    });

    // fix code // or add solution
    let applySolutionCommand = vscode.commands.registerCommand('verve-ai.applySolution', async () => {
        vscode.window.showInformationMessage("Hello World! This is apply solution command!");
    });

    // find error
    let findErrorCommand = vscode.commands.registerCommand('verve-ai.findError', async () => {
        vscode.window.showInformationMessage("Hello World! This is find error command!");
    });

    context.subscriptions.push(explainCodeCommand);
    context.subscriptions.push(applySolutionCommand);
    context.subscriptions.push(findErrorCommand);
}

const checkError = async (code: string) => {
    const prompt = `Please explain this code: ${code}`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        console.log("Generated text:", text);
        return text;
    } catch (error) {
        console.error("Error generating content:", error);
    }
};


const explainCodeService =  async (code : string)=>{
    const prompt = "Please explain every section of this code: " + code + "make sure to explain the code in such way so it become so convenient to understand the code.";
    try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            return text;
    } catch (error) {
        console.log("Error: ",error);
    }
}


// vscode.window.showInformationMessage('Hello From the verve.ai server');
//         const editor = vscode.window.activeTextEditor;

//         if (editor) {
//             const selection = editor.selection;
//             const selectedText = editor.document.getText(selection);
//             console.log("Selected text:", selectedText);

//             try {
//                 const data = await checkError(selectedText);
//                 if (data) {
//                     solvedCode = data;
//                     await editor.edit(editorBuilder => {
//                         editorBuilder.insert(selection.end, `\n\n/* Error: "error" */\n/* Solution: ${data} */\n`);
//                     });
//                     vscode.window.showInformationMessage("Error details inserted. Press Tab to apply the solution...");
//                 }
//             } catch (error) {
//                 vscode.window.showErrorMessage(`Failed to process the code: `);
