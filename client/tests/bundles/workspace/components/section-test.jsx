import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Section from "bundles/workspace/components/section";

describe("Section", () => {
  it("displays the title and notes", () => {
    const section = { title: "Introduction", notes: "The story begins" };
    const component = ReactTestUtils.renderIntoDocument(
      <Section section={section} />
    );
    const titleElm = ReactDOM.findDOMNode(component.refs.title);
    const notesElm = ReactDOM.findDOMNode(component.refs.notes);

    expect(titleElm.value).to.contain("Introduction");
    expect(notesElm.innerHTML).to.contain("The story begins");
  });

  describe("when details change", () => {
    let server;

    before(() => { server = sinon.fakeServer.create(); });
    after(() => { server.restore(); });

    it("queues the autosave timer and sends a PUT to the provided url", (done) => {
      const section = {
        title: "Introduction",
        notes: "The story begins",
        url: "/sections/1"
      };
      const component = ReactTestUtils.renderIntoDocument(
        <Section section={section} />
      );
      component.refs.title.value = "Inciting incident";
      component.refs.notes.value = "Nothing will be the same";
      ReactTestUtils.Simulate.input(component.refs.title);
      ReactTestUtils.Simulate.input(component.refs.notes);

      expect(
        document.getElementById("autosave-indicator").innerHTML
      ).to.contain("Unsaved Changes");

      window.setTimeout(() => {
        expect(
          document.getElementById("autosave-indicator").innerHTML
        ).to.contain("Saving Changes");

        expect(server.requests[0].url).to.eql("/sections/1");

        expect(server.requests[0].requestBody).to.contain("Inciting+incident");
        expect(server.requests[0].requestBody).to.contain(
          "Nothing+will+be+the+same"
        );

        server.requests[0].respond(200, { "Content-Type": "application/json" }, "{}");

        expect(
          document.getElementById("autosave-indicator").innerHTML
        ).to.contain("Changes Saved");

        done();
      }, 1750);
    });
  });
});
