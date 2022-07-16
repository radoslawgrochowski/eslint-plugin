import { TSESTree } from "@typescript-eslint/utils";
import createRule from "../../create-rule";

type CallExpression = TSESTree.CallExpression

type ValidDescribeNode = CallExpression & { arguments: [{ value: string }, ...any] }
const isValidDescribe = (node: CallExpression): node is ValidDescribeNode => {
  if (!("name" in node.callee)) return false
  if (node.callee.name != "describe") return false
  const argument = node.arguments[0]
  if (!argument) return false
  if (argument.type !== 'Literal') return false
  return true
}

type ValidItNode = CallExpression & { arguments: [{ value: string }, ...any] }
const isValidIt = (node: CallExpression): node is ValidItNode => {
  if (!("name" in node.callee)) return false
  if (node.callee.name != "it") return false
  const argument = node.arguments[0]
  if (!argument) return false
  if (argument.type !== 'Literal') return false
  return true
}

type MessageIds = 'mention'

const rule = createRule<any[], MessageIds>({
  name: 'describe-mentions-component',
  meta: {
    type: "suggestion",
    docs: {
      description: "Ensure description of test case matches name of tested JSX Element or hook",
      recommended: 'error',
    },
    messages: {
      mention: 'Describe should mention usage of testing unit: {{ names }}!',
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const describeStack: ValidDescribeNode[] = []
    const componentNames: string[] = []
    const hookNames: string[] = []
    return {
      CallExpression: (node) => {
        if (isValidDescribe(node)) describeStack.push(node)
        if (isValidIt(node)) {
          componentNames.length = 0
          hookNames.length = 0
        }
      },
      'CallExpression:exit': (node: CallExpression) => {
        if (isValidDescribe(node)) describeStack.pop()
        if (isValidIt(node)) {
          if (!(componentNames.length + hookNames.length)) return
          const full = describeStack.map(x => x.arguments[0].value).join(' ')
          const fullWithPaddigns = ` ${full} `
          const nameVariantions = [
            ...componentNames.flatMap(name => [`<${name}/>`, `<${name} `, ` ${name} `]),
            ...hookNames.flatMap(name => [` ${name} `, ` ${name}(`]),
          ]
          const mention = nameVariantions.some(name => fullWithPaddigns.includes(name))
          if (!mention) {
            const names = [...componentNames, ...hookNames].join(' or ')
            context.report({ node, messageId: 'mention', data: { names } })
          }
        }
      },
      Identifier: (node) => {
        if (node.name.startsWith('use')) {
          hookNames.push(node.name)
        }
      },
      JSXElement: (node) => {
        const identifier = node.openingElement.name
        if (!identifier) return
        const componentName = 'name' in identifier && typeof identifier.name === 'string' && identifier.name
        if (!(componentName)) return
        componentNames.push(componentName)
      },
    };
  },
});

export default rule
