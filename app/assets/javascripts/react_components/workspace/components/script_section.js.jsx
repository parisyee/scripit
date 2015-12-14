var ScriptSection = React.createClass({
  NEW_ELEMENT_SEQUENCE_MAP: {
    "heading": "action",
    "action": "character",
    "character": "dialogue",
    "dialogue": "character"
  },

  getInitialState: function() {
    return { section: this.props.section };
  },

  onSectionChange: function() {
    this.props.onSectionChange(this.props.index, this.state.section)
  },

  handleSectionDetailsChange: function() {
    var section = this.state.section;
    section.title = this.refs.title.value;
    section.notes = this.refs.notes.value;

    this.setState({ section: section }, this.onSectionChange)
  },

  // consider moving these into en ElementList
  handleElementChange: function(index, element) {
    this.setState(function(oldState) {
      var section = oldState.section;
      section.elements.splice(index, 1, element);

      return { section: section };
    }, this.onSectionChange);
  },

  createElement: function(index) {
    var nextIndex = index + 1;
    var nextType = this.NEW_ELEMENT_SEQUENCE_MAP[this.state.section.elements[index].type];
    var nextElement = { type: nextType, text: "" };

    this.setState(function(oldState) {
      var elements = oldState.section.elements.concat([]);
      elements.splice(nextIndex, 0, nextElement)

      return { section:  { elements: elements } };
    }, function() {
      this.focusOnElement(nextIndex);
    });
  },

  removeElement: function(index) {
    if (index > 0) {
      var previousIndex = index - 1;
      var placeCaretAtEnd = this.placeCaretAtEnd;
      var onSectionChange = this.onSectionChange;

      this.setState(function(oldState) {
        var elements = oldState.section.elements.concat([]);
        elements.splice(index, 1);

        return { section:  { elements: elements } };
      }, function() {
        this.focusOnElement(previousIndex, function() {
          placeCaretAtEnd(previousIndex);
          onSectionChange();
        });
      });
    }
  },

  focusOnElement: function(index, callback) {
    var elementId = this.state.section.elements[index].type + "-" + index;
    $("#" + elementId).focus();

    if (callback) {
      callback();
    }
  },

  placeCaretAtEnd: function(index) {
    var elementId = this.state.section.elements[index].type + "-" + index;
    var el = document.getElementById(elementId);

    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
          var range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
          var textRange = document.body.createTextRange();
          textRange.moveToElementText(el);
          textRange.collapse(false);
          textRange.select();
        }
  },

  elementNodes: function() {
    var nodes = this.state.section.elements.map(function(element, i) {
      return (
        <div className="uk-margin-left uk-margin-right">
          <ScriptElement
            key={i}
            index={i}
            element={element}
            onElementChange={this.handleElementChange}
            onElementCreated={this.createElement}
            onElementRemoved={this.removeElement} />
        </div>
      );
    }.bind(this));

    return nodes;
  },

  render: function() {
    return (
      <div className="script-section uk-grid uk-grid-collapse">
        <div className="section-elements uk-width-1-2" style={ { background: "lightgrey" } }>
          {this.elementNodes()}
        </div>
        <div className="section-details uk-width-1-2" style={ { background: "purple" } }>
          <form className="uk-form">
            <input
              className="uk-width-1-1 uk-margin-small-bottom"
              ref="title"
              value={this.state.section.title}
              onInput={this.handleSectionDetailsChange} />
            <textarea
              className="uk-width-1-1"
              ref="notes"
              onInput={this.handleSectionDetailsChange}
              value={this.state.section.notes}></textarea>
          </form>
        </div>
      </div>
    );
  }
});
