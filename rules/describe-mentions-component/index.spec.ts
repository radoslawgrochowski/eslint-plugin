import rule from '.'
import { ESLintUtils } from '@typescript-eslint/utils'

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaFeatures: { jsx: true } }
})

ruleTester.run('describe-mentions-component', rule, {
  valid: [
    `describe("something", () => {
       it("does something", () => {
         expect(true).toBe(true)
       })
     })`,
    `describe("Foo", () => {
       it("renders", () => {
         render(<Foo />) 
       })
     })`,
    `describe("<Foo />", () => {
       it("renders", () => {
         render(<Foo />) 
       })
     })`,
    `describe("<Foo />", () => {
       it("renders", () => {
         render(<Foo />) 
       })
     })`,
    `describe("my tests", () => {
       describe("Foo", () => {
         it("renders", () => {
           render(<Foo />) 
         })
       })
     })`,
    `describe("Foo", () => {
       it("renders", () => {
         render(<Foo />, {wrapper: ({children}) => <Bar>{children}</Bar>}) 
       })
     })`,
    `describe("Foo", () => {
       it("renders", () => {
         const wrapper = ({children}) => <Bar>{children}</Bar>
         render(<Foo />, {wrapper}) 
       })
     })`,
    `describe("Bar", () => {
       it("renders", () => {
         const wrapper = ({children}) => <Bar>{children}</Bar>
         render(<Foo />, {wrapper}) 
       })
     })`,
    `describe("foo", () => {
       beforeEach(() => {
        const wrapper = ({children}) => <Bar>{children}</Bar>
       })
       it("sums", () => {
         const x = 1 + 1
       })
     })`,
    `describe("useFoo", () => {
       it("sums", () => {
         renderHook(useFoo, {wrapper: ({children}) => <Bar>{children}</Bar>})
       })
     })`,
    `describe("useFoo()", () => {
       it("sums", () => {
         renderHook(useFoo, {wrapper: ({children}) => <Bar>{children}</Bar>})
       })
     })`,
  ],
  invalid: [
    {
      code: `
        describe("Foo", () => {
          it("renders", () => {
            render(<Bar />) 
          })
        })
      `,
      errors: [{ messageId: 'mention', }],
    },
    {
      code: `
        describe("FOo", () => {
          it("renders", () => {
            render(<Foo />) 
          })
        })
      `,
      errors: [{ messageId: 'mention', }],
    },
    {
      code: `
        describe("FooBar", () => {
          it("renders", () => {
            render(<Foo />) 
          })
        })
      `,
      errors: [{ messageId: 'mention', }],
    },
    {
      code: `
        describe("NotFoo", () => {
          it("renders", () => {
            render(<Foo />) 
          })
        })
      `,
      errors: [{ messageId: 'mention', }],
    },
    {
      code: `
        describe("useFooOrBar", () => {
          it("does somehting", () => {
            renderHook(useFoo)
          })
        })
      `,
      errors: [{ messageId: 'mention', }],
    }
  ],
})
