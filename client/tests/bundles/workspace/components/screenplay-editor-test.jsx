import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-addons-test-utils";
import { expect } from "chai";
import ScreenplayEditor from "bundles/workspace/components/screenplay-editor";

describe("ScreenplayEditor", () => {
  describe("title input", () => {
    it("displays the screenplay's title or 'Untitled' if blank", () => {
      const screenplay = { sections: [] };
      let component;
      let componentElm;
      let inputElm;

      screenplay.title = "";
      component = ReactTestUtils.renderIntoDocument(
        <ScreenplayEditor screenplay={screenplay} url="/screenplay" />
      );
      componentElm = ReactDOM.findDOMNode(component);
      inputElm = componentElm.querySelectorAll("input")[0];

      expect(inputElm.value).to.contain("Untitled");

      screenplay.title = "Screenplay 1";
      component = ReactTestUtils.renderIntoDocument(
        <ScreenplayEditor screenplay={screenplay} url="/screenplay" />
      );
      componentElm = ReactDOM.findDOMNode(component);
      inputElm = componentElm.querySelectorAll("input")[0];

      expect(inputElm.value).to.contain("Screenplay 1");
    });
  });

  describe("when title changes", () => {
    let server;

    before(() => { server = sinon.fakeServer.create(); });
    after(() => { server.restore(); });

    it("queues the autosave timer and sends a PUT to the provided url", (done) => {
      const screenplay = { url: "/screenplay/1", sections: [] };
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayEditor screenplay={screenplay} />
      );
      const componentElm = ReactDOM.findDOMNode(component);
      const input = component.refs.title;

      input.value = "New Screenplay";
      ReactTestUtils.Simulate.change(input);

      expect(
        document.getElementById("autosave-indicator").innerHTML
      ).to.contain("Unsaved Changes");

      window.setTimeout(() => {
        expect(
          document.getElementById("autosave-indicator").innerHTML
        ).to.contain("Saving Changes");

        expect(server.requests[0].method).to.eql("PUT");
        expect(server.requests[0].url).to.eql("/screenplay/1");

        server.requests[0].respond(200, { "Content-Type": "application/json" }, "{}");

        expect(
          document.getElementById("autosave-indicator").innerHTML
        ).to.contain("Changes Saved");

        done();
      }, 1750);
    });
  });
});
