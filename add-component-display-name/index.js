module.exports = function (file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    // checking for default exports and name
    const exportDefaultDeclaration = root.find(j.ExportDefaultDeclaration);
    const pathToExportDefault = exportDefaultDeclaration.paths()[0];
    const identifierName = exportDefaultDeclaration.find(j.Identifier).get(0).node.name;

    // checking if displayName property already exists
    const displayNameExpressions = root.find(j.MemberExpression, {
        object: { type: "Identifier", name: identifierName },
        property: { type: "Identifier", name: "displayName" }
    });

    if (displayNameExpressions.length > 0) return;

    let isJSXFunction = false;

    // Checking for arrow functions with export default name
    const identifierArrowFunc = root.find(j.VariableDeclaration).filter((path) => {
        return path.value.declarations.some(
            (declarator) => declarator.id.name === identifierName && declarator.init.type == "ArrowFunctionExpression"
        );
    });

    // Checking if the arrow function return JSXElement
    identifierArrowFunc.forEach((path) => {
        let returnType =
            path.value.declarations?.[0].init.body.body.filter((node) => node.type === "ReturnStatement")?.[0]?.argument?.type ??
            null;
        if (returnType === "JSXElement") isJSXFunction = true;
    });

    // Checking for function declarations with export default name and returning JSXElement
    const identifierFuncDeclare = root.find(j.FunctionDeclaration).filter((path) => {
        let returnType = path.value.body.body.filter((node) => node.type === "ReturnStatement")?.[0]?.argument?.type ?? null;
        return path.value.id.name == identifierName && returnType === "JSXElement" && path.value.type === "FunctionDeclaration";
    });

    if (identifierFuncDeclare.length) isJSXFunction = true;

    if (isJSXFunction) {
        const newLine = `${identifierName}.displayName = "${identifierName}";`;
        j(pathToExportDefault).insertBefore(newLine);
    }
    return root.toSource();
};
