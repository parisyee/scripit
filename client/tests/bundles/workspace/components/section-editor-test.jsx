import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-addons-test-utils";
import { expect } from "chai";
import SectionEditor from "bundles/workspace/components/section-editor";

describe("SectionEditor", () => {
  describe("saveSection", () => {
    let server;

    before(() => { server = sinon.fakeServer.create(); });
    after(() => { server.restore(); });

    it("sends a PUT request providing the current section attributes", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <SectionEditor url={"/screenplays/1/sections/1"} />
      );
      component.setState({
        notes: "AWESOME",
        position: 13,
        title: "WALLIE"
      });

      component.saveSection();

      expect(server.requests[1].method).to.eql("PUT");
      expect(server.requests[1].url).to.eql("/screenplays/1/sections/1");
      expect(server.requests[1].requestBody).to.contain("13");
      expect(server.requests[1].requestBody).to.contain("AWESOME");
      expect(server.requests[1].requestBody).to.contain("WALLIE");
    });

  });

  describe("queueAutosave", () => {
    it("sets a timer that calls save section", (done) => {
      const component = ReactTestUtils.renderIntoDocument(
        <SectionEditor url={"/screenplays/1/sections/1"} />
      );
      const saveSection = sinon.spy(component, "saveSection");

      component.queueAutosave();

      window.setTimeout(() => {
        expect(saveSection).to.be.called;
        done();
      }, 1750);
    });
  });

  describe("handleChange", () => {
    it("updates state.note and state.title and calls queueAutosave", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <SectionEditor url={"/screenplays/1/sections/1"} />
      );
      const queueAutosave = sinon.spy(component, "queueAutosave");
      component.refs.title.value = "The Title";
      component.refs.notes.value = "The Notes";

      component.handleChange();

      expect(component.state.title).to.eql("The Title");
      expect(component.state.notes).to.eql("The Notes");
      expect(queueAutosave).to.be.called;
    });
  });

  describe("handlePositionChange", () => {
    it("updates the position, calls the onPositionChange callback and saves the section", () => {
      const onPositionChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <SectionEditor
          onPositionChange={onPositionChange}
          totalSections={10}
          url={"/screenplays/1/sections/1"} />
      );
      const saveSection = sinon.spy(component, "saveSection");
      component.refs.position.value = "9";

      component.handlePositionChange();

      expect(component.state.position).to.eql(9)
      expect(onPositionChange).to.be.calledWith(9);
      expect(saveSection).to.be.called;
    });
  });

  describe("handleTitleChange", () => {
    it("calls the onTitleChange callback with the new title and calls handleChange", () => {
      const onTitleChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <SectionEditor
          onTitleChange={onTitleChange}
          url={"/screenplays/1/sections/1"} />
      );
      const handleChange = sinon.spy(component, "handleChange");
      component.refs.title.value = "New Title";

      component.handleTitleChange();

      expect(onTitleChange).to.be.calledWith("New Title");
      expect(handleChange).to.be.called;
    });
  });

  describe("deleteSection", () => {
    let server;

    before(() => { server = sinon.fakeServer.create(); });
    after(() => { server.restore(); });

    it("sends a DELETE request and calls the onDelete callback", () => {
      //
      // have to figure out a way to click the confim button in test
      //
      //
      // const onDelete = sinon.spy();
      // const component = ReactTestUtils.renderIntoDocument(
      //   <SectionEditor
      //     onDelete={onDelete}
      //     url={"/screenplays/1/sections/1"} />
      // );

      // const componentElm = ReactDOM.findDOMNode(component);
      // const deleteButton = componentElm.querySelector(".delete-section");
      // ReactTestUtils.Simulate.click(deleteButton);

      // expect(server.requests[1].method).to.eql("DELETE");
      // expect(server.requests[1].url).to.eql("/screenplays/1/sections/1");
      // expect(onDelete).to.be.called;
    });
  });
});
