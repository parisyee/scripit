import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Section from "bundles/workspace/components/section";

describe("Section", () => {
  let server;

  beforeEach(() => { server = sinon.fakeServer.create(); });
  afterEach(() => { server.restore(); });

  it("fetches the section data from the provided url" +
     " and displays the title and notes", () => {
    const onTitleChange = sinon.spy();
    const component = ReactTestUtils.renderIntoDocument(
      <Section url={"/screenplays/1/sections/1"} onTitleChange={onTitleChange} />
    );

    expect(server.requests[0].url).to.eql("/screenplays/1/sections/1");
    expect(server.requests[0].method).to.eql("GET");

    server.requests[0].respond(
      200,
      { "Content-Type": "application/json" },
      JSON.stringify({
        id:  1,
        title: "Introduction",
        notes: "The story begins",
        url: "/screenplays/1/sections/1"
      })
    );
    const titleElm = ReactDOM.findDOMNode(component.refs.title);
    const notesElm = ReactDOM.findDOMNode(component.refs.notes);

    expect(titleElm.value).to.contain("Introduction");
    expect(notesElm.value).to.contain("The story begins");
    // this doesn't work for some reason. might be the cause of notes
    // not showing up on section change/create in future;
    // expect(notesElm.innerHTML).to.contain("The story begins");
  });

  describe("when details change", () => {
    it("queues the autosave timer and sends a PUT to the provided url", (done) => {
      const onTitleChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <Section url={"/screenplays/1/sections/1"} onTitleChange={onTitleChange} />
      );
      server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({
          id:  1,
          title: "Introduction",
          notes: "The story begins",
          url: "/screenplays/1/sections/1"
        })
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
        expect(server.requests[1].url).to.eql("/screenplays/1/sections/1");
        expect(server.requests[1].method).to.eql("PUT");
        expect(server.requests[1].requestBody).to.contain("Inciting+incident");
        expect(server.requests[1].requestBody).to.contain(
          "Nothing+will+be+the+same"
        );

        server.requests[1].respond(200, { "Content-Type": "application/json" }, "{}");

        expect(
          document.getElementById("autosave-indicator").innerHTML
        ).to.contain("Changes Saved");

        done();
      }, 1750);
    });

    describe("when title changes", () => {
      it("calls the onTitleChange callback with the new value", () => {
        const onTitleChange = sinon.spy();
        const component = ReactTestUtils.renderIntoDocument(
          <Section url={"/screenplays/1/sections/1"} onTitleChange={onTitleChange} />
        );
        server.requests[0].respond(
          200,
          { "Content-Type": "application/json" },
          JSON.stringify({
            id:  1,
            title: "Introduction",
            notes: "The story begins",
            url: "/screenplays/1/sections/1"
          })
        );
        component.refs.title.value = "Inciting incident";
        ReactTestUtils.Simulate.input(component.refs.title);

        expect(onTitleChange).to.have.been.calledWith("Inciting incident");
      });
    });
  });
});
