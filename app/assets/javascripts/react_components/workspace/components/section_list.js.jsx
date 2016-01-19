var SectionList = React.createClass({
  getInitialState: function() {
    return { sections: this.props.sections };
  },

  sectionNodes: function() {
    var nodes = this.state.sections.map(function(section, i) {
      return (
        <ScriptSection
          key={i}
          index={i}
          section={section}
          onSectionChange={this.props.onSectionChange} />
      );
    }.bind(this));

    return nodes;
  },

  render: function() {
    return (
      <div className="section-list" style={ { minHeight: 40 } }>
        {this.sectionNodes()}
      </div>
    );
  }
});
