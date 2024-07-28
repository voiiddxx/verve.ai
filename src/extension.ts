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
            const langId = editor.document.languageId;
            const selection = editor.selection;
            if (selection) {
                const selectionText = editor.document.getText(selection);
                if (selectionText) {
                    try {
                        const explainResponse = await explainCodeService(selectionText);
                        if (explainResponse) {
                            const finalResult =  commentResponse(explainResponse , langId);
                            await editor.edit(editBuilder => {
                                editBuilder.insert(selection.end, `${finalResult}`);
                            });
                        } else {
                            vscode.window.showInformationMessage("Error " + "Some issue encountered , please try again");
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
        vscode.window.showInformationMessage("verve.ai is working on your requirement , please wait!");
    
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const langId = editor.document.languageId;
            const selection = editor.selection;
            if (selection) {
                const selectionText = editor.document.getText(selection);
                if (selectionText) {
                    try {
                        const explainResponse = await fixCodeService(selectionText);
                        if (explainResponse) {
                            const finalResult = commentResponse(explainResponse , langId);
                            const cleanedResponse = cleanResponse(explainResponse)
                            await editor.edit(editBuilder => {
                                editBuilder.replace(selection, cleanedResponse );
                            });
                            vscode.window.showInformationMessage("Solution applied successfully!");
                        } else {
                            vscode.window.showInformationMessage("Error: Some issue encountered, please try again");
                        }
                    } catch (e) {
                        console.error("Failed to apply solution: ", e);
                        vscode.window.showInformationMessage("Error: Failed to apply solution, please check the console for details.");
                    }
                } else {
                    vscode.window.showInformationMessage("Please select some text to apply the solution.");
                }
            } else {
                vscode.window.showInformationMessage("Please select some text to continue.");
            }
        } else {
            console.log("No active editor found!");
            vscode.window.showInformationMessage("No active editor found.");
        }
    });
    

    // find error
    let findErrorCommand = vscode.commands.registerCommand('verve-ai.findError', async () => {
        vscode.window.showInformationMessage("verve.ai is working on your requirement , please wait!");
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const langId = editor.document.languageId;
            const selection = editor.selection;
            if (selection) {
                const selectionText = editor.document.getText(selection);
                if (selectionText) {
                    try {
                        const explainResponse = await findErrorService(selectionText);
                        if (explainResponse) {
                            const finalResult = commentResponse(explainResponse, langId,);
                            await editor.edit(editBuilder => {
                                editBuilder.insert(selection.end, finalResult);
                            });
                        } else {
                            vscode.window.showInformationMessage("Error " + "Some issue encountered , please try again");
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



        // Genreate Code
        let genreateCommand = vscode.commands.registerCommand('verve-ai.genreateCode', async () => {
            vscode.window.showInformationMessage("verve.ai is working on your requirement , please wait!");
        
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const langId = editor.document.languageId;
                const selection = editor.selection;
                if (selection) {
                    const selectionText = editor.document.getText(selection);
                    if (selectionText) {
                        try {
                            const explainResponse = await genreateCodeService(selectionText);
                            if (explainResponse) {
                                const finalResult = commentResponse(explainResponse , langId);
                                const cleanedResponse = cleanResponse(explainResponse)
                                await editor.edit(editBuilder => {
                                    editBuilder.replace(selection, cleanedResponse );
                                });
                                vscode.window.showInformationMessage("Solution applied successfully!");
                            } else {
                                vscode.window.showInformationMessage("Error: Some issue encountered, please try again");
                            }
                        } catch (e) {
                            console.error("Failed to apply solution: ", e);
                            vscode.window.showInformationMessage("Error: Failed to apply solution, please check the console for details.");
                        }
                    } else {
                        vscode.window.showInformationMessage("Please select some text to apply the solution.");
                    }
                } else {
                    vscode.window.showInformationMessage("Please select some text to continue.");
                }
            } else {
                console.log("No active editor found!");
                vscode.window.showInformationMessage("No active editor found.");
            }
        });

        // Genreate Code
        let fixGrammerCommand = vscode.commands.registerCommand('verve-ai.fixGrammer', async () => {
            vscode.window.showInformationMessage("verve.ai is working on your requirement , please wait!");
        
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const langId = editor.document.languageId;
                const selection = editor.selection;
                if (selection) {
                    const selectionText = editor.document.getText(selection);
                    if (selectionText) {
                        try {
                            const explainResponse = await checkGrammerService(selectionText);
                            if (explainResponse) {
                                const cleanedResponse = cleanResponse(explainResponse)
                                await editor.edit(editBuilder => {
                                    editBuilder.replace(selection, cleanedResponse );
                                });
                                vscode.window.showInformationMessage("Solution applied successfully!");
                            } else {
                                vscode.window.showInformationMessage("Error: Some issue encountered, please try again");
                            }
                        } catch (e) {
                            console.error("Failed to apply solution: ", e);
                            vscode.window.showInformationMessage("Error: Failed to apply solution, please check the console for details.");
                        }
                    } else {
                        vscode.window.showInformationMessage("Please select some text to apply the solution.");
                    }
                } else {
                    vscode.window.showInformationMessage("Please select some text to continue.");
                }
            } else {
                console.log("No active editor found!");
                vscode.window.showInformationMessage("No active editor found.");
            }
        });

    context.subscriptions.push(explainCodeCommand);
    context.subscriptions.push(applySolutionCommand);
    context.subscriptions.push(findErrorCommand);
    context.subscriptions.push(genreateCommand);
    context.subscriptions.push(fixGrammerCommand);
}


const explainCodeService = async (code: string) => {
    const prompt = "Please explain every section of this code: " + code + "make sure to explain the code in such way so it become so convenient to understand the code.";
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.log("Error: ", error);
    }
}


const fixCodeService = async (code: string) => {
    const prompt = `${code} 
    There is some error in this code , please identify all the issues in this code and please fix this code , make sure do not genreate any other output , make sure to genreate only the fix code! , just don't add anything extra return the fixed code only , dont add any language name or comments`
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.log("Error: ", error);
    }
}

const findErrorService = async (code: string) => {
    const prompt = `${code} 
    There is some error in this code , please identify all the issues in this code and tell me that why this cod is not working properly`
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.log("Error: ", error);
    }
}

const genreateCodeService = async  (code : string )=>{
    const prompt = `${code} , make sure you should not give anything extra in output , you must give only genreated code dont add anything extra, `
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.log("Error: ", error);
    }
}


const checkGrammerService =  async(code : string)=>{
    const prompt = `${code} 
    Please fix all the gramatical errors and all the spelling errors`
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.log("Error: ", error);
    }
}

function commentResponse(response: string, languageId: string): string {
    switch (languageId) {
        case 'javascript':
        case 'typescript':
            return `/* ${response} */`;
        case 'python':
            return `# ${response}`;
        case 'html':
            return `<!-- ${response} -->`;
        default:
            return `/* ${response} */`;
    }
}








function cleanResponse(response: string): string {
    // Remove Markdown code block formatting
    return response.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
}



