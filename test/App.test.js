import Vue from "vue";
import App from "../src/App";
import BitcoinjTools from "../src/components/BitcoinjTools";

describe("App.test.js", () => {
  let cmp, vm;

  beforeEach(() => {
    cmp = Vue.extend(BitcoinjTools); // Create a copy of the original component
    vm = new cmp({
      data: {
        // Replace data value with this fake data
        address: 'asfdaewfawef'
      }
    }).$mount(); // Instances and mounts the component
  });

  it('equals messages to ["Cat"]', () => {
    expect(vm.address).toEqual('asfdaewfawef');
  });
});
