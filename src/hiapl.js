
let variableStorage = new Map();



function descriptiveFunctionName(codeblock)
{
	component = codeblock.tagName.toLowerCase();
	// console.log(component)

	switch (component)
	{
		case "hiapl-script":
			for (let childComponent of codeblock.children)
			{
				descriptiveFunctionName(childComponent);
			}
			break;

		case "var":
			name = codeblock.getAttribute("name");

			if (name === null)
			{
				throw "Variable doesnt have a name";
			}

			if (typeof name !== 'string')
			{
				throw "Variable name must be a string!";
			}

			if (codeblock.children.length != 1)
			{
				throw `Variable ${name} only accepts 1 value, not ${codeblock.children.length}`;
			}

			val = descriptiveFunctionName(codeblock.children[0]);

			if (val === undefined)
			{
				throw `Variable ${name} has an undefined value`
			}

			variableStorage.set(name, val);
			break;

		case "ref":
			varName = codeblock.innerHTML;
			if (variableStorage.get(varName) === undefined)
			{
				throw `Variable ${varName} does not exist`
			}
			return variableStorage.get(varName);

		case "print":
			for (let childComponent of codeblock.children)
			{
				val = descriptiveFunctionName(childComponent);
				console.log(val);
			}
			break;

		case "int":
			num = parseInt(codeblock.innerHTML);
			if (isNaN(num))
			{
				throw `${codeblock.innerHTML} is not a valid integer`
			}
			return num;

		case "float":
			num = parseFloat(codeblock.innerHTML);
			if (isNaN(num))
			{
				throw `${codeblock.innerHTML} is not a valid float`
			}
			return num;

		case "str":
			string = codeblock.innerHTML;
			return string;

		case "sum":
			if (codeblock.children.length < 2)
			{
				throw `sum takes 2 or more parameters, not ${codeblock.children.length}`
			}

			let total = descriptiveFunctionName(codeblock.children[0]);
			for (let i=1; i<codeblock.children.length; i++)
			{
				total += descriptiveFunctionName(codeblock.children[i])
			}
			return total;

		case "sub":
			if (codeblock.children.length != 2)
			{
				throw `sub takes 2 parameters, not ${codeblock.children.length}`
			}
			return descriptiveFunctionName(codeblock.children[0]) - descriptiveFunctionName(codeblock.children[1]);

		case "div":
			if (codeblock.children.length != 2)
			{
				throw `div takes 2 parameters, not ${codeblock.children.length}`
			}
			return descriptiveFunctionName(codeblock.children[0]) / descriptiveFunctionName(codeblock.children[1]);


		case "mult":
			if (codeblock.children.length != 2)
			{
				throw `mult takes 2 parameters, not ${codeblock.children.length}`
			}
			return descriptiveFunctionName(codeblock.children[0]) * descriptiveFunctionName(codeblock.children[1]);

		case "mod":
			if (codeblock.children.length != 2)
			{
				throw `mod takes 2 parameters, not ${codeblock.children.length}`
			}
			return descriptiveFunctionName(codeblock.children[0]) % descriptiveFunctionName(codeblock.children[1]);

		case "set-var":
			varName = codeblock.getAttribute("var");
			if (varName === null)
			{
				throw "set-var requires a variable name";
			}
			if (typeof name !== 'string')
			{
				throw "Variable name must be a string!";
			}
			if (variableStorage.get(varName) === undefined)
			{
				throw `Variable ${varName} does not exist`;
			}
			if (codeblock.children.length < 1)
			{
				throw `set-var takes 1 or more parameters, not ${codeblock.children.length}`;
			}
			variableStorage.set(varName, descriptiveFunctionName(codeblock.children[0])); 
			break;

		case "eq":
			if (codeblock.children.length != 2)
			{
				throw `eq takes 2 parameters, not ${codeblock.children.length}`;
			}
			return (descriptiveFunctionName(codeblock.children[0]) == descriptiveFunctionName(codeblock.children[1]))

		case "gt":
			if (codeblock.children.length != 2)
			{
				throw `gt takes 2 parameters, not ${codeblock.children.length}`;
			}
			return (descriptiveFunctionName(codeblock.children[0]) > descriptiveFunctionName(codeblock.children[1]))

		case "lt":
			if (codeblock.children.length != 2)
			{
				throw `lt takes 2 parameters, not ${codeblock.children.length}`;
			}
			return (descriptiveFunctionName(codeblock.children[0]) < descriptiveFunctionName(codeblock.children[1]))

		case "gtoe":
			if (codeblock.children.length != 2)
			{
				throw `gtoe takes 2 parameters, not ${codeblock.children.length}`;
			}
			return (descriptiveFunctionName(codeblock.children[0]) >= descriptiveFunctionName(codeblock.children[1]))

		case "ltoe":
			if (codeblock.children.length != 2)
			{
				throw `ltoe takes 2 parameters, not ${codeblock.children.length}`;
			}
			return (descriptiveFunctionName(codeblock.children[0]) <= descriptiveFunctionName(codeblock.children[1]))


		case "not":
			if (codeblock.children.length != 1)
			{
				throw `not takes 1 parameter, not ${codeblock.children.length}`
			}
			bool = descriptiveFunctionName(codeblock.children[0]);
			if (bool !== false && bool !== true)
			{
				throw `not takes parameter of type boolean, not ${typeof bool}`;
			}
			return !bool;

		case "if":
			if (codeblock.children.length != 2 && codeblock.children.length != 3)
			{
				throw `if takes 2 or 3 parameters, not ${codeblock.children.length}`;
			}
			if (codeblock.children[0].tagName != "COND" || codeblock.children[1].tagName != "DO")
			{
				throw `if takes parameters in order of types COND, DO, ELSE`;
			}

			if (descriptiveFunctionName(codeblock.children[0]))
			{
				descriptiveFunctionName(codeblock.children[1]);
			}
			else if (codeblock.children.length == 3)
			{
				if (codeblock.children[2].tagName != "ELSE")
				{
					throw `if takes parameters in order of types COND, DO, ELSE`;
				}
				descriptiveFunctionName(codeblock.children[2]);
			}
			break;

		case "cond":
			if (codeblock.innerHTML.trim() == "true" || codeblock.innerHTML.trim() == "false")
			{
				return (codeblock.innerHTML.trim() == 'true');
			}
			if (codeblock.children.length != 1)
			{
				throw `cond takes 1 parameter, not ${codeblock.children.length}`;
			}
			bool = descriptiveFunctionName(codeblock.children[0]);
			if (bool !== false && bool !== true)
			{
				throw `cond takes 1 parameter of type boolean, not ${typeof bool}`;
			}
			return bool;

		case "do":
		case "else":
			for (let childComponent of codeblock.children)
			{
				descriptiveFunctionName(childComponent);
			}
			break;

		case "loop":
			if (codeblock.children.length != 2)
			{
				throw `if takes 2 parameters, not ${codeblock.children.length}`;
			}
			if (codeblock.children[0].tagName != "COND" || codeblock.children[1].tagName != "DO")
			{
				throw `loop takes parameters in order of types COND, DO`;
			}

			while (descriptiveFunctionName(codeblock.children[0]))
			{
				descriptiveFunctionName(codeblock.children[1]);
			}
			break;


		default:
			throw `No such instruction ${component}`;
		
	}
}



for (let codeblock of document.querySelectorAll("hiapl-script"))
{
	codeblock.style.display = "none";
	descriptiveFunctionName(codeblock);
}


