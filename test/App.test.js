import App from "../src/App";
import {mount} from "@vue/test-utils";

describe("App.test.js", () => {

  const appWrapper = mount(App, {
    mocks: {
      $isPc: () => true
    }
  })

  it('equals messages to testaddress', () => {
    expect(appWrapper.html()).toContain(`<div id="app">`);
  });
});
