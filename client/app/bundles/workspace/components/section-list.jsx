import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";
import SectionListItem from "./section-list-item";

export default class SectionList extends React.Component {
  static propTypes = {
    currentSectionIndex: PropTypes.number.isRequired,
    onSectionSelect: PropTypes.func.isRequired,
    sections: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { sections: props.sections };
    _.bindAll(this, "handleSectionSelect");
  };


  handleSectionSelect(index) {
    this.props.onSectionSelect(index);
  };

  sectionNodes() {
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
  };

  render() {
    return(
      <div className="section-list">
        {this.sectionNodes()}
      </div>
    );
  };
};

