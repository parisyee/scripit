var ElementList = React.createClass({
  NEW_ELEMENT_SEQUENCE_MAP: {
    "heading": "action",
    "action": "action",
    "character": "dialogue",
    "dialogue": "character",
    "transition": "heading",
    "parenthetical": "dialogue"
  },

  getInitialState: function() {
    return { elements: this.props.elements };
  },

  onElementListChange: function() {
    this.props.onElementListChange(this.state.elements);
  },

  handleElementChange: function(index, element) {
    this.setState(function(oldState) {
      var elements = oldState.elements;
      elements.splice(index, 1, element);

      return { elements: elements };
    }, this.onElementListChange);
  },

  createElement: function(index) {
    var nextIndex = index + 1;
    var nextType = this.NEW_ELEMENT_SEQUENCE_MAP[this.state.elements[index].type];
    var nextElement = { type: nextType, text: "" };

    this.setState(function(oldState) {
      var elements = oldState.elements.concat([]);
      elements.splice(nextIndex, 0, nextElement)

      return { elements: elements };
    }, function() {
      this.focusOnElement(nextIndex);
    });
  },

  removeElement: function(index) {
    if (index > 0) {
      var previousIndex = index - 1;
      var placeCaretAtEnd = this.placeCaretAtEnd;
      var onElementListChange = this.onElementListChange;

      this.setState(function(oldState) {
        var elements = oldState.elements.concat([]);
        elements.splice(index, 1);

        return { elements: elements };
      }, function() {
        this.focusOnElement(previousIndex, function() {
          placeCaretAtEnd(previousIndex);
          onElementListChange();
        });
      });
    }
  },

  focusOnElement: function(index, callback) {
    var displayedField = $(ReactDOM.findDOMNode(this).children[index]).find(".displayedField")
    displayedField.focus();

    if (callback) {
      callback();
    }
  },

  placeCaretAtEnd: function(index) {
    var el = ReactDOM.findDOMNode(this).children[index].getElementsByClassName("displayedField")[0];

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
    var nodes = this.state.elements.map(function(element, i) {
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
      <div className="element-list">
        {this.elementNodes()}
      </div>
    );
  }
});
