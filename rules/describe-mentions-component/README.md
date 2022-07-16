# describe-mentions-component

## Rule Details

This rule aims to force mention of component's or hook's name in `describe` function as unit described in tests.

Examples of **incorrect** code for this rule:

```js
describe("Description unrelated to name of the component", () => {
  it("renders", () => {
    render(<SomeOtherComponent />);
  });
});
```

Examples of **correct** code for this rule:

```js
describe("SomeComponent", () => {
  it("renders", () => {
    render(<SomeComponent />);
  });
});

describe("<SomeComponent /> #unit #calendar-module", () => {
  it("renders", () => {
    render(<SomeComponent />);
  });
});

describe("SomeComponent", () => {
  describe("when it's sunday", () => {
    it("renders", () => {
      myRenderingFramework(<SomeComponent />);
    });
  });
});

describe("my cool components for making things", () => {
  describe("SomeComponent", () => {
    it("renders", () => {
      render(<SomeComponent />);
    });
  });
});
```

