import React, { PropTypes } from "react";
import ScreenplayEditor from "../components/screenplay-editor";

export default class Workspace extends React.Component {
  static propTypes = {
    bootstrapData: PropTypes.string.isRequired
  };

  render() {
    return (
      <div>
        <span
          className="uk-width-2-10 uk-margin-left"
          id="autosave-indicator"
          ref="autosaveIndicator"
          style={ { background: "orange" } }></span>
        <ScreenplayEditor
          screenplay={JSON.parse(this.props.bootstrapData)} />
      </div>
    );
  }
}
