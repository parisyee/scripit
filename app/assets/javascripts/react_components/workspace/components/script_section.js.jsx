var ScriptSection = React.createClass({
  getInitialState: function() {
    return { section: this.props.section };
  },

  onSectionChange: function() {
    this.props.onSectionChange(this.props.index, this.state.section)
  },

  handleElementListChange: function(elements) {
    this.setState(function(oldState) {
      var section = oldState.section;
      section.elements = elements;

      return { section: section };
    }, this.onSectionChange)
  },

  handleSectionDetailsChange: function() {
    var section = this.state.section;
    section.title = this.refs.title.value;
    section.notes = this.refs.notes.value;

    this.setState({ section: section }, this.onSectionChange)
  },

  render: function() {
    return (
      <div className="script-section uk-grid uk-grid-collapse uk-height-1-1">
        <input
          className="uk-width-1-1 uk-margin-small-bottom"
          name="section[title]"
          ref="title"
          value={this.state.section.title}
          onInput={this.handleSectionDetailsChange} />
        <div
          className="section-elements uk-width-1-2 uk-height-1-1"
          style={ { background: "lightgrey", overflow: "scroll" } }>
          <ElementList
            elements={this.state.section.elements}
            onElementListChange={this.handleElementListChange} />
        </div>
        <div className="section-details uk-width-1-2 uk-height-1-1" style={ { background: "purple" } }>
          <textarea
            className="uk-width-1-1 uk-height-1-1"
            style={ { resize: "none", border: "none", outline: "none", "font-size": "12px"} }
            name="section[notes]"
            ref="notes"
            onInput={this.handleSectionDetailsChange}
            value={this.state.section.notes}></textarea>
        </div>
      </div>
    );
  }
});
