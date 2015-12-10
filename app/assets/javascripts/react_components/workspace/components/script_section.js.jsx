var ScriptSection = React.createClass({
  NEW_ELEMENT_SEQUENCE_MAP: {
    "heading": "action",
    "action": "character",
    "character": "dialogue",
    "dialogue": "heading"
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

  handleElementChange: function(index, element) {
    this.setState(function(oldState) {
      var section = oldState.section;
      section.elements.splice(index, 1, element);

      return { section: section };
    }, this.onSectionChange);
  },

  insertNewElement: function(index) {
    var nextIndex = index + 1;
    var nextType = this.NEW_ELEMENT_SEQUENCE_MAP[this.state.section.elements[index].type];
    var nextElement = { type: nextType, text: "" };
    var nextID = nextType + "-" + nextIndex;

    this.setState(function(oldState) {
      var elements = oldState.section.elements.concat([]);
      elements.splice(nextIndex, 0, nextElement)

      return { section:  { elements: elements } };
    }, function() {
      $("#" + nextID).focus();
    });
  },

  elementNodes: function() {
    console.log("SECTION - state.section: %o", this.state.section);
    var nodes = this.state.section.elements.map(function(element, i) {
      return (
        <div className="uk-margin-left uk-margin-right">
          <ScriptElement
            key={i}
            index={i}
            element={element}
            onElementChange={this.handleElementChange}
            onReturnKeydown={this.insertNewElement} />
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
          <input
            ref="title"
            value={this.state.section.title}
            onInput={this.handleSectionDetailsChange} />
          <textarea
            ref="notes"
            onInput={this.handleSectionDetailsChange}
            value={this.state.section.notes}></textarea>
        </div>
      </div>
    );
  }
});
