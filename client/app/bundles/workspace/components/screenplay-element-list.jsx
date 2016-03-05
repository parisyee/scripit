import React, { PropTypes } from "react";
import Uuid from "uuid-v4";
import $ from "jquery";
import ScreenplayElement from "./screenplay-element";

export default React.createClass({
  ELEMENT_TYPES: {
    action: "action",
    character: "character",
    dialogue: "dialogue",
    heading: "heading",
    parenthetical: "parenthetical",
    transition: "transition"
  },

  ELEMENT_SEQUENCE_MAP: {
    "heading": "action",
    "action": "action",
    "character": "dialogue",
    "dialogue": "character",
    "parenthetical": "dialogue",
    "transition": "heading"
  },


  propTypes: {
    url: PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      currentElementIndex: 0,
      elements: [{type: "heading", text: "", uuid: Uuid() }]
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      method: "GET",
      dataType: "json",
      success: ((data) => {
        const elements = JSON.parse(data.elements)
        if(elements.length > 0) {
          elements.forEach((e) => { e.uuid = Uuid() });
          this.setState({
            elements: elements
          });
        }
      }).bind(this),
      error: ((xhr, status, error) => {
        console.log(error);
      })
    });
  },

  saveElementList: function() {
    $.ajax({
      url: this.props.url,
      method: "PUT",
      data: {
        element_list: {
          elements: JSON.stringify(this.state.elements)
        }
      },
      dataType: "json",
      success: ((data) => {
        $("#autosave-indicator").removeClass("saving").addClass("saved");
      }).bind(this),
      error: (xhr, status, err) => {
        console.log(err);
        $("#autosave-indicator").removeClass("saving").addClass("error");
      }
    });
  },

  queueAutosave: function() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    $("#autosave-indicator").removeClass("saved").addClass("saving");

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveElementList();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 1750);
  },

  nextElementTypeAfter: function(type) {
    return this.ELEMENT_SEQUENCE_MAP[type];
  },

  handleCurrentElementChange: function(element) {
    this.setState((oldState) => {
      const elements = oldState.elements;
      elements.splice(oldState.currentElementIndex, 1, element);
      return { elements: elements };
    }, () => {
      this.queueAutosave();
    });
  },

  insertElementAfterCurrent: function(newText) {
    this.setState((oldState) => {
      const elements = oldState.elements;
      const currentElement = elements[oldState.currentElementIndex];
      const newIndex = oldState.currentElementIndex + 1;
      const newType = this.nextElementTypeAfter(currentElement.type);
      let newElement = { text: newText, type: newType, uuid: Uuid() };
      elements.splice(newIndex, 0, newElement);
      return { elements: elements, currentElementIndex: newIndex }
    }, () => {
      this.focusOnCurrentElement();
      this.queueAutosave();
    });
  },

  removeCurrentElement: function(orphanedText) {
    if (this.state.currentElementIndex > 0) {
      this.setState((oldState) => {
        const elements = oldState.elements;
        const newIndex = oldState.currentElementIndex - 1;
        elements.splice(oldState.currentElementIndex, 1);
        return { elements: elements, currentElementIndex: newIndex };
      }, () => {
        this.currentElement().appendNewTextToCurrent(orphanedText);
        this.queueAutosave();
      });
    }
  },

  currentElementRef: function(index) {
    return `screenplay-element-${index}`;
  },

  currentElement: function() {
    return this.refs[this.currentElementRef(this.state.currentElementIndex)];
  },

  focusOnCurrentElement: function() {
    this.currentElement().refs.displayInput.focus();
  },

  handleElementFocus: function(index) {
    this.setState({ currentElementIndex: index }, this.focusOnCurrentElement);
  },

  renderElements: function() {
    const currentElementRef = this.currentElementRef;
    const handleCurrentElementChange = this.handleCurrentElementChange;
    const handleElementFocus = this.handleElementFocus;
    const insertElementAfterCurrent = this.insertElementAfterCurrent;
    const removeCurrentElement = this.removeCurrentElement;

    const nodes = this.state.elements.map((element, i) => {
      const ref = currentElementRef(i);
      return (
        <ScreenplayElement
          element={element}
          index={i}
          key={element.uuid}
          onElementChange={handleCurrentElementChange}
          onElementFocus={handleElementFocus}
          ref={ref}
          triggerElementInsert={insertElementAfterCurrent}
          triggerElementRemove={removeCurrentElement}
        />
      );
    });

    return nodes;
  },

  render: function() {
    return(
      <div className="screenplay-element-list">
        {this.renderElements()}
      </div>
    );
  }
})

