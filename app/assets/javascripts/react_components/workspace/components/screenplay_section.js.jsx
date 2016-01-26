var ScreenplaySection = React.createClass({
  getInitialState: function() {
    return { section: this.props.section };
  },

  // onSectionChange: function() {
  //   this.props.onSectionChange(this.props.index, this.state.section)
  // },

  // handleElementListChange: function(elements) {
  //   this.setState(function(oldState) {
  //     var section = oldState.section;
  //     section.elements = elements;

  //     return { section: section };
  //   }, this.onSectionChange)
  // },

  handleSectionDetailsChange: function() {
    var section = this.state.section;
    section.title = this.refs.title.value;
    section.notes = this.refs.notes.value;

    this.setState({ section: section })// this.saveSection)
  },

  sectionNotesStyles: function() {
    return {
      resize: "none",
      border: "none",
      outline: "none",
      "fontSize": "14px"
    };
  },

  sectionTitleStyles: function() {
    return {
      "fontSize": "14px"
    };
  },

  render: function() {
    return (
      <div className="script-section uk-grid uk-margin-left uk-margin-right uk-height-1-1">
        <input
          className="uk-width-1-1 uk-padding-remove uk-margin-bottom"
          style={this.sectionTitleStyles()}
          name="section[title]"
          ref="title"
          defaultValue={this.state.section.title}
          onInput={this.handleSectionDetailsChange} />
        <div
          className="section-elements uk-padding-remove uk-width-1-2 uk-height-1-1"
          style={ { "overflowY": "scroll" } }>
          <ScreenplayElementList elements={this.state.section.elements} />
        </div>
        <div className="section-details uk-width-1-2 uk-height-1-1">
          <textarea
            className="uk-width-1-1 uk-height-1-1"
            style={this.sectionNotesStyles()}
            name="section[notes]"
            ref="notes"
            onInput={this.handleSectionDetailsChange}
            defaultValue={this.state.section.notes}></textarea>
        </div>
      </div>
    );
  }
});
