import React, { PropTypes } from "react";
import _ from "lodash";
import SectionListItem from "./section-list-item";

export default React.createClass({
  propTypes: {
    currentSectionIndex: PropTypes.number.isRequired,
    onSectionSelect: PropTypes.func.isRequired,
    sections: PropTypes.array.isRequired
  },

  getInitialState: function() {
    return { sections: this.props.sections };
  },


  handleSectionSelect: function(index) {
    this.props.onSectionSelect(index);
  },

  sectionNodes: function() {
    const handleSectionSelect = this.handleSectionSelect;
    const currentSectionIndex = this.props.currentSectionIndex;
    let selected;

    const nodes = this.state.sections.map((section, i) => {
      selected = (i === currentSectionIndex);

      return (
        <SectionListItem
          key={section.url}
          index={i}
          onSectionSelect={handleSectionSelect}
          section={section}
          active={selected} />
      );
    });

    return nodes;
  },

  render: function() {
    return(
      <div className="section-list">
        {this.sectionNodes()}
      </div>
    );
  }
})

